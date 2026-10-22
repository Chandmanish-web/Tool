import React from 'react';
import { Film, Clapperboard, Sparkles, Compass, History, Video, Plus, Download } from 'lucide-react';

export type StudioTab = 'studio' | 'storyboard' | 'showcase' | 'history';

interface NavbarProps {
  currentTab: StudioTab;
  onSelectTab: (tab: StudioTab) => void;
  savedClipsCount: number;
  onNewVideo: () => void;
  isGenerating: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  savedClipsCount,
  onNewVideo,
  isGenerating,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-violet-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-zinc-950">
              <Film className="h-5 w-5 text-indigo-400" />
            </div>
            {isGenerating && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">CineCraft</span>
              <span className="rounded-md border border-violet-500/30 bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-400">
                Omni Flash
              </span>
            </div>
            <p className="hidden text-xs text-zinc-400 sm:block">AI Video Generation Studio</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-1">
          <button
            onClick={() => onSelectTab('studio')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              currentTab === 'studio'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Video className="h-3.5 w-3.5" />
            <span>Studio</span>
          </button>

          <button
            onClick={() => onSelectTab('storyboard')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              currentTab === 'storyboard'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Clapperboard className="h-3.5 w-3.5" />
            <span>Storyboard</span>
          </button>

          <button
            onClick={() => onSelectTab('showcase')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              currentTab === 'showcase'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Inspiration</span>
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              currentTab === 'history'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>Archive</span>
            {savedClipsCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-800 px-1 text-[10px] text-zinc-300">
                {savedClipsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Actions & Status */}
        <div className="flex items-center gap-2">
          {isGenerating ? (
            <div className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-3 py-1.5 text-xs text-cyan-300">
              <span className="h-2 w-2 animate-ping rounded-full bg-cyan-400"></span>
              <span className="hidden sm:inline">Synthesizing...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a
                href="/api/download-project"
                download="cinecraft-ai-video-studio.zip"
                className="flex items-center gap-1.5 rounded-lg border border-violet-500/40 bg-violet-600/15 px-3 py-1.5 text-xs font-semibold text-violet-300 shadow-sm transition hover:bg-violet-600/25 hover:text-white"
                title="Download full project folder ZIP to run in VS Code"
              >
                <Download className="h-3.5 w-3.5 text-violet-400" />
                <span className="hidden sm:inline">Export for VS Code</span>
              </a>

              <button
                onClick={onNewVideo}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-200 shadow-sm transition hover:border-zinc-600 hover:bg-zinc-700 hover:text-white"
              >
                <Plus className="h-3.5 w-3.5 text-zinc-400" />
                <span className="hidden sm:inline">New Prompt</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
