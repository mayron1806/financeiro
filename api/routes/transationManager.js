const router = require("express").Router();
const moment = require("moment");
const mongoose = require("../database");
const validateUserID = require("../middlewares/validateUserID");
const transationModel = require("../models/transation");
const transationManagerModel = require("../models/transationManager");

// midleware
router.use(validateUserID);

const createTransation = async(user_id, name, value, category, date) => {
    try{
        const formated_date = moment(date).format("L");

        const transation = {
            name,
            value,
            category,
            user: user_id,
            date: formated_date
        }
        await transationModel.create(transation);
        return true;
    }catch(error){
        return error;
    }
}
const nameIsUsed = (name, scheduled_transations)=>{
    scheduled_transations.forEach(transation => {
        if(transation.transation_model.name === name) return true; 
    });
    return false;
}

// busca todas tarefas agendadas 
router.get("/schedule", async (req, res)=>{
    try{
        const user_id = req.user_id;
        // pega o gerenciador de transações do usuario
        const manager = await transationManagerModel
        .findOne({user: user_id})
        .populate("scheduled_transations.transation_model.category", "name isEntry");
        
        if(!manager) return res.status(404).json({error: "Transation manager not found"});

        res.status(200).json(manager.scheduled_transations);
    }catch(error){
        res.status(400).json({error: "Catch: " + error});
    }
});
// cria um novo gerenciador de transações
router.post("/", async(req, res)=>{
    try{
        const user_id = req.user_id;

        const manager = await transationManagerModel.create({user: user_id});
        res.status(201).json({transationManager: manager});
    }catch(error){
        res.status(400).json({error: "Catch: " + error});
    }
});
// verifica se tem uma tarefa para ser executada
router.post("/schedule/execute", async (req, res)=>{
    try{
        const user_id = req.user_id;
        // pega o gerenciador de transações do usuario
        const manager = await transationManagerModel.findOne({user: user_id});
        if(!manager) return res.status(404).json({error: "Transation manager not found"});
        
        // percorre todas transações agendadas
        for(const [index, transation] of manager.scheduled_transations.entries()){
            // verifica se precisa criar mais uma transação
            if(transation.execution.max && transation.execution.count >= transation.execution.max) continue;
            
            let next_date = moment(transation.execution.next_date);
            const current_date = moment();
            // se a data ainda não chegou ela é ignorada
            if(next_date >= current_date) continue;

            // vai criar transações para cada mes enquanto não chegar no mes atual
            while(next_date < current_date){
                const name = transation.transation_model.name;
                const value = transation.transation_model.value;
                const category = transation.transation_model.category;
                const date = next_date;
                
                const result = await createTransation(user_id, name, value, category, date);

                if(result !== true)return res.status(400).json({error: result});

                next_date = moment(next_date).add(1, "month");
                //manager.scheduled_transations[key].execution.next_date = next_date;
                transation.execution.next_date = next_date;
                transation.execution.count++;
            }
        }
        await manager.save();
        res.status(200).json(manager);
    }catch(error){
        res.status(400).json({error: "Catch: " + error});
    }
});
// adiciona uma transação agendada
router.post("/schedule/add", async (req, res)=>{
    try{
        const user_id = req.user_id;

        const {name, value, category, date, n_executions} = req.body;
        if(!name || !value || !category) return res.status(404).json({error: "Name, value or category not found"});
        
        let next_date = null;
        next_date = moment(date, "YYYY/MM/DD", true).isValid() ?? moment(date);
        if(!next_date || next_date < moment()) next_date = moment();
        
        const manager = await transationManagerModel.findOne({user: user_id});
        if(!manager) return res.status(404).json({error: "Manager not found"});
        
        // verifica se o nome da transação está sendo usado
        if(nameIsUsed(name, manager.scheduled_transations)){
            return res.status(409).json({error: "Name has been used"});
        }
        
        const new_schedule_transation = {
            _id: new mongoose.Types.ObjectId(),
            transation_model: {name, value, category},
            execution: {next_date, max: n_executions}
        }

        manager.scheduled_transations.push(new_schedule_transation);
        const result = await manager.save();
        res.status(200).json({result});
    }catch(error){
        res.status(400).json({error: "Catch: " + error});
    }
})
// atualiza uma transação agendada
router.patch("/schedule/update", async (req, res)=>{
    try{
        const user_id = req.user_id;

        const {transation_id, name, value, category, date, max_executions} = req.body;
        if(!transation_id) return res.status(404).json({error: "Transation id not found"});

        let next_date;
        if(date){
            // valida a data
            next_date = moment(date, "YYYY/MM/DD", true).isValid() ?? moment(date);
            if(!next_date || next_date < moment()) next_date = moment();
        }

        // pega o manager do usuario
        const manager = await transationManagerModel.findOne({"user": user_id});
        if(!manager) return res.status(404).json({error: "Manager not found"});
        
        // verifica se o nome da transação está sendo usado
        if(nameIsUsed(name, manager.scheduled_transations)){
            return res.status(409).json({error: "Name has been used"});
        }
        
        // pega o id de todas tarefas agendadas
        const all_id = manager.scheduled_transations.map(st => st._id.toString());
        // pega indice da tarefa para ser atualizada
        const index = all_id.indexOf(transation_id);
        if(index === -1) return res.status(404).json({error: "Transation not found"});
        
        
        // atualizações
        const new_schedule_transation = manager.scheduled_transations[index];
        
        if(name) new_schedule_transation.transation_model.name = name;
        if(value) new_schedule_transation.transation_model.value = value;
        if(category) new_schedule_transation.transation_model.category = category;
        if(next_date) new_schedule_transation.execution.next_date = next_date;
        if(max_executions) new_schedule_transation.execution.max = max_executions;

        manager.scheduled_transations[index] = new_schedule_transation;

        const updated_manager = await manager.save();

        res.status(200).json(updated_manager);
    }catch(error){
        res.status(400).json({error: "Catch: " + error});
    }
})
// remove todas transações agendadas
router.patch("/schedule/reset", async (req,res)=>{
    try{
        const user_id = req.user_id;
        
        const manager = await transationManagerModel.findOne({user: user_id});
        if(!manager) return res.status(404).json({error: "Manager not found"});
        
        manager.scheduled_transations = [];
        const result = await manager.save();
        res.status(200).json({result});
    }catch(error){
        res.status(400).json({error: "Catch: " + error});
    }
})
// deleta transação
router.patch("/schedule/remove", async (req,res)=>{
    try{
        const user_id = req.user_id;
        
        const { transation_id } = req.body;
        if(!transation_id) return res.status(404).json({error: "Transation model id not found"});

        const manager = await transationManagerModel.findOne({user: user_id});
        if(!manager) return res.status(404).json({error: "Manager not found"});

        let transations = manager.scheduled_transations.filter(t => t._id.toString() !== transation_id);
        manager.scheduled_transations = transations;
        const result = await manager.save();
        res.status(200).json({result});
    }catch(error){
        res.status(400).json({error: "Catch: " + error});
    }
})
module.exports = router;