import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2, Film, CheckCircle2 } from 'lucide-react';

interface GenerationProgressProps {
  prompt: string;
  duration: string;
  aspectRatio: string;
  cameraMotion?: string;
  onCancel?: () => void;
}

const STAGES = [
  { label: 'Deconstructing scene semantics & prompt tokens', durationWeight: 3 },
  { label: 'Initializing spatio-temporal noise latent space', durationWeight: 5 },
  { label: 'Synthesizing 3D camera trajectory & motion vectors', durationWeight: 8 },
  { label: 'Iterative denoising & temporal frame coherence', durationWeight: 14 },
  { label: 'Upscaling textures & rendering cinematic lighting', durationWeight: 10 },
  { label: 'Encoding H.264/MP4 stream & finalizing clip', durationWeight: 5 },
];

export const GenerationProgress: React.FC<GenerationProgressProps> = ({
  prompt,
  duration,
  aspectRatio,
  cameraMotion,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (seconds > 35) {
      setCurrentStageIndex(5);
    } else if (seconds > 25) {
      setCurrentStageIndex(4);
    } else if (seconds > 16) {
      setCurrentStageIndex(3);
    } else if (seconds > 9) {
      setCurrentStageIndex(2);
    } else if (seconds > 4) {
      setCurrentStageIndex(1);
    } else {
      setCurrentStageIndex(0);
    }
  }, [seconds]);

  return (
    <div className="relative flex h-full min-h-[380px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-center shadow-2xl">
      {/* Ambient background glow and animated radar */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.12),transparent_65%)]" />

      {/* Center glowing orb / film reel */}
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-violet-600/20 opacity-75 duration-1000" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-violet-500/40 duration-7000" />
        <div className="absolute inset-2 animate-spin rounded-full border-2 border-dotted border-cyan-400/40 duration-5000 direction-reverse" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-lg shadow-violet-500/30">
          <Film className="h-7 w-7 text-white" />
        </div>
      </div>

      {/* Main Status */}
      <div className="relative z-10 max-w-md">
        <div className="mb-2 flex items-center justify-center gap-2">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-cyan-400"></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Gemini Omni Flash 1.1 Neural Video Pipeline
          </span>
        </div>

        <h3 className="text-lg font-bold text-white">
          Rendering {duration} Cinema Clip
        </h3>

        <p className="mt-1 line-clamp-2 text-xs italic text-zinc-400">
          "{prompt}"
        </p>

        {/* Progress Stages list */}
        <div className="mt-6 space-y-2 text-left">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div
                key={idx}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs transition-all ${
                  isCurrent
                    ? 'border border-violet-500/30 bg-violet-500/10 font-medium text-violet-200'
                    : isCompleted
                    ? 'text-zinc-500'
                    : 'text-zinc-600 opacity-60'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-cyan-400" />
                ) : (
                  <div className="h-3.5 w-3.5 shrink-0 rounded-full border border-zinc-700" />
                )}
                <span className="truncate">{stage.label}</span>
              </div>
            );
          })}
        </div>

        {/* Elapsed Timer & Specs */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-cyan-300">{seconds}s</span>
            <span>elapsed</span>
          </div>
          <span>•</span>
          <span>{aspectRatio}</span>
          {cameraMotion && (
            <>
              <span>•</span>
              <span className="text-zinc-300">{cameraMotion}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
