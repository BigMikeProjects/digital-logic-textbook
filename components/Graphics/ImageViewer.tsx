'use client';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface ImageViewerProps {
  src: string;
  alt: string;
}

export default function ImageViewer({ src, alt }: ImageViewerProps) {
  const fullSrc = src.startsWith('/') ? `${basePath}${src}` : src;

  return (
    <div className="flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={fullSrc}
        alt={alt}
        className="max-w-full max-h-[60vh] object-contain rounded-lg"
      />
    </div>
  );
}
