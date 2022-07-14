const mongoose = require("../database");

const transationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: "category",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    }
})

const transationModel = mongoose.model("transation", transationSchema);

module.exports = transationModel;