document.addEventListener("DOMContentLoaded", function () {
    const notesContainer = document.querySelector('.notes-container');
    const forms = document.querySelectorAll('form');
    const noteIds = new Set(); // Store unique note IDs to prevent duplicates

    // Fetch and display existing notes from MongoDB
    async function loadNotes() {
        try {
            const response = await fetch('/api/notes');
            const notes = await response.json();
    
            console.log("Loaded notes:", notes); // Check if duplicates appear in console
    
            notesContainer.innerHTML = ""; // ✅ Clear previous notes before loading
    
            notes.forEach(note => {
                if (!noteIds.has(note._id)) {
                    createNoteElement(note.text, note.color, note._id);
                    noteIds.add(note._id);
                }
            });
        } catch (error) {
            console.error("Error loading notes:", error);
        }
    }

    // Create and append a note element
    function createNoteElement(text, color, id = null) {
        if (id && noteIds.has(id)) return; // Prevent duplicate notes

        const note = document.createElement('div');
        note.classList.add('note');
        note.style.backgroundColor = color;
        note.innerHTML = `
            <p>${text}</p>
            <button class="delete-note" data-id="${id}">X</button>
        `;

        // Handle note deletion
        const deleteButton = note.querySelector('.delete-note');
        if (deleteButton) {
            deleteButton.addEventListener('click', function () {
                const noteId = this.getAttribute("data-id");
                if (noteId) {
                    deleteNoteFromDB(noteId, note);
                } else {
                    note.remove();
                }
            });
        }

        notesContainer.appendChild(note);
        if (id) noteIds.add(id); // Add the note ID to prevent duplicates
    }

    // Send new note to MongoDB
    async function saveNoteToDB(text, color) {
        try {
            const response = await fetch('/api/notes', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, color }),
            });

            const data = await response.json();
            if (response.ok) {
                if (!noteIds.has(data.note._id)) { // Check before adding
                    createNoteElement(text, color, data.note._id);
                    noteIds.add(data.note._id);
                }
            } else {
                alert("Error saving note!");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // Delete a note from MongoDB
    async function deleteNoteFromDB(noteId, noteElement) {
        try {
            const response = await fetch(`/api/notes/${noteId}`, { method: "DELETE" });
    
            const data = await response.json();
            console.log("Server Response:", data);
    
            if (response.ok) {
                noteElement.remove();
                noteIds.delete(noteId); // ✅ Ensure we remove it from Set
            } else {
                alert(`Failed to delete note: ${data.error}`);
            }
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    }
    
    

    // Attach event listeners to forms
    forms.forEach(form => {
        const createButton = form.querySelector('.create-note');
        const textArea = form.querySelector('textarea[name="text"]');
        const colorOptions = form.querySelectorAll('input[name="color"]');

        if (colorOptions.length === 0) {
            console.warn("No color options found in form!");
            return;
        }

        function updateButtonColor() {
            const selectedColorOption = form.querySelector('input[name="color"]:checked');

            if (!selectedColorOption) {
                console.warn("No color option selected! Defaulting to first color.");
                if (colorOptions.length > 0) {
                    colorOptions[0].checked = true;
                }
            }

            createButton.style.backgroundColor = selectedColorOption ? selectedColorOption.value : colorOptions[0].value;
        }

        colorOptions.forEach(option => {
            option.addEventListener('change', updateButtonColor);
        });

        updateButtonColor();

        // Handle new note creation
        createButton.addEventListener('click', function (event) {
            event.preventDefault();

            const selectedColorOption = form.querySelector('input[name="color"]:checked');
            if (!selectedColorOption) {
                alert("Please select a color!");
                return;
            }

            const noteText = textArea.value.trim();
            const selectedColor = selectedColorOption.value;

            if (noteText === "") {
                alert("Note text cannot be empty!");
                return;
            }

            // Send note to MongoDB
            saveNoteToDB(noteText, selectedColor);

            textArea.value = ""; // Clear input
        });
    });

    // Load notes on page load
    loadNotes();
});
