const router = require("express").Router();
const moment = require("moment");
const validateUserID = require("../middlewares/validateUserID");
const scheduleModel = require("../models/schedule");

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

// busca todas tarefas agendadas 
router.get("/", async (req, res)=>{
    try{
        const user_id = req.user_id;

        const schedules = await scheduleModel
        .find({user: user_id})
        .populate("category", "name isEntry")
        .select({__v : 0});

        res.status(200).json(schedules);
    }catch(error){
        res.status(400).json({error: "Catch: " + error});
    }
});
// verifica se tem uma tarefa para ser executada
router.post("/execute", async (req, res)=>{
    try{
        const user_id = req.user_id;
        // pega o gerenciador de transações do usuario
        const schedules = await scheduleModel.find({ user: user_id });
        if(schedules.length == 0) return res.status(404).json({error: "User can`t schedules"})
        // percorre todas transações agendadas
        for(const [index, schedule] of schedules.entries()){
            // verifica se precisa criar mais uma transação
            if(schedule.execution.max && (schedule.execution.count >= schedule.execution.max)) continue;
            
            let next_date = moment(schedule.execution.next_date);
            const current_date = moment();
            // se a data ainda não chegou ela é ignorada
            if(next_date >= current_date) continue;

            // vai criar transações para cada mes enquanto não chegar no mes atual
            while(next_date < current_date){
                const name = schedule.name;
                const value = schedule.value;
                const category = schedule.category;
                const date = next_date;
                
                const result = await createTransation(user_id, name, value, category, date);

                if(result !== true) return res.status(400).json({error: result});

                next_date = moment(next_date).add(1, "month");
                
                schedule.execution.next_date = next_date;
                schedule.execution.count++;
            }
            await schedule.save();
        }
        res.status(200).json(schedules);
    }catch(error){
        res.status(400).json({error: "Catch: " + error});
    }
});
// adiciona uma transação agendada
router.post("/", async (req, res)=>{
    try{
        const user_id = req.user_id;

        const {name, value, category, next, n_executions} = req.body;
        if(!name || !value || !category) return res.status(404).json({error: "Name, value or category not found"});
        
        let next_date = null;
        next_date = moment(next, "YYYY/MM/DD", true).isValid() ?? moment(next);
        if(!next_date || next_date < moment()) next_date = moment();
        
        // verifica se o nome esta sendo usado
        const doc_using_name = await scheduleModel.findOne({user: user_id, name: name});
        if(doc_using_name) return res.status(409).json({error: "Name has been used"});

        const new_schedule = {
            name, 
            value, 
            category,
            user: user_id,
            execution: {
                next_date, 
                max: n_executions
            }
        }
        const schedule = await scheduleModel.create(new_schedule);
        res.status(200).json(schedule);
    }catch(error){
        res.status(400).json({error: "Catch: " + error});
    }
})
// atualiza uma transação agendada
router.patch("/", async (req, res)=>{
    try{
        const user_id = req.user_id;

        const {schedule_id, name, value, category, date, max_executions} = req.body;
        if(!schedule_id) return res.status(404).json({error: "Schedule id not found"});

        let next_date = null;
        next_date = moment(date, "YYYY/MM/DD", true).isValid() ?? moment(date);
        if(!next_date || next_date < moment()) next_date = moment();
        
        const schedule = await scheduleModel.findById(schedule_id);
        // verifica se a transação agendada existe
        if(!schedule) return res.status(404).json({error: "Schedule not found"});
        // verifica se quem esta tentando atualizar é o usuar
        if(schedule.user.toString() !== user_id) return res.status(401).json({error: "You can`t access"});
        
        // atualizações
        if(name) schedule.name = name;
        if(value) schedule.value = value;
        if(category) schedule.category = category;
        if(next_date) schedule.execution.next_date = next_date;
        if(max_executions) schedule.execution.max = max_executions;

        const updated = await schedule.save();

        res.status(200).json(updated);
    }catch(error){
        res.status(400).json({error: "Catch: " + error});
    }
})
// deleta transação agendadas
router.delete("/", async (req,res)=>{
    try{
        const user_id = req.user_id;
        
        const { schedules } = req.body;
        if(!schedules || schedules.length == 0) {
            return res.status(404).json({error: "Schedules not found"});
        }
        const deleted = await scheduleModel.deleteMany({_id: {$in: schedules}, user: user_id});
        res.status(200).json(deleted);
    }catch(error){
        res.status(400).json({error: "Catch: " + error});
    }
})
module.exports = router;