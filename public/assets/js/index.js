// DOM elements
const noteList = document.querySelector('.list-group');
const noteTitleInput = document.querySelector('.note-title');
const noteTextarea = document.querySelector('.note-textarea');
const saveNoteBtn = document.querySelector('.save-note');
const newNoteBtn = document.querySelector('.new-note');

// Function to fetch the notes from the server
async function getNotes() {
  try {
    const response = await fetch('/api/notes');
    const data = await response.json();
    return data.notes;
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
}

// Function to save a new note to the server
async function saveNote() {
  const title = noteTitleInput.value.trim();
  const text = noteTextarea.value.trim();

  if (title && text) {
    const note = { title, text };

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });
      const data = await response.json();
      if (data.success) {
        // Clear input fields
        noteTitleInput.value = '';
        noteTextarea.value = '';

        // Refresh the list of notes
        getAndRenderNotes();
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  }
}

// Function to delete a note from the server
async function deleteNote(noteId) {
  try {
    const response = await fetch(`/api/notes/${noteId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (data.success) {
      // Refresh the list of notes
      getAndRenderNotes();
    }
  } catch (error) {
    console.error('Error deleting note:', error);
  }
}

// Function to create a note element
function createNoteElement(note) {
  const noteElement = document.createElement('li');
  noteElement.classList.add('list-group-item', 'note-item');
  noteElement.innerHTML = `
    <div class="note-header">
      <h3 class="note-title">${note.title}</h3>
      <button class="btn btn-danger delete-note">Delete</button>
    </div>
    <p class="note-text">${note.text}</p>
  `;
  noteElement.dataset.noteId = note.id;
  return noteElement;
}

// Function to render the notes in the UI
function renderNotes(notes) {
  noteList.innerHTML = '';
  if (notes.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.classList.add('list-group-item', 'empty-message');
    emptyMessage.textContent = 'No notes found';
    noteList.appendChild(emptyMessage);
  } else {
    notes.forEach((note) => {
      const noteElement = createNoteElement(note);
      noteList.appendChild(noteElement);
    });
  }
}

// Function to handle the click event on a note
function handleNoteClick(event) {
  if (event.target.matches('.delete-note')) {
    const noteId = event.target.parentElement.parentElement.dataset.noteId;
    deleteNote(noteId);
  }
}

// Function to handle the click event on the Save Note button
function handleSaveNoteClick() {
  saveNote();
}

// Function to handle the click event on the New Note button
function handleNewNoteClick() {
  noteTitleInput.value = '';
  noteTextarea.value = '';
}

// Function to fetch and render the notes
function getAndRenderNotes() {
    getNotes().then(renderNotes);
    }
    
    // Add event listeners
    noteList.addEventListener('click', handleNoteClick);
    saveNoteBtn.addEventListener('click', handleSaveNoteClick);
    newNoteBtn.addEventListener('click', handleNewNoteClick);
    
    // Initial setup
    getAndRenderNotes();
