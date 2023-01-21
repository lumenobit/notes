const AppDbUtil = require('../util/db.util');
const AppFileUtil = require('../util/file.util');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const getAllNotes = async (req, res) => {

    // res.json(AppFileUtil.readData('note'));
    try {
        const notes = await AppDbUtil.getAllNotes();
        res.json(notes);
    } catch (ex) {
        res.status(500).json({ 'error': { 'message': 'An Error has occurred.' } })
    }

}

const saveNote = async (req, res) => {

    try {
        const noteBody = req.body;
        if (noteBody.noteText) {
            // noteBody.id = getRandomInt(10000, 99999);
            // let notes = AppFileUtil.readData('note');
            // notes.push(noteBody);
            // AppFileUtil.writeData('note', notes);
            await AppDbUtil.saveNote(noteBody);
            res.json({ success: true });
        } else {
            res.status(500).json({ 'error': { 'message': 'An Error has occurred.' } })
        }
    } catch (ex) {
        res.status(500).json({ 'error': { 'message': 'An Error has occurred.' } })
    }

}

const editNote = async (req, res) => {

    try {
        const noteId = req.params.id;
        const noteBody = req.body;
        if (noteId && noteBody.noteText) {
            // noteBody.id = noteId;
            // const notes = AppFileUtil.readData('note');
            // const noteToEdit = notes.find((n) => n.id == noteId);
            // noteToEdit.noteText = noteBody.noteText;
            // AppFileUtil.writeData('note', notes);
            await AppDbUtil.updateNote(noteId, { noteText: noteBody.noteText });
            res.json({ success: true });
        } else {
            res.status(500).json({ 'error': { 'message': 'An Error has occurred.' } })
        }
    } catch (ex) {
        console.log(ex);
        res.status(500).json({ 'error': { 'message': 'An Error has occurred.' } })
    }

}

const deleteNote = async (req, res) => {

    try {
        const noteId = req.params.id;
        if (noteId) {
            // const notes = AppFileUtil.readData('note');
            // const noteToDeleteIndex = notes.findIndex((n) => n.id == noteId)
            // notes.splice(noteToDeleteIndex, 1);
            // AppFileUtil.writeData('note', notes);
            await AppDbUtil.deleteNote(noteId)
            res.json({ success: true });
        } else {
            res.status(500).json({ 'error': { 'message': 'An Error has occurred.' } })
        }
    } catch (ex) {
        res.status(500).json({ 'error': { 'message': 'An Error has occurred.' } })
    }

}

module.exports = {
    getAllNotes,
    saveNote,
    editNote,
    deleteNote
}