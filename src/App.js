import React, { useState, useRef, useEffect, useCallback } from "react";
import VideoPlayer from "./components/VideoPlayer";
import Notes from "./components/Notes";

import "./App.css";

const App = () => {
  const [currentVideoId, setCurrentVideoId] = useState("O6P86uwfdR0");
  const [currentTime, setCurrentTime] = useState(0);
  const [notes, setNotes] = useState([]);
  const [videoInfo, setVideoInfo] = useState({ title: "", description: "" });
  const playerRef = useRef(null);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem(currentVideoId)) || [];
    setNotes(savedNotes);

    try {
      const fetchdata = async () => {
        const data = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${currentVideoId}&key=AIzaSyBnvFfZaXf6z6TFFRU5e9lGXcd-nJ4xSCM`
        );

        const response = await data.json();

        setVideoInfo({
          title: response?.items[0]?.snippet?.title
            ? response?.items[0]?.snippet?.title
            : "Title",
          description: response?.items[0]?.snippet?.description
            ? response?.items[0]?.snippet?.description
            : "Description",
        });
      };
      fetchdata();
    } catch (error) {
      console.error("Error in fetching video details:", error);
    }
  }, [currentVideoId]);

  const handleTimeUpdate = useCallback(
    (time) => {
      setCurrentTime(time);
    },
    [setCurrentTime]
  );

  const handleAddNote = useCallback(
    (newNotes) => {
      localStorage.setItem(currentVideoId, JSON.stringify(newNotes));
      setNotes(newNotes);
    },
    [setNotes, currentVideoId]
  );

  const handleUpdateNote = useCallback(
    (updatedNotes) => {
      localStorage.setItem(currentVideoId, JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    },
    [setNotes, currentVideoId]
  );

  const handleDeleteNote = useCallback(
    (index) => {
      const updatedNotes = notes.filter(
        (note, noteIndex) => noteIndex !== index
      );
      localStorage.setItem(currentVideoId, JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    },
    [notes, currentVideoId, setNotes]
  );

  return (
    <div className="App">
      <h1>Youtube Video Note Taker</h1>
      <input
        type="text"
        value={currentVideoId}
        onChange={(e) => {
          setCurrentVideoId(e.target.value);
        }}
        placeholder="Enter the youtube video ID..."
      />

      <VideoPlayer
        videoId={currentVideoId}
        onTimeUpdate={handleTimeUpdate}
        playerRef={playerRef}
      />

      <div className="video-info">
        <h2>{videoInfo.title}</h2>
        <div>
          {videoInfo.description.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>
      <hr />
      <Notes
        videoId={currentVideoId}
        currentTime={currentTime}
        notes={notes}
        addNote={handleAddNote}
        updateNote={handleUpdateNote}
        deleteNote={handleDeleteNote}
        playerRef={playerRef}
      />
    </div>
  );
};

export default App;
