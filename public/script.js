document.addEventListener("DOMContentLoaded", function () {
    const colorOptions = document.querySelectorAll('input[name="color"]');
    const createButton = document.querySelector('.create-note');  // Use querySelector to get the correct button
    const notesContainer = document.querySelector('.notes-container'); // Get the notes container

    // Function to clear all notes from localStorage (delete old notes)
    function clearAllNotesFromLocalStorage() {
        localStorage.removeItem('notes');  // Clear notes from localStorage
    }

    // Load notes from localStorage when the page is loaded
    function loadNotes() {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.forEach(note => {
            createNoteElement(note.text, note.color);
        });
    }

    // Save notes to localStorage
    function saveNotes() {
        const notes = [];
        document.querySelectorAll('.note').forEach(noteElement => {
            const noteText = noteElement.querySelector('p').textContent;
            const noteColor = noteElement.style.backgroundColor;
            notes.push({ text: noteText, color: noteColor });
        });
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    // Create a new note element and append it to the notes container
    function createNoteElement(text, color) {
        const note = document.createElement('div');
        note.classList.add('note');
        note.style.backgroundColor = color;
        note.innerHTML = `
            <p>${text}</p>
            <button class="delete-note">X</button>
        `;
        
        // Add event listener for deleting the note
        note.querySelector('.delete-note').addEventListener('click', function () {
            note.remove();  // Remove the note
            saveNotes();    // Update localStorage
        });

        notesContainer.appendChild(note);
    }

    // Update the color of the create button
    function updateButtonColor() {
        const selectedColor = document.querySelector('input[name="color"]:checked').value;
        createButton.style.backgroundColor = selectedColor;
    }

    colorOptions.forEach(option => {
        option.addEventListener('change', updateButtonColor);
    });

    updateButtonColor();

    // Create new note functionality
    createButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission

        const selectedColor = document.querySelector('input[name="color"]:checked').value;
        const noteText = document.querySelector('textarea[name="text"]').value;

        // Create new note and append it
        createNoteElement(noteText, selectedColor);

        // Save the new note to localStorage
        saveNotes();

        // Clear the textarea
        document.querySelector('textarea[name="text"]').value = '';
    });

    // Event delegation: Attach the delete functionality to the notes container
    notesContainer.addEventListener('click', function (event) {
        // Check if the clicked element is a delete button
        if (event.target && event.target.classList.contains('delete-note')) {
            const note = event.target.closest('.note');  // Find the closest note element
            note.remove();  // Remove the note
            saveNotes();    // Update localStorage after deletion
        }
    });

    // Hide messages after 3 seconds
    setTimeout(() => {
        document.querySelectorAll('.message').forEach(msg => msg.style.display = "none");
    }, 3000);

    // Clear all notes from localStorage on page load (if needed)
    clearAllNotesFromLocalStorage();

    // Load the notes when the page is loaded (after clearing)
    loadNotes();
});
