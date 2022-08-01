const userModel = require("../models/user");

const validateUserID = async (req, res, next) => {
    try{
        const user_id = req.headers['user-id'];
        // verifica se tem um usuario com esse id
        const user = await userModel.findById(user_id);
        if(!user) return res.status(404).json("Usuario não encontrado.");
        req.user_id = user_id;
        next();
    }
    catch(error){
        res.status(400).json("Catch: " + error);
    }
}
module.exports = validateUserID;