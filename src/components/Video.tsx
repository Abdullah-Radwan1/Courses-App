"use client";
import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster="/path-to-poster-image.jpg" // Optional thumbnail
        onClick={togglePlay}
      >
        <source src="/your-video.mp4" type="video/mp4" />
        <source src="/your-video.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <button
              onClick={togglePlay}
              className="w-20 h-20 mx-auto bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
            >
              <Play className="w-8 h-8 text-primary ml-1" fill="currentColor" />
            </button>
            <p className="text-white/80 text-sm">Click to play</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
