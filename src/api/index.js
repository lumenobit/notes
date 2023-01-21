const express = require('express');
const notesController = require('./controller/notes.controller')

const router = express.Router();

router.get('/note', notesController.getAllNotes)
router.post('/note', notesController.saveNote)
router.put('/note/:id', notesController.editNote)
router.delete('/note/:id', notesController.deleteNote)

module.exports = router;