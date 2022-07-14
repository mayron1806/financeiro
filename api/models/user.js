const mongoose = require("../database");
const userSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
})
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;