const router = require("express").Router();
const moment = require("moment");
const validateUserID = require("../middlewares/validateUserID");
const transationModel = require("../models/transation");
router.use(validateUserID);

const validateDate = (req, res, next)=>{
    const date = req.body.date;
    if(!date) return res.status(404).json({error: "Date not found"});

    const date_is_valid = moment(date, "YYYY/MM/DD", true).isValid();
    if(!date_is_valid) return res.status(400).json({error: "Date format invalid"});

    next();
}
// pega transações por usuario
router.get("/", async (req,res) => {
    try{
        const user_id = req.user_id;
        
        // DATE
        const min_date = req.query.min_date;
        const max_date = req.query.max_date;
        const min_date_is_valid = moment(min_date, "YYYY/MM/DD", true).isValid();
        const max_date_is_valid = moment(max_date, "YYYY/MM/DD", true).isValid();
        // CATEGORY
        const category = req.query.category;
        // TYPE
        const transation_type = req.query.transation_type;

        const query = transationModel
        .find({user: user_id})
        .select({name: 1, value: 1, date: 1});
        
        // DATE FILTER
        if(min_date_is_valid) query.find({date: {$gte: moment(min_date)}});
        if(max_date_is_valid) query.find({date: {$lte: moment(max_date)}});
        
        if(category){
            const categories = category.split(",");
            query.populate({
                path: "category",
                match: {name: {$in: categories}},
                select: {name: 1, isEntry: 1}
            })
        }
        if(transation_type){
            const is_entry = transation_type === "entry";
            query.populate({
                path: "category", 
                match: {isEntry: is_entry},
                select: {name: 1, isEntry: 1}
            })
        }
        const result = await query;
        const transations = result.filter(transation => transation.category !== null);

        res.status(200).json(transations);
    }catch(error){
        res.status(400).json({error: "Catch: " + error})
    }
})
// adiciona transação
router.post("/", validateDate, async (req,res)=>{
    try{
        const user_id = req.user_id;

        const {name, value, category, date} = req.body;
        
        if(!name || !value || !category){
            return res.status(404).json({error: "Name, value, category not found"});
        }

        const current_date = moment();
        if(moment(date) > current_date){
            return res.status(400).json({error: "You cannot add transations for a date after than today"});
        }
        // deixa a data com um formato padrão
        const formated_date = moment(date).format("L");

        const transation = {
            name,
            value,
            category,
            user: user_id,
            date: formated_date
        }
        const new_transation = await transationModel.create(transation);
        res.status(201).json(new_transation);  
    }catch(error){
        res.status(400).json({error: "Catch: " + error})
    }
})
// atualiza transação
router.put("/", validateDate, async (req, res) => {
    try{
        const user_id = req.user_id;
        const {transation_id, name, category, value, date} = req.body;
        if(!transation_id) return res.status(404).json({error: "Transation id not found"});

        if(!name && !category && !value){
            return res.status(404).json({error: "You need to send a name, category or value"});
        }
        const current_date = moment();
        if(moment(date) > current_date){
            return res.status(400).json({error: "You cannot update transations for a date after than today"});
        }
        const transation = {
            name, 
            category,
            date,
            value
        }
        const updated_transation = await transationModel
            .findByIdAndUpdate({_id: transation_id, user: user_id}, transation, {new: true});

        res.status(200).json(updated_transation);
    }catch(error){
        res.status(400).json({error: "Catch: " + error})
    }
})
// deleta transação
router.delete("/", async (req, res) => {
    try{
        const user_id = req.user_id;
        const { transations } = req.body;
        if(!transations || transations.length == 0){
            return res.status(404).json({error: "Transations not found"});
        }
        const deleted = await transationModel.deleteMany({_id: {$in: transations}, user: user_id});

        res.status(200).json(deleted);
    }catch(error){
        res.status(400).json({error: "Catch: " + error})
    }
})


module.exports = router;