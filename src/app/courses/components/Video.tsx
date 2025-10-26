"use client";
import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { useSearchParams } from "next/navigation";

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Extract YouTube ID from URL in search params
  useEffect(() => {
    const url = searchParams.get("url");
    if (!url) return;

    try {
      const parsedUrl = new URL(url);
      const id =
        parsedUrl.searchParams.get("v") ||
        // Support youtu.be short links like https://youtu.be/abc123
        parsedUrl.pathname.replace("/", "");
      setVideoId(id);
    } catch {
      // If not a full URL, maybe the ID itself was passed
      setVideoId(url);
    }
  }, [searchParams]);

  const handlePlay = () => setIsPlaying(true);

  const getThumbnailUrl = (id: string) =>
    `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No video selected</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
      {isPlaying ? (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube Video Player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <div
          className="relative w-full h-full cursor-pointer group"
          onClick={handlePlay}
        >
          <img
            src={getThumbnailUrl(videoId)}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
            onError={(e) =>
              (e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`)
            }
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 transform group-hover:scale-105 transition-transform">
              <button className="w-20 h-20 mx-auto bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Play
                  className="w-8 h-8 text-primary ml-1"
                  fill="currentColor"
                />
              </button>
              <p className="text-white/90 text-sm font-medium">Click to play</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
