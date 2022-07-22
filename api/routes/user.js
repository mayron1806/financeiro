const userModel = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.post("/signin", async(req,res)=>{
    try{
        const {name, password} = req.body;
        if(!name || !password){
            return res.status(400).json("Name or password is null");
        }

        // pega usuario pelo nome
        const user = await userModel.findOne({name: name});
        if(!user){
            return res.status(404).json("User not found");
        }
        // compara senhas
        const isEquals = await bcrypt.compare(password.toString(), user.password);
        if(!isEquals){
            return res.status(400).json("Incorrect password");
        }
        return res.status(200).json(user);
    }
    catch(err){
        return res.status(400).json("Catch: " + err);
    }
})
router.post("/signup", async(req,res)=>{
    try{
        const {name, password} = req.body;
        if(!name || !password){
            return res.status(400).json("Name or password is null");
        }

        // hash password
        const salt = await bcrypt.genSalt(saltRounds);
        const password_hash = await bcrypt.hash(password.toString(), salt);
        const user = {
            name: name,
            password: password_hash
        }
        // cria usuario
        const new_user = await userModel.create(user);
        return res.status(201).json({user: new_user});
    }
    catch(err){
        return res.status(400).json("Catch: " + err);
    }
})

module.exports = router;
