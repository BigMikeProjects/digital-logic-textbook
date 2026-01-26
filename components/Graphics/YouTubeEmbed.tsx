'use client';

interface YouTubeEmbedProps {
  videoId: string;
  startTime?: number;
}

export default function YouTubeEmbed({ videoId, startTime }: YouTubeEmbedProps) {
  if (!videoId) {
    return (
      <div className="text-gray-400 text-center">
        Invalid YouTube video ID
      </div>
    );
  }

  const embedUrl = startTime
    ? `https://www.youtube.com/embed/${videoId}?start=${startTime}`
    : `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="video-container rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="border-0"
        />
      </div>
    </div>
  );
}
