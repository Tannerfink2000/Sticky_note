const express = require('express');
const notesRouter = require('./notes');

const router = express.Router();

// Set up the API routes
router.use('/notes', notesRouter);

module.exports = router;
