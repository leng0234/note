require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const Note = require('./note');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(flash());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ Database connection error:", err));

// Home Route - Fetch All Notes
app.get('/', async (req, res) => {
    try {
        const notes = await Note.find();
        res.render('index', { notes, messages: req.flash() });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching notes");
    }
});

// Add Note Route
app.post('/add-note', async (req, res) => {
    try {
        const { text, color } = req.body;
        await Note.create({ text, color });
        req.flash('success', 'Note added successfully!');
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to add note.');
        res.redirect('/');
    }
});

// Delete Note Route
app.post('/delete-note', async (req, res) => {
    try {
        const noteId = req.body.id;
        if (!noteId) {
            req.flash('error', 'Note ID is missing.');
            return res.redirect('/');
        }

        await Note.findByIdAndDelete(noteId);
        req.flash('success', 'Note deleted successfully!');
        res.redirect('/');
    } catch (err) {
        console.error("❌ Error deleting note:", err);
        req.flash('error', 'Error deleting note.');
        res.redirect('/');
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


