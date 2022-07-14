const mongoose = require("../database");

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    isEntry: {
        type: Boolean,
        required: true,
        default: false
    }
})
const categoryModel = mongoose.model("category", categorySchema);

module.exports = categoryModel;