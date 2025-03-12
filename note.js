const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    text: { type: String, required: true },
    color: { type: String, required: true }
});

module.exports = mongoose.model('Note', NoteSchema);
