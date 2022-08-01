const router = require("express").Router();
const categoryModel = require("../models/category");
const transationModel = require("../models/transation");
const scheduleModel = require("../models/schedule");
const validateUserID = require("../middlewares/validateUserID");
router.use(validateUserID);

// verifica se ja possui uma categoria com esse nome
const validateCategoryName = async(req, res, next) => {
  const user_id = req.user_id;
  const { name } = req.body;
  if(!name) return next();

  const category_with_name = await categoryModel.findOne({name: name, user: user_id});
  if(category_with_name) return res.status(409).json("This category has exists");
  
  next();
}
// GET =======================================================================================
router.get("/", async(req, res) => {
  try{
    const user_id = req.user_id;
    const { is_entry } = req.query;
    let categories;
    if(is_entry === undefined){
      categories = await categoryModel
      .find({user: user_id});
    }
    else{
      categories = await categoryModel
      .find({user: user_id, is_entry: is_entry});
    }
    res.status(200).json(categories);
  }catch(error){
    res.status(400).json("Catch: " + error)
  }
});
// POST =======================================================================================
// cria uma nova categoria
router.post("/", validateCategoryName, async(req, res) => {
  try{
    const user_id = req.user_id;
    const {name, is_entry, color} = req.body;
    
    const new_category = {
      name,
      is_entry,
      color,
      user: user_id
    }
    const category = await categoryModel.create(new_category);

    res.status(201).json(category);
  }catch(error){
    res.status(400).json("Catch: " + error);
  }
});

// PUT =======================================================================================
// atualiza uma categoria
router.put("/",validateCategoryName, async (req, res)=>{
  try{
    const user_id = req.user_id;
    const {category_id, name, is_entry, color} = req.body;

    // vefifica se existe uma categoria com o id passado
    const category = await categoryModel.findById(category_id);
    if(!category) return res.status(404).json("Esta categoria não existe.");

    // verifica se quem está tentando atualizar é o criador da categoria
    if(category.user != user_id) return res.status(401).json("Você não tem autorização para editar essa categoria.");
   
    // verifica se o nome está sendo usado
    const category_with_name = await categoryModel.findOne({name: name, user: user_id});
    if(category_with_name) return res.status(409).json("O nome ja está sendo usado.");
    
    // se a propriedade is_entry foi alterada, todas as transações da categoria serão atualizadas
    if(is_entry !== undefined && category.is_entry !== is_entry){
      const transations_from_category = await transationModel.find({category: category_id, user: user_id});
      transations_from_category.forEach(async (transation) => {
        transation.value = is_entry ? Math.abs(transation.value) : -Math.abs(transation.value);
        await transation.save();
      })
    }
    
    const new_category = {
      name,
      is_entry, 
      color
    }
    const updated_category = await categoryModel
    .findOneAndUpdate({_id: category_id, user: user_id}, new_category, {new: true});
    res.status(201).json(updated_category);
  }
  catch(error){
    res.status(400).json("Catch: " + error)
  }
});

// DELETE =======================================================================================
// deleta categoria
router.delete("/", async(req, res) => {
  try{
    const user_id = req.user_id;
    const { categories } = req.body;
    if(!categories || categories.length === 0) return res.status(404).json("Esta categoria não existe.");
    
    const categories_to_delete = await categoryModel.find({_id: {$in: categories}, user: user_id});
    if(categories_to_delete.length === 0) return res.status(200).json("Nenhuma categoria foi selecionada para ser deletada.");
    
    // deleta as transações da categoria
    categories_to_delete.forEach(async (category) => {
      await transationModel.deleteMany({category: category._id, user: user_id});
    });

    // deleta as transações agendadas da categoria
    categories_to_delete.forEach(async (category) => {
      await scheduleModel.deleteMany({category: category._id, user: user_id});
    });
    
    // deleta categorias
    const deleted = await categoryModel.deleteMany({_id: {$in: categories}, user: user_id});

    res.status(200).json(deleted);
  }
  catch(error){
    res.status(400).json("Catch: " + error);
  }
});
module.exports = router;