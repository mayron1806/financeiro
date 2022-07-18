const router = require("express").Router();
const categoryModel = require("../models/category");
const validateUserID = require("../middlewares/validateUserID");
router.use(validateUserID);

// verifica se ja possui uma categoria com esse nome
const validateCategoryName = async(req, res, next) => {
    const user_id = req.user_id;
    const {name} = req.body;
    if(!name) return res.status(404).json({error: "Category name not found"});

    const category_with_name = await categoryModel.findOne({name: name, user: user_id});
    if(category_with_name) return res.status(409).json({error: "This category has exists"});

    next();
}
// GET =======================================================================================
router.get("/", async(req, res) => {
    try{
        const user_id = req.user_id;
        const filter = req.query.filter;
        let categories;
        switch(filter){
            // categorias de entrada
            case "entry":
                categories = await categoryModel
                .find({user: user_id, isEntry: true})
                .select({title: 1, user: 1, isEntry: 1});
                break;
            // categorias de saida
            case "exit":
                categories = await categoryModel
                .find({user: user_id, isEntry: false})
                .select({title: 1, user: 1, isEntry: 1});
                break;
            // todas categorias
            default: 
                categories = await categoryModel
                .find({user: user_id})
                .select({title: 1, isEntry: 1, user: 1});
                break;
        }
        res.status(200).json(categories);
    }catch(error){
        res.status(400).json({error: "Catch: " + error})
    }
})
// POST =======================================================================================
// cria uma nova categoria
router.post("/", validateCategoryName, async(req, res) => {
    try{
        const user_id = req.user_id;
        const {name, is_entry} = req.body;

        const category = {
            name,
            user: user_id,
            isEntry: is_entry
        }
        const new_category = await categoryModel.create(category);
        res.status(201).json(new_category);
    }catch(error){
        res.status(400).json({error: "Catch: " + error})
    }
})

// PUT =======================================================================================
// atualiza uma categoria
router.put("/",validateCategoryName, async (req, res)=>{
    try{
        const user_id = req.user_id;

        const {category_id, name, is_entry} = req.body;
        if(!category_id) return res.status(404).json({error:"Category id not found"});
        if(!name && !is_entry) return res.status(404).json({error: "title and entry not found"});
        
        const new_category = {
            name,
            isEntry: is_entry
        }
        const category = await categoryModel
            .findOneAndUpdate({_id: category_id, user: user_id}, new_category, {new: true});
        res.status(201).json(category);
    }
    catch(error){
        res.status(400).json({error: "Catch: " + error})
    }
})

// DELETE =======================================================================================
// deleta categoria
router.delete("/", async(req, res) => {
    try{
        const user_id = req.user_id;
        const {categories} = req.body;

        if(!categories || categories.length == 0){
            return res.status(404).json({error:"Categories not found"});
        }
        const deleted = await categoryModel.deleteMany({_id: {$in: categories}, user: user_id});
        
        res.status(200).json(deleted);
    }
    catch(error){
        res.status(400).json({error: "Catch: " + error})
    }
})
module.exports = router;