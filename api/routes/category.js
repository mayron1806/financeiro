const router = require("express").Router();
const categoryModel = require("../models/category");
const validateUserID = require("../middlewares/validateUserID");
router.use(validateUserID);

// verifica se ja possui uma categoria com esse nome
const validateCategoryName = async(req, res, next) => {
    const user_id = req.user_id;
    const {name} = req.body;
    if(!name) return res.status(404).json("Category name not found");

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
})
// POST =======================================================================================
// cria uma nova categoria
router.post("/", validateCategoryName, async(req, res) => {
  try{
    const user_id = req.user_id;
    const {name, is_entry, color} = req.body;
    
    const category = {
      name,
      user: user_id,
      is_entry: is_entry,
      color
    }
    await categoryModel.create(category);
    // pega as categorias para retornar
    const categories = await categoryModel.find({user: user_id});
    if(!categories) return res.status(404).json("Categories not found")
    res.status(201).json(categories);
  }catch(error){
    res.status(400).json("Catch: " + error);
  }
})

// PUT =======================================================================================
// atualiza uma categoria
router.put("/",validateCategoryName, async (req, res)=>{
    try{
      const user_id = req.user_id;

      const {category_id, name, is_entry} = req.body;
      if(!category_id) return res.status(404).json("Category id not found");
      if(!name && !is_entry) return res.status(404).json( "title and entry not found");
      
      const new_category = {
        name,
        is_entry
      }
      const category = await categoryModel
      .findOneAndUpdate({_id: category_id, user: user_id}, new_category, {new: true});
      res.status(201).json(category);
    }
    catch(error){
        res.status(400).json("Catch: " + error)
    }
})

// DELETE =======================================================================================
// deleta categoria
router.delete("/", async(req, res) => {
    try{
        const user_id = req.user_id;
        const {categories} = req.body;

        if(!categories || categories.length == 0){
            return res.status(404).json("Categories not found");
        }
        const deleted = await categoryModel.deleteMany({_id: {$in: categories}, user: user_id});
        
        res.status(200).json(deleted);
    }
    catch(error){
        res.status(400).json("Catch: " + error)
    }
})
module.exports = router;