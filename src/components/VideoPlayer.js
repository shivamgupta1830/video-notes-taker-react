import React, { useEffect } from "react";
import YouTube from "react-youtube";

const VideoPlayer = React.memo(({ videoId, onTimeUpdate, playerRef }) => {
  const onReady = (event) => {
    const ytPlayer = event.target;
    if (playerRef) {
      playerRef.current = ytPlayer;
    }
  };

  const onStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      const interval = setInterval(() => {
        if (playerRef.current && event.data === window.YT.PlayerState.PLAYING) {
          onTimeUpdate(playerRef.current.getCurrentTime());
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  };

  useEffect(() => {
    if (!!playerRef.current) {
      playerRef.current.loadVideoById(videoId);
    }
  }, [videoId, playerRef]);

  const opts = {
    height: "390",
    width: "720",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <YouTube
      videoId={videoId}
      opts={opts}
      onReady={onReady}
      onStateChange={onStateChange}
    />
  );
});

export default VideoPlayer;
