const mongoose = require("../database");

const TransationManagerSchema = mongoose.Schema({
    scheduled_transations: {
        type: [{
            _id: {
                type: mongoose.Types.ObjectId, 
                unique: true, 
                required: true
            },
            transation_model: {
                name: String,
                value: Number,
                category: {type: mongoose.Types.ObjectId, ref: "category"}
            },
            execution: {
                next_date: Date,
                max: {type: Number, default: null},
                count: {type: Number, default: 0}
            }
        }],
        default: []
    },
    user:{
        type: mongoose.Types.ObjectId,
        unique: true,
        required: true
    }
});
const transationModel = mongoose.model("manager", TransationManagerSchema);

module.exports = transationModel;