const router = require("express").Router();
const moment = require("moment");
const validateUserID = require("../middlewares/validateUserID");
const categoryModel = require("../models/category");
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
    .populate({path: "category"});

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

    const {name, value, category, next, n_executions: max} = req.body;
    if(!name || !value || !category) return res.status(404).json({error: "Name, value or category not found"});
    
    let next_date = new Date(moment().toISOString().slice(0, 10));
    if(next && moment(next) >= moment()){
      const moment_date = moment(next, "YYYY-MM-DD").toDate();
      const date_string = moment_date.toISOString().slice(0, 10);
      next_date = new Date(date_string);
    }

    // verifica se a categoria existe
    const category_db = await categoryModel.findById(category);
    if(!category_db) return res.status(404).json("Category not found");

    // formata valor da transação de acordo com o tipo da categoria
    const formated_value = category_db.is_entry ? Math.abs(value) : -Math.abs(value);

    // verifica se o nome esta sendo usado
    const doc_using_name = await scheduleModel.findOne({user: user_id, name: name});
    if(doc_using_name) return res.status(409).json({error: "Name has been used"});

    const new_schedule = {
      name, 
      value : formated_value, 
      category,
      user: user_id,
      execution: {
        next_date, 
        max
      }
    }
    await scheduleModel.create(new_schedule);

    // pega as transações agendadas
    const schedules = await scheduleModel
      .find({user_id: user_id})
      .populate("category", "name is_entry");
    
    res.status(200).json(schedules);
  }catch(error){
    res.status(400).json("Catch: " + error);
  }
})
// atualiza uma transação agendada
router.put("/", async (req, res)=>{
  try{
    const user_id = req.user_id;
    const {schedule_id, name, value, category_id, next, max} = req.body;
    const schedule = await scheduleModel.findById(schedule_id);
    if(!schedule) return res.status(404).json({error: "Schedule not found"});
    
    // verifica se a data e menor que a data atual
    if(next){
      const current_date = moment();
      if(moment(next) < current_date) return res.status(400).json("You cannot update schedule for a date before than today.");
    }

    let category_db;
    if(category_id){
      // verifica se tem uma categoria com o id passado
      category_db = await categoryModel.findById(category_id);
      if(!category_db) return res.status(404).json("Category not found");
    }
    else{
      const currentSchedule = await scheduleModel
      .findById(schedule_id)
      .populate({path: "category"})
      .select({category: 1});
      if(!currentSchedule) return res.status(404).json("Transation not found");
      category_db = currentSchedule.category;
    }

    let new_value;
    // define o value formatado de acordo com a categoria
    if(value) {
      new_value = category_db.is_entry ? Math.abs(value) : -Math.abs(value);
    }
    else{
      const old_value = schedule.value;
      new_value = category_db.is_entry ? Math.abs(old_value) : -Math.abs(old_value);
    }
    const new_schedule = {
      name, 
      value,
      category: category_id,
      execution: {
        next_date: next,
        max: max
      }
    }
    const schedule_updated = await scheduleModel
    .findOneAndUpdate({_id: schedule_id, user: user_id}, new_schedule, {new: true});
    res.status(200).json(schedule_updated);
  }catch(error){
    res.status(400).json("Catch: " + error);
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
    res.status(400).json("Catch: " + error);
  }
})
module.exports = router;