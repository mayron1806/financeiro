const router = require("express").Router();
const moment = require("moment");
const validateUserID = require("../middlewares/validateUserID");
const transationModel = require("../models/transation");
const mongoose = require("mongoose");
router.use(validateUserID);

const validateDate = (req, res, next)=>{
    const date = moment(req.body.date);
    if(!date) next();

    const current_date = moment();
    if(date > current_date) return res.status(400).json({error: "You cannot add transactions for a date greater than today"})
    next();
}
// pega transações por usuario
router.get("/", async (req,res) => {
    try{
        const user_id = req.user_id;
        const {category} = req.body;
        
        let transations;

        const filter = req.query.filter;
        
        switch(filter){
            // filtra transaçoes por categoria
            case "category":
                if(!category) return res.status(404).json({error: "no category send"})
                transations = await transationModel
                .find({user: user_id, category: category})
                .populate("category", "name isEntry")
                .select("name value date");
                break;
            // filtra transaçoes por categoria de entrada
            case "entry":
                const entryTransations = await transationModel
                .find({user: user_id})
                .populate("category", "name isEntry")
                .select("name value date");
                transations = entryTransations.filter(transation => transation.category.isEntry);
                break;
            // filtra transaçoes por categoria de saida
            case "exit":
                const exitTransations = await transationModel
                .find({user: user_id})
                .populate("category", "name isEntry")
                .select("name value date");
                transations = exitTransations.filter(transation => !transation.category.isEntry);
                break;
            // pega todas transações
            default:
                transations = await transationModel
                .find({user: user_id})
                .populate("category", "name isEntry")
                .select("name value date");
                break;
        }
        res.status(200).json(transations);
    }catch(error){
        res.status(400).json({error: "Catch: " + error})
    }
})

// adiciona transação
router.post("/create",validateDate, async (req,res)=>{
    try{
        const user_id = req.user_id;

        const {name, value, category, date} = req.body;
        if(!name || !value || !category || !date){
            return res.status(404).json({error: "Name, value, category or date not found"});
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
router.put("/update", validateDate, async (req, res) => {
    try{
        const user_id = req.user_id;
        const {transation_id, name, category, value, date} = req.body;
        if(!transation_id) return res.status(404).json({error: "Transation id not found"});

        if(!name && !category && !value && !date){
            return res.status(404).json({error: "You need to send a name, category, value or date"});
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
router.delete("/delete", async (req, res) => {
    try{
        const user_id = req.user_id;
        const {transation_id} = req.body;
        if(!transation_id) return res.status(404).json({error: "Transation id not found"});
        const deleted_transation = await transationModel
            .findOneAndDelete({_id: transation_id, user: user_id});

        if(!deleted_transation) return res.status(404).json({error: "Transation not found"})

        res.status(200).json(deleted_transation);
    }catch(error){
        res.status(400).json({error: "Catch: " + error})
    }
})


module.exports = router;