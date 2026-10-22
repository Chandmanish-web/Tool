import React, { useState } from 'react';
import { X, Layers, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { VideoClip } from '../types/video';

interface VideoEditorModalProps {
  clip: VideoClip;
  mode: 'extend' | 'edit';
  onClose: () => void;
  onSubmit: (prompt: string, mode: 'extend' | 'edit') => Promise<void>;
  isProcessing: boolean;
}

export const VideoEditorModal: React.FC<VideoEditorModalProps> = ({
  clip,
  mode,
  onClose,
  onSubmit,
  isProcessing,
}) => {
  const [instruction, setInstruction] = useState(
    mode === 'extend'
      ? 'Continue the scene: the camera slowly pushes through the environment as dynamic ambient elements evolve.'
      : 'Keep the subject and setting, but transition the lighting to a rainy cyberpunk night with reflections.'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || isProcessing) return;
    await onSubmit(instruction.trim(), mode);
  };

  const isExtend = mode === 'extend';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                isExtend
                  ? 'border border-violet-500/30 bg-violet-600/20 text-violet-300'
                  : 'border border-cyan-500/30 bg-cyan-600/20 text-cyan-300'
              }`}
            >
              {isExtend ? <Layers className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isExtend ? 'Extend Video Scene (+5s)' : 'AI Prompt Edit / Remix'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {isExtend
                  ? 'Seamlessly continue the timeline using Gemini Omni Flash continuity'
                  : 'Iteratively adjust styling, objects, or atmosphere in the clip'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Source Clip Preview banner */}
        <div className="mb-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Source Clip
          </span>
          <p className="mt-1 line-clamp-2 text-xs text-zinc-300">"{clip.prompt}"</p>
          <div className="mt-2 flex items-center gap-2 text-[10px] text-zinc-500">
            <span>{clip.aspectRatio}</span>
            <span>•</span>
            <span>{clip.duration}</span>
            <span>•</span>
            <span>ID: {clip.id.slice(0, 8)}</span>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-300">
              {isExtend ? 'Scene Continuation Instructions' : 'Edit / Modification Instructions'}
            </label>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              rows={4}
              placeholder={
                isExtend
                  ? 'Describe what happens next in the scene...'
                  : 'Specify what to change (e.g. change season to winter, add glowing butterflies)...'
              }
              className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-xs leading-relaxed text-zinc-100 placeholder-zinc-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30"
            />
          </div>

          {/* Quick presets for extend/edit */}
          <div>
            <span className="mb-1 block text-[10px] text-zinc-500">Quick ideas:</span>
            <div className="flex flex-wrap gap-1.5">
              {(isExtend
                ? [
                    'Camera pulls back to reveal epic landscape',
                    'The character smiles and steps into the portal',
                    'Time lapses as night falls and stars emerge',
                  ]
                : [
                    'Change atmosphere to dramatic golden hour',
                    'Add gentle falling snow and frosty mist',
                    'Transform aesthetic into stop-motion claymation',
                  ]
              ).map((idea, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInstruction(idea)}
                  className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-[10px] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing || !instruction.trim()}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-violet-600/30 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Processing Neural Pipeline...</span>
                </>
              ) : (
                <>
                  <span>{isExtend ? 'Render Extension' : 'Render Edit'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
