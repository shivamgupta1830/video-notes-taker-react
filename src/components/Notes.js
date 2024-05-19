import React, { useState, useEffect, useRef } from "react";

const Notes = ({
  videoId,
  currentTime,
  notes,
  addNote,
  updateNote,
  deleteNote,
  playerRef,
}) => {
  const [noteText, setNoteText] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem(videoId)) || [];
    addNote(savedNotes);
  }, [videoId, addNote]);

  const handleAddNote = () => {
    if (editingNote !== null) {
      const updatedNotes = notes.map((note, index) =>
        index === editingNote
          ? { ...note, text: noteText, date: new Date().toLocaleString() }
          : note
      );
      updateNote(updatedNotes);
      setEditingNote(null);
    } else {
      const newNote = {
        time: currentTime,
        text: noteText,
        date: new Date().toLocaleDateString(),
      };
      const updatedNotes = [...notes, newNote];
      addNote(updatedNotes);
      localStorage.setItem(videoId, JSON.stringify(updatedNotes));
    }
    setNoteText("");
  };

  const handleEditNote = (index) => {
    setNoteText(notes[index].text);
    setEditingNote(index);
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = notes.filter((note, noteIndex) => noteIndex !== index);
    addNote(updatedNotes);
    localStorage.setItem(videoId, JSON.stringify(updatedNotes));
  };

  const handleSeekTo = (time) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time, true);
    } else {
      console.warn("Player reference is not set yet");
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes} min ${seconds < 10 ? "0" : ""}${seconds} sec`;
  };

  return (
    <div className="notes">
      <h2>Notes</h2>
      <hr />
      <div className="notes-input">
        <button onClick={handleAddNote}>
          {editingNote !== null ? "Update Note" : "➕ Add New Note"}
        </button>
        <input
          type="text"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Enter your note here"
        />
      </div>
      <ul>
        {notes.map((note, index) => (
          <li key={index}>
            <div className="notes-content">
              <div>{note.date}</div>
              <div>
                Timestamp:{" "}
                <span className="timestamp">
                  <a href="#!" onClick={() => handleSeekTo(note.time)}>
                    {formatTime(note.time)}
                  </a>
                </span>
              </div>

              <div>{note.text}</div>
            </div>
            <div>
              <button onClick={() => handleEditNote(index)}>Edit</button>
              <button onClick={() => handleDeleteNote(index)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;
