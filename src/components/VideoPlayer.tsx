import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  Copy,
  Check,
  FastForward,
  Rewind,
  Sparkles,
  Layers,
  Share2,
} from 'lucide-react';
import { VideoClip } from '../types/video';

interface VideoPlayerProps {
  clip: VideoClip;
  onExtend: (clip: VideoClip) => void;
  onEdit: (clip: VideoClip) => void;
  onRemixInPrompt: (clip: VideoClip) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  clip,
  onExtend,
  onEdit,
  onRemixInPrompt,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  useEffect(() => {
    // Reset state on clip change
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      videoRef.current.playbackRate = playbackRate;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [clip.videoUrl]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 5);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleStep = (delta: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(duration, videoRef.current.currentTime + delta)
      );
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = clip.videoUrl;
    a.download = `cinecraft-${clip.id}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(clip.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Format mm:ss or s.ms
  const formatTime = (time: number) => {
    const secs = Math.floor(time);
    const ms = Math.floor((time - secs) * 10);
    return `${secs}.${ms}s`;
  };

  // Calculate container aspect ratio classes
  const aspectClass =
    clip.aspectRatio === '9:16'
      ? 'aspect-[9/16] max-h-[520px]'
      : clip.aspectRatio === '1:1'
      ? 'aspect-square max-h-[460px]'
      : 'aspect-[16/9] w-full';

  return (
    <div className="flex flex-col gap-3">
      {/* Video Viewport Frame */}
      <div className="relative mx-auto flex w-full items-center justify-center overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className={`relative flex items-center justify-center ${aspectClass}`}>
          <video
            ref={videoRef}
            src={clip.videoUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => {
              if (!isLooping) setIsPlaying(false);
            }}
            loop={isLooping}
            playsInline
            muted={isMuted}
            onClick={togglePlay}
            className="h-full w-full object-contain cursor-pointer"
          />

          {/* Large Center Play Overlay if paused */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition hover:bg-black/30"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-600/90 text-white shadow-xl shadow-violet-600/40 transition hover:scale-110">
                <Play className="ml-1 h-7 w-7" />
              </div>
            </button>
          )}

          {/* Watermark / Ratio Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-[10px] font-semibold tracking-wider text-zinc-300 backdrop-blur-md">
            <span>{clip.aspectRatio}</span>
            <span>•</span>
            <span>{clip.resolution}</span>
          </div>

          {/* Starter Frame badge if from image */}
          {clip.starterImage && (
            <div className="absolute top-3 left-3 flex items-center gap-1 rounded-md bg-cyan-950/80 px-2 py-1 text-[10px] font-medium text-cyan-300 backdrop-blur-md">
              <Sparkles className="h-2.5 w-2.5" />
              <span>Animated from image</span>
            </div>
          )}
        </div>
      </div>

      {/* Sleek Scrubber Bar & Controls */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
        {/* Scrubber slider */}
        <div className="mb-2 flex items-center gap-3">
          <span className="w-10 text-right font-mono text-[11px] text-zinc-400">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 5}
            step={0.05}
            value={currentTime}
            onChange={handleSeek}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-violet-500 hover:accent-violet-400"
          />
          <span className="w-10 font-mono text-[11px] text-zinc-500">
            {formatTime(duration || 5)}
          </span>
        </div>

        {/* Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleStep(-0.2)}
              className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              title="Step back 0.2s"
            >
              <Rewind className="h-4 w-4" />
            </button>

            <button
              onClick={togglePlay}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white shadow-sm transition hover:bg-violet-500"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
            </button>

            <button
              onClick={() => handleStep(0.2)}
              className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              title="Step forward 0.2s"
            >
              <FastForward className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`rounded-lg p-1.5 transition ${
                isLooping
                  ? 'bg-violet-500/20 text-violet-300'
                  : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
              }`}
              title={isLooping ? 'Looping enabled' : 'Looping disabled'}
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={toggleMute}
              className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            {/* Speed pills */}
            <div className="ml-2 hidden items-center gap-1 sm:flex">
              {[0.5, 1, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleRateChange(rate)}
                  className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-medium transition ${
                    playbackRate === rate
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyPrompt}
              className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-800/80 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
              title="Copy prompt text"
            >
              {copiedPrompt ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Prompt</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-100 shadow-sm transition hover:border-zinc-600 hover:bg-zinc-700 hover:text-white"
            >
              <Download className="h-3.5 w-3.5 text-indigo-400" />
              <span>Download .MP4</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              title="Fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Multi-turn AI Production Actions */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onExtend(clip)}
          className="flex items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-600/10 p-2.5 text-xs font-semibold text-violet-300 transition hover:bg-violet-600/20"
        >
          <Layers className="h-3.5 w-3.5 text-violet-400" />
          <span>Extend Scene (+5s)</span>
        </button>

        <button
          onClick={() => onEdit(clip)}
          className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-600/10 p-2.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-600/20"
        >
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Prompt Edit / Remix</span>
        </button>

        <button
          onClick={() => onRemixInPrompt(clip)}
          className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-2.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
        >
          <Share2 className="h-3.5 w-3.5 text-zinc-400" />
          <span>Load Into Studio</span>
        </button>
      </div>

      {/* Prompt Inspector Box */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Active Generation Prompt
          </span>
          <span className="font-mono text-[10px] text-zinc-600">ID: {clip.id.slice(0, 10)}</span>
        </div>
        <p className="text-xs leading-relaxed text-zinc-300">{clip.prompt}</p>

        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          {clip.cameraMotion && (
            <span className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-zinc-400">
              Camera: <strong className="text-zinc-200">{clip.cameraMotion}</strong>
            </span>
          )}
          {clip.lightingStyle && (
            <span className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-zinc-400">
              Lighting: <strong className="text-zinc-200">{clip.lightingStyle}</strong>
            </span>
          )}
          {clip.styleEngine && (
            <span className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-zinc-400">
              Style: <strong className="text-zinc-200">{clip.styleEngine}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
