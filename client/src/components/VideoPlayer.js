import React, { memo } from 'react';
import YouTube from 'react-youtube';

// Use memo to prevent unnecessary re-renders
const VideoPlayer = memo(({ videoId, title, description }) => {
  // Options for the YouTube player
  const opts = {
    height: '500',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  // Extract YouTube ID if the full URL was passed
  const extractYouTubeID = (id) => {
    if (!id) return '';
    
    // If it's already just an ID (no slashes or dots)
    if (!/[/.]/.test(id)) return id;
    
    // Handle youtu.be format
    if (id.includes('youtu.be/')) {
      return id.split('youtu.be/')[1].split('?')[0];
    }
    
    // Handle youtube.com format
    if (id.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(id.split('?')[1]);
      return urlParams.get('v');
    }
    
    // Handle other formats or return the original if it seems like an ID
    return id;
  };
  const youtubeVideoId = extractYouTubeID(videoId);

  if (!youtubeVideoId) {
    return (
      <div className="alert alert-warning">
        No valid YouTube video ID provided
      </div>
    );
  }
  return (
    <div className="video-player">
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title mb-3">{title}</h2>
          <YouTube videoId={youtubeVideoId} opts={opts} className="mb-3" />
          <div className="card-text">
            <h5>Description:</h5>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default VideoPlayer;