const mongoose = require("../database");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user"
  },
  is_entry: {
    type: Boolean,
    required: true,
    default: false
  },
  color: {
    type: String,
    required: true
  }
})
const categoryModel = mongoose.model("category", categorySchema);

module.exports = categoryModel;