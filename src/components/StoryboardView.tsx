import React, { useState } from 'react';
import {
  Clapperboard,
  Sparkles,
  Play,
  Film,
  Camera,
  ArrowRight,
  Loader2,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { StoryboardProject, StoryboardScene, VideoClip } from '../types/video';

interface StoryboardViewProps {
  onGenerateScene: (scene: StoryboardScene) => Promise<void>;
  generatingSceneNumber: number | null;
  onLoadIntoStudio: (prompt: string, cameraMotion: string) => void;
}

const DEFAULT_STORYBOARD: StoryboardProject = {
  title: 'The Solitary Botanist',
  synopsis: 'A lonely maintenance automaton discovers a blooming flower in a forgotten neon metropolis and shields it from acid rain.',
  scenes: [
    {
      sceneNumber: 1,
      title: 'Desolate Discovery',
      prompt: 'A rusted vintage brass automaton with warm glowing optical eyes kneels on cracked rainy asphalt, discovering a single vibrant luminescent blue dandelion sprouting from the concrete.',
      cameraMotion: 'Low-angle slow tracking shot',
      transitionToNext: 'Slow dolly zoom into the glowing petals',
    },
    {
      sceneNumber: 2,
      title: 'Shielding the Bloom',
      prompt: 'Heavy acid rain begins falling as the robot gently cups its metallic mechanical hands over the delicate dandelion, raindrops sizzling on its warm metal casing.',
      cameraMotion: 'Close-up orbital 360 spin',
      transitionToNext: 'Match cut on falling raindrops to canopy',
    },
    {
      sceneNumber: 3,
      title: 'Makeshift Sanctuary',
      prompt: 'The automaton carefully places a salvaged glass jar over the dandelion, crafting a tiny protective greenhouse as golden sunlight breaks through the neon storm clouds.',
      cameraMotion: 'Crane rise pulling back to wide city vista',
      transitionToNext: 'Fade to cinematic amber glow',
    },
  ],
};

export const StoryboardView: React.FC<StoryboardViewProps> = ({
  onGenerateScene,
  generatingSceneNumber,
  onLoadIntoStudio,
}) => {
  const [concept, setConcept] = useState('');
  const [project, setProject] = useState<StoryboardProject>(DEFAULT_STORYBOARD);
  const [isPlanning, setIsPlanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlanStoryboard = async () => {
    if (!concept.trim()) return;
    setIsPlanning(true);
    setError(null);

    try {
      const res = await fetch('/api/prompt/storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept, scenesCount: 3 }),
      });
      const data = await res.json();
      if (data.success && data.storyboard) {
        setProject(data.storyboard);
      } else {
        setError(data.error || 'Failed to generate storyboard plan.');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error planning storyboard.');
    } finally {
      setIsPlanning(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 sm:p-6">
      {/* Storyboard Header / Concept Generator */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400">
              <Clapperboard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Storyboard Director</h2>
              <p className="text-xs text-zinc-400">
                Plan a multi-shot micro-film sequence with seamless temporal continuity
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="Enter film concept (e.g. Cyberpunk heist in neo-Tokyo, or Arctic expedition discovers lost monolith)..."
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-violet-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handlePlanStoryboard();
            }}
          />
          <button
            onClick={handlePlanStoryboard}
            disabled={isPlanning || !concept.trim()}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-violet-600/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPlanning ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Scripting Scenes...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Director Script</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <p className="mt-2 text-xs text-red-400">{error}</p>
        )}
      </div>

      {/* Project Overview */}
      <div className="flex flex-col gap-1 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{project.title}</h3>
          <span className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs font-semibold text-violet-400">
            {project.scenes.length} Consecutive Shots
          </span>
        </div>
        <p className="text-xs text-zinc-400">{project.synopsis}</p>
      </div>

      {/* Scenes Timeline Strip */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {project.scenes.map((scene, idx) => {
          const isRendering = generatingSceneNumber === scene.sceneNumber;

          return (
            <div
              key={scene.sceneNumber || idx}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 transition hover:border-zinc-700"
            >
              <div>
                {/* Scene Header */}
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex h-6 items-center rounded-md bg-zinc-800 px-2 text-[11px] font-mono font-bold text-violet-400">
                    Shot 0{scene.sceneNumber}
                  </span>
                  <span className="text-[11px] font-semibold text-zinc-300">
                    {scene.title}
                  </span>
                </div>

                {/* Prompt Card */}
                <div className="mb-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3 text-xs leading-relaxed text-zinc-300">
                  {scene.prompt}
                </div>

                {/* Camera & Transition notes */}
                <div className="mb-4 space-y-1.5 text-[11px]">
                  <div className="flex items-start gap-1.5 text-zinc-400">
                    <Camera className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" />
                    <span>
                      Camera: <strong className="text-zinc-200">{scene.cameraMotion}</strong>
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5 text-zinc-500">
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
                    <span>Transition: {scene.transitionToNext}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 border-t border-zinc-800/60 pt-3">
                <button
                  onClick={() => onGenerateScene(scene)}
                  disabled={isRendering}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-violet-600/20 py-2 text-xs font-semibold text-violet-300 transition hover:bg-violet-600/30 disabled:opacity-40"
                >
                  {isRendering ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Rendering...</span>
                    </>
                  ) : (
                    <>
                      <Film className="h-3.5 w-3.5 text-violet-400" />
                      <span>Render Scene</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onLoadIntoStudio(scene.prompt, scene.cameraMotion)}
                  className="rounded-lg border border-zinc-800 bg-zinc-800/60 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
                  title="Open in Studio to edit controls"
                >
                  Edit in Studio
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
