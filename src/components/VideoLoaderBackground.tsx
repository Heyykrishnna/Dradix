"use client";

import React, { useState, useRef, useEffect } from "react";

interface VideoLoaderBackgroundProps {
  children: React.ReactNode;
  videoSrc?: string;
  className?: string;
}

export function VideoLoaderBackground({
  children,
  videoSrc = "/assets/images/LOADER-VIDEO.mp4",
  className = "",
}: VideoLoaderBackgroundProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay restricted or failed
        setVideoFailed(true);
      });
    }
  }, []);

  return (
    <div
      className={`relative overflow-hidden bg-white w-full flex flex-col items-center justify-center ${className}`}
    >
      {!videoFailed && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setVideoLoaded(true)}
          onError={() => setVideoFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover blur-md scale-110 pointer-events-none transition-opacity duration-700 ${
            videoLoaded ? "opacity-85" : "opacity-0"
          }`}
        />
      )}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-xs pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default VideoLoaderBackground;
