const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readFromFile, readAndAppend, readAndDelete } = require('../helpers/fsUtils');
const router = express.Router();

const path = require('path');
const notesFile = path.join(__dirname, '../db/db.json');

// Route to get all notes (GET)
router.get('/', async (req, res) => {
    try {
        const notes = await readFromFile(notesFile);
        return res.json(JSON.parse(notes));
    } catch (err) {
        return res.json({ error: 'Error while reading notes' });
    }
});

// Route to create a new note (POST)
router.post('/post', async (req, res) => {
    try {
        const { title, text } = req.body;
        if (req.body) {
            const newNote = {
                title,
                text,
                id: uuidv4(),
            };

            readAndAppend(newNote, notesFile);
            return res.json(newNote);
        } else {
            res.error('Error in adding note');
        }
    } catch (err) {
        throw res.status(500).json(err);
    }
});

// Route to delete a note (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        readAndDelete(req.params.id, notesFile);
        return res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        throw res.status(500).json(err);
    }
});

module.exports = router;