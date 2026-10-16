"use client";

export default function ProtectedVideo({ youtubeUrl }: { youtubeUrl: string }) {
  const videoId = extractYoutubeId(youtubeUrl);
  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&controls=1`
    : null;

  return (
    <div
      className="protected-media relative rounded-xl overflow-hidden bg-black aspect-video"
      onContextMenu={(e) => e.preventDefault()}
    >
      {embedUrl ? (
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="accelerated-video-decode; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white/60 text-sm">
          Link video tidak valid
        </div>
      )}
      <span className="absolute top-2.5 right-2.5 bg-accent-400/90 text-brand-800 text-[10px] font-extrabold px-2 py-1 rounded-full pointer-events-none">
        PROTECTED
      </span>
    </div>
  );
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/
  );
  return match ? match[1] : null;
}
