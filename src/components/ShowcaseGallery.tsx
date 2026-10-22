import React, { useState } from 'react';
import { Play, Sparkles, Film, ArrowRight, Tag } from 'lucide-react';
import { SHOWCASE_ITEMS } from '../data/showcase';
import { ShowcaseItem } from '../types/video';

interface ShowcaseGalleryProps {
  onRemix: (item: ShowcaseItem) => void;
}

export const ShowcaseGallery: React.FC<ShowcaseGalleryProps> = ({ onRemix }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const categories = ['All', 'Sci-Fi & Action', 'Nature & Landscape', 'Animation & Art', 'Fashion & Commercial', 'Retro & Synthwave'];

  const filteredItems =
    selectedCategory === 'All'
      ? SHOWCASE_ITEMS
      : SHOWCASE_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4 sm:p-6">
      {/* Gallery Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-400" />
          <h2 className="text-xl font-bold tracking-tight text-white">
            Cinema Inspiration & Remix Reel
          </h2>
        </div>
        <p className="text-xs text-zinc-400">
          Explore production-grade prompts generated with Gemini Omni Flash. Inspect cinematography blueprints and remix any style with 1 click.
        </p>

        {/* Filter Pills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Showcase Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => {
          const isPlaying = activeVideoId === item.id;

          return (
            <div
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 transition hover:border-zinc-700 hover:shadow-xl"
            >
              {/* Media Viewport */}
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                {isPlaying ? (
                  <video
                    src={item.videoUrl}
                    controls
                    autoPlay
                    loop
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />

                    <button
                      onClick={() => setActiveVideoId(item.id)}
                      className="absolute inset-0 flex items-center justify-center transition hover:bg-black/20"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600/90 text-white shadow-lg shadow-violet-600/40 transition group-hover:scale-110">
                        <Play className="ml-0.5 h-5 w-5" />
                      </div>
                    </button>
                  </>
                )}

                {/* Aspect Ratio Badge */}
                <span className="absolute top-2.5 right-2.5 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-zinc-300 backdrop-blur-sm">
                  {item.aspectRatio} · {item.duration}
                </span>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>

                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-300">
                    "{item.prompt}"
                  </p>

                  {/* Cinematography tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded bg-zinc-800/80 px-1.5 py-0.5 text-[10px] text-zinc-400">
                      {item.cameraMotion}
                    </span>
                    <span className="rounded bg-zinc-800/80 px-1.5 py-0.5 text-[10px] text-zinc-400">
                      {item.lightingStyle}
                    </span>
                  </div>
                </div>

                {/* Remix Button */}
                <div className="mt-4 pt-3 border-t border-zinc-800/60">
                  <button
                    onClick={() => onRemix(item)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2 text-xs font-bold text-white shadow transition hover:opacity-95"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Remix in Studio</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
