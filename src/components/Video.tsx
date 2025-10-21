"use client";
import { useState } from "react";
import { Play } from "lucide-react";

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => setIsPlaying(true);

  return (
    <>
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        {/* YouTube iframe appears only after clicking play */}
        {isPlaying ? (
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
            title="Demo Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          // Thumbnail / placeholder before playing
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/60 cursor-pointer"
            onClick={handlePlay}
          >
            <div className="text-center space-y-4">
              <button className="w-20 h-20 mx-auto bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Play
                  className="w-8 h-8 text-primary ml-1"
                  fill="currentColor"
                />
              </button>
              <p className="text-white/80 text-sm">Click to play</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VideoPlayer;
