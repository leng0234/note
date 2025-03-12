const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Note text is required"],
    trim: true
  },
  color: {
    type: String,
    required: [true, "Note color is required"]
  }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

module.exports = mongoose.model('Note', noteSchema);


