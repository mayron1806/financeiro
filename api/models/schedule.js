const mongoose = require("../database");

const ScheduleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    user: {
        type: mongoose.Types.ObjectId, 
        ref: "user"
    },
    execution: {
        next_date: Date,
        max: {type: Number, default: null},
        count: {type: Number, default: 0}
    }
})

const scheduleModel = mongoose.model("schedule", ScheduleSchema);

module.exports = scheduleModel;