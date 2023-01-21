const NOTES_KEY = 'notes';
let isEditMode = false;
let editNoteId = null;

function addLocalNote(noteText) {
    const notes = getLocalNotes();
    notes.push(noteText);
    setLocalNotes(notes);
}

function removeLocalNote(index) {
    const notes = getLocalNotes();
    notes.splice(index, 1);
    setLocalNotes(notes);
}

function setLocalNotes(notes) {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function getLocalNotes() {
    const noteString = localStorage.getItem(NOTES_KEY);
    if (noteString) {
        return JSON.parse(noteString);
    } else {
        return [];
    }
}

function showLoader() {
    const loaderDOM = document.getElementById('loader');
    loaderDOM.classList.remove('hide');
}

function hideLoader() {
    const loaderDOM = document.getElementById('loader');
    loaderDOM.classList.add('hide');
}

async function getServerNotes() {
    const noteResponse = await fetch('/api/note');
    const notes = await noteResponse.json();
    return notes;
}

async function editServerNote(noteId, noteText) {
    try {
        const noteResponse = await fetch(`/api/note/${noteId}`, {
            method: 'PUT', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({ noteText: noteText })
        });
        const isSuccess = await noteResponse.json();
        return isSuccess.success;
    } catch (ex) {
        console.log(ex);
    }
}

async function addServerNote(noteText) {
    try {
        const noteResponse = await fetch('/api/note', {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({ noteText: noteText })
        });
        const isSuccess = await noteResponse.json();
        return isSuccess.success;
    } catch (ex) {
        console.log(ex);
    }
}

async function deleteServerNote(noteId) {
    try {
        const noteResponse = await fetch(`/api/note/${noteId}`, { method: 'DELETE' });
        const isSuccess = await noteResponse.json();
        return isSuccess.success;
    } catch (ex) {
        console.log(ex);
    }
}

async function refreshNotes() {
    const noteListDOM = document.getElementById('noteList');
    try {
        const notes = await getServerNotes();
        noteListDOM.innerHTML = '';
        if (notes?.length > 0) {
            notes.forEach(note => {
                if (note) {
                    const noteDOM = document.createElement('a');
                    noteDOM.classList.add('note');
                    noteDOM.innerHTML = note.noteText;
                    noteDOM.onclick = () => { openNoteEditor(note) };
                    noteListDOM.appendChild(noteDOM);
                }
            });
        } else {
            noteListDOM.innerHTML = '<div class="no-records"><div class="icon"><i class="bi bi-sticky"></i></div><div>No notes saved yet...</div></div>';
        }
    } catch (ex) {
        noteListDOM.innerHTML = `<div class="no-records"><div class="icon"><i class="bi bi-sticky"></i></div><div>An Error has occurred. Please try again later...</div></div>`;
    }
}

function openNoteEditor(note) {
    const noteEditorModalDOM = document.getElementById('noteEditorModal');
    noteEditorModalDOM.classList.remove('hide');
    const saveBtnDOM = document.getElementById('saveBtn');
    const deleteNoteBtnDOM = document.getElementById('deleteNoteBtn');
    const noteHeaderDOM = document.getElementById('noteHeader');
    if (!note) {
        // CREATE MODE
        noteHeaderDOM.innerHTML = 'Create a Note';
        isEditMode = false;
        editNoteId = null;
        deleteNoteBtnDOM.classList.add('hide');
        saveBtnDOM.disabled = true;
    } else {
        // EDIT MODE
        noteHeaderDOM.innerHTML = 'Edit Note';
        isEditMode = true;
        editNoteId = note._id;
        saveBtnDOM.disabled = false;
        deleteNoteBtnDOM.classList.remove('hide');
        const noteEditorDOM = document.getElementById('noteEditor');
        noteEditorDOM.value = note.noteText;
    }
}

function closeNoteEditor() {
    const noteEditorDOM = document.getElementById('noteEditor');
    noteEditorDOM.value = '';
    const noteEditorModalDOM = document.getElementById('noteEditorModal');
    noteEditorModalDOM.classList.add('hide');
}

async function saveNote() {
    const noteEditorDOM = document.getElementById('noteEditor');
    const noteValue = noteEditorDOM.value;
    if (noteValue) {
        showLoader();
        if (editNoteId) {
            await editServerNote(editNoteId, noteValue);
        } else {
            await addServerNote(noteValue);
        }
        await refreshNotes();
    }
    closeNoteEditor();
    hideLoader();
}

async function deleteNote() {
    showLoader();
    await deleteServerNote(editNoteId);
    await refreshNotes();
    closeNoteEditor();
    hideLoader();
}

function onInputChange() {
    const noteEditorDOM = document.getElementById('noteEditor');
    const saveBtnDOM = document.getElementById('saveBtn');
    const noteValue = noteEditorDOM.value;
    if (noteValue) {
        saveBtnDOM.disabled = false;
    } else {
        saveBtnDOM.disabled = true;
    }
}

(async () => {
    showLoader();
    await refreshNotes();
    hideLoader();
})();