const router = require("express").Router();
const moment = require("moment");
const validateUserID = require("../middlewares/validateUserID");
const transationModel = require("../models/transation");
const categoryModel = require("../models/category");
const { min } = require("moment");
router.use(validateUserID);

const validateDate = (req, res, next)=>{
    const date = req.body.date;
    if(!date) return res.status(404).json("Date not found");

    const date_formated = moment(date);
    const date_is_valid = moment(date_formated, "YYYY-MM-DD", true).isValid();
    if(!date_is_valid) return res.status(400).json("Date format invalid");

    next();
}
// pega transações por usuario
router.get("/", async (req,res) => {
  try{
    const user_id = req.user_id;
    
    const {name, min_date, max_date, categories, is_entry, value} = req.query;

    const query = transationModel
    .find({user: user_id});

    // DATE FILTER
    if(min_date) {
      const moment_min_date = moment(min_date, "YYYY-MM-DD").toDate();
      const string_min_date = new Date(moment_min_date).toISOString().slice(0, 10);
      const final_min_date = new Date(string_min_date);
      
      query.find({date: {$gte: final_min_date}});
    }
    if(max_date) {
      const moment_max_date = moment(max_date, "YYYY-MM-DD").toDate();
      const string_max_date = new Date(moment_max_date).toISOString().slice(0, 10);
      const final_max_date = new Date(string_max_date);
      
      query.find({date: {$lte: final_max_date}});
    }
    
    // NAME FILTER
    if(name && name.length > 0) query.find({name: new RegExp(name)});

    // VALUE FILTER
    if(value && value !== 0) query.find({value: value});
    
    // CATEGORY FILTER
    if(categories && categories.length > 0) query.find({category: {$in: categories}});
    
    // ENTRY FILTER
    if(typeof(is_entry) === "boolean"){
      query.populate({
        path: "category", 
        match: {is_entry: is_entry},
        select: {name: 1, is_entry: 1}
      })
    }
    query.populate({path: "category", select: {name: 1, is_entry: 1}})
    .select({name: 1, value: 1, date: 1, category: 1});

    const result = await query;
    const transations = result.filter(transation => transation.category !== null);

    res.status(200).json(transations);
  }catch(error){
    console.log(error);
    res.status(400).json("Catch: " + error);
  }
})
// adiciona transação
router.post("/", validateDate, async (req,res)=>{
    try{
      const user_id = req.user_id;
      const {name, value, category, date} = req.body;
      
      if(!name || !value || !category || !date){
        return res.status(404).json("Name, value, category or date not found.");
      }

      const current_date = moment();
      if(moment(date) > current_date){
        return res.status(400).json("You cannot add transations for a date after than today");
      }
      // deixa a data com um formato padrão
      const moment_date = moment(date, "YYYY-MM-DD").toDate();
      const date_string = moment_date.toISOString().slice(0, 10);
      const final_date = new Date(date_string);

      // verifica se tem uma categoria
      const category_db = await categoryModel.findById(category);
      if(!category_db) return res.status(404).json("Category not found");

      // formata o valor da transação para o tipo da categoria
      const formated_value = category_db.is_entry ? Math.abs(value) : -Math.abs(value);

      const transation = {
        name,
        value : formated_value,
        category,
        user: user_id,
        date: final_date
      };
      const new_transation = await transationModel.create(transation);
      res.status(201).json(new_transation);  
    }catch(error){
        res.status(400).json("Catch: " + error);
    }
})
// atualiza transação
router.put("/", validateDate, async (req, res) => {
    try{
      const user_id = req.user_id;
      const {transation_id, name, category, value, date} = req.body;
      if(!transation_id) return res.status(404).json("Transation id not found");

      if(!name && !category && !value){
          return res.status(404).json("You need to send a name, category or value");
      }
      const current_date = moment();
      if(moment(date) > current_date){
          return res.status(400).json("You cannot update transations for a date after than today");
      }
      // verifica se tem uma categoria
      const category_db = await categoryModel.findById(category);
      if(!category_db) return res.status(404).json("Category not found");

      // formata o valor da transação para o tipo da categoria
      const formated_value = category_db.is_entry ? Math.abs(value) : -Math.abs(value);

      const transation = {
        name, 
        category,
        date,
        value: formated_value
      }
      const updated_transation = await transationModel
        .findByIdAndUpdate({_id: transation_id, user: user_id}, transation, {new: true});

      res.status(200).json(updated_transation);
    }catch(error){
      res.status(400).json("Catch: " + error);
    }
})
// deleta transação
router.delete("/", async (req, res) => {
    try{
      const user_id = req.user_id;
      const { transations } = req.body;
      if(!transations || transations.length == 0){
        return res.status(404).json("Transations not found");
      }
      const deleted = await transationModel.deleteMany({_id: {$in: transations}, user: user_id});

      res.status(200).json(deleted);
    }catch(error){
      res.status(400).json("Catch: " + error);
    }
})


module.exports = router;