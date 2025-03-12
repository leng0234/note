require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const cors = require('cors');
const path = require('path');
const Note = require('./note');

const app = express();


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Enable JSON for API requests
app.use(cors()); // Enable CORS for frontend requests
app.use(express.static(path.join(__dirname, 'public')));
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

// 🏠 Home Route - Renders EJS
app.get('/', async (req, res) => {
    try {
        const notes = await Note.find();
        res.render('index', { notes, messages: req.flash() });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching notes");
    }
});

// 📌 API Route: Fetch All Notes (For JavaScript)
app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: "Error fetching notes" });
    }
});

// ✏️ API Route: Add a Note
app.post('/api/notes', async (req, res) => {
    try {
        const { text, color } = req.body;
        if (!text.trim()) {
            return res.status(400).json({ error: "Note text cannot be empty." });
        }
        const newNote = await Note.create({ text, color });
        res.status(201).json({ message: "Note added successfully!", note: newNote });
    } catch (err) {
        res.status(500).json({ error: "Failed to add note." });
    }
});

// 🗑 API Route: Delete a Note
app.delete('/api/notes/:id', async (req, res) => {
    try {
        const noteId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return res.status(400).json({ error: "Invalid Note ID format." });
        }

        const deletedNote = await Note.findByIdAndDelete(noteId);
        if (!deletedNote) {
            return res.status(404).json({ error: "Note not found." });
        }

        res.json({ message: "Note deleted successfully!" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ error: "Error deleting note." });
    }
});



// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


