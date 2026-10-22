import React, { useState } from 'react';
import { Play, Download, Trash2, ArrowUpRight, Search, Film, Calendar } from 'lucide-react';
import { VideoClip } from '../types/video';

interface HistoryDrawerProps {
  clips: VideoClip[];
  onSelectClip: (clip: VideoClip) => void;
  onDeleteClip: (id: string) => void;
  onClearAll: () => void;
  onLoadIntoStudio: (clip: VideoClip) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  clips,
  onSelectClip,
  onDeleteClip,
  onClearAll,
  onLoadIntoStudio,
}) => {
  const [search, setSearch] = useState('');

  const filteredClips = clips.filter((clip) =>
    clip.prompt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-violet-400" />
            <h2 className="text-xl font-bold text-white">Production Archive</h2>
          </div>
          <p className="text-xs text-zinc-400">
            {clips.length} saved video generation{clips.length === 1 ? '' : 's'} stored in your local library
          </p>
        </div>

        {clips.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search prompts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 rounded-xl border border-zinc-800 bg-zinc-900/60 py-1.5 pl-9 pr-3 text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-violet-500 sm:w-64"
              />
            </div>
            <button
              onClick={onClearAll}
              className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
              Clear Archive
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {clips.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-8 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-600">
            <Film className="h-7 w-7" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-300">No Generated Clips Yet</h3>
          <p className="mt-1 max-w-sm text-xs text-zinc-500">
            Every time you generate a video in Studio, it will automatically be archived here for instant playback and download.
          </p>
        </div>
      ) : filteredClips.length === 0 ? (
        <div className="py-12 text-center text-xs text-zinc-500">
          No clips matching "{search}"
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClips.map((clip) => (
            <div
              key={clip.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 transition hover:border-zinc-700 hover:shadow-lg"
            >
              {/* Media Preview Box */}
              <div
                onClick={() => onSelectClip(clip)}
                className="relative aspect-video w-full cursor-pointer overflow-hidden bg-zinc-950"
              >
                <video
                  src={clip.videoUrl}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                  onMouseOver={(e) => (e.currentTarget as HTMLVideoElement).play().catch(() => {})}
                  onMouseOut={(e) => {
                    const v = e.currentTarget as HTMLVideoElement;
                    v.pause();
                    v.currentTime = 0;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition" />

                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-mono text-zinc-300 backdrop-blur-sm">
                  {clip.aspectRatio} · {clip.duration}
                </div>

                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Play className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Preview</span>
                </div>
              </div>

              {/* Prompt info */}
              <div className="flex flex-1 flex-col justify-between p-3.5">
                <div>
                  <p className="line-clamp-2 text-xs leading-relaxed text-zinc-200">
                    "{clip.prompt}"
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-zinc-500">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(clip.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{clip.cameraMotion || 'Cinematic'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center justify-between border-t border-zinc-800/80 pt-2.5">
                  <button
                    onClick={() => onLoadIntoStudio(clip)}
                    className="flex items-center gap-1 text-[11px] font-medium text-violet-400 hover:text-violet-300"
                  >
                    <span>Load into Studio</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </button>

                  <div className="flex items-center gap-1">
                    <a
                      href={clip.videoUrl}
                      download={`cinecraft-${clip.id}.mp4`}
                      className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                      title="Download MP4"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                    <button
                      onClick={() => onDeleteClip(clip.id)}
                      className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-red-400"
                      title="Delete from archive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
