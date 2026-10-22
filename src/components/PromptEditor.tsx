import React, { useState } from 'react';
import {
  Sparkles,
  Dice5,
  Image as ImageIcon,
  Type,
  Video,
  Layers,
  Sun,
  Camera,
  Film,
  Upload,
  X,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AspectRatio, VideoDuration, VideoResolution } from '../types/video';
import {
  CAMERA_MOTIONS,
  LIGHTING_STYLES,
  STYLE_ENGINES,
  INSPIRATION_PROMPTS,
  STARTER_IMAGES,
} from '../data/presets';

interface PromptEditorProps {
  prompt: string;
  onChangePrompt: (prompt: string) => void;
  aspectRatio: AspectRatio;
  onChangeAspectRatio: (ratio: AspectRatio) => void;
  duration: VideoDuration;
  onChangeDuration: (duration: VideoDuration) => void;
  resolution: VideoResolution;
  onChangeResolution: (res: VideoResolution) => void;
  cameraMotion: string;
  onChangeCameraMotion: (motion: string) => void;
  lightingStyle: string;
  onChangeLightingStyle: (lighting: string) => void;
  styleEngine: string;
  onChangeStyleEngine: (style: string) => void;
  starterImage: string | null;
  onChangeStarterImage: (base64: string | null) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  onEnhancePrompt: () => void;
  isEnhancing: boolean;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  prompt,
  onChangePrompt,
  aspectRatio,
  onChangeAspectRatio,
  duration,
  onChangeDuration,
  resolution,
  onChangeResolution,
  cameraMotion,
  onChangeCameraMotion,
  lightingStyle,
  onChangeLightingStyle,
  styleEngine,
  onChangeStyleEngine,
  starterImage,
  onChangeStarterImage,
  onGenerate,
  isGenerating,
  onEnhancePrompt,
  isEnhancing,
}) => {
  const [activeMode, setActiveMode] = useState<'text' | 'image'>(starterImage ? 'image' : 'text');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleRandomPrompt = () => {
    const random = INSPIRATION_PROMPTS[Math.floor(Math.random() * INSPIRATION_PROMPTS.length)];
    onChangePrompt(random.prompt);
    onChangeCameraMotion(random.camera);
    onChangeLightingStyle(random.lighting);
    onChangeStyleEngine(random.style);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onChangeStarterImage(result);
      setActiveMode('image');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectStarterSample = async (url: string, suggestedPrompt: string) => {
    try {
      // Fetch and convert sample to base64
      const res = await fetch(url);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        onChangeStarterImage(reader.result as string);
        if (!prompt.trim()) {
          onChangePrompt(suggestedPrompt);
        }
        setActiveMode('image');
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.warn('Failed to fetch sample image, using URL reference:', err);
      onChangeStarterImage(url);
    }
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto pr-1">
      {/* Mode Switcher: Text vs Image-to-Video */}
      <div className="flex rounded-xl border border-zinc-800 bg-zinc-900/70 p-1">
        <button
          onClick={() => {
            setActiveMode('text');
            onChangeStarterImage(null);
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
            activeMode === 'text'
              ? 'bg-zinc-800 text-white shadow'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Type className="h-3.5 w-3.5 text-indigo-400" />
          <span>Text-to-Video</span>
        </button>

        <button
          onClick={() => setActiveMode('image')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
            activeMode === 'image'
              ? 'bg-zinc-800 text-white shadow'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ImageIcon className="h-3.5 w-3.5 text-cyan-400" />
          <span>Image-to-Video (Animate)</span>
        </button>
      </div>

      {/* Image Upload Area if in Image mode */}
      {activeMode === 'image' && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-300">Initial Reference Frame</span>
            {starterImage && (
              <button
                onClick={() => onChangeStarterImage(null)}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-red-400"
              >
                <X className="h-3 w-3" />
                <span>Remove Frame</span>
              </button>
            )}
          </div>

          {starterImage ? (
            <div className="relative overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950">
              <img
                src={starterImage}
                alt="Starting frame"
                className="h-36 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-zinc-900/90 px-2 py-1 text-[11px] font-medium text-cyan-300 backdrop-blur-sm">
                <Check className="h-3 w-3 text-cyan-400" />
                <span>Frame locked & ready for motion synthesis</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-zinc-700 bg-zinc-950/50 p-4 transition hover:border-violet-500 hover:bg-zinc-900/50">
                <Upload className="mb-1 h-5 w-5 text-zinc-400" />
                <span className="text-xs font-medium text-zinc-300">
                  Drop starter image here, or browse
                </span>
                <span className="text-[10px] text-zinc-500">PNG, JPG or WebP up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Quick Pick Starters */}
              <div>
                <span className="mb-1.5 block text-[11px] text-zinc-500">Or pick a starter frame:</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {STARTER_IMAGES.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectStarterSample(item.url, item.prompt)}
                      className="group relative overflow-hidden rounded-md border border-zinc-800 hover:border-cyan-500/60"
                      title={item.name}
                    >
                      <img
                        src={item.url}
                        alt={item.name}
                        className="h-12 w-full object-cover transition group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 transition group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Prompt Card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Director's Scene Prompt
          </label>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRandomPrompt}
              className="flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-800/80 px-2 py-1 text-[11px] font-medium text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
              title="Surprise me with an inspiration prompt"
            >
              <Dice5 className="h-3 w-3 text-amber-400" />
              <span>Inspiration</span>
            </button>
            <button
              onClick={onEnhancePrompt}
              disabled={isEnhancing || !prompt.trim()}
              className="flex items-center gap-1 rounded-md border border-violet-500/30 bg-violet-500/10 px-2 py-1 text-[11px] font-medium text-violet-300 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-40"
              title="Use Gemini 3.8 Flash to enhance shot lighting, lens & motion"
            >
              <Sparkles className={`h-3 w-3 text-violet-400 ${isEnhancing ? 'animate-spin' : ''}`} />
              <span>{isEnhancing ? 'Enhancing...' : 'Magic Polish'}</span>
            </button>
          </div>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => onChangePrompt(e.target.value)}
          placeholder={
            activeMode === 'image'
              ? 'Describe how this frame comes alive (e.g. cherry blossoms gently drift, wind ripples through water, camera pans slowly right)...'
              : 'A hyper-realistic cinematic scene of an astronaut discovering a glowing crystal cavern on a purple alien moon, slow camera dolly in, anamorphic lens flare...'
          }
          rows={4}
          className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950/70 p-3 text-xs leading-relaxed text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30"
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              if (!isGenerating && prompt.trim()) {
                onGenerate();
              }
            }
          }}
        />

        <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Press ⌘+Enter to render</span>
          <span>{prompt.length} characters</span>
        </div>
      </div>

      {/* Core Video Configuration: Aspect Ratio, Duration & Quality */}
      <div className="grid grid-cols-3 gap-2">
        {/* Aspect Ratio */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-2.5">
          <span className="mb-1.5 block text-[11px] font-medium text-zinc-400">Aspect Ratio</span>
          <div className="grid grid-cols-3 gap-1">
            {(['16:9', '9:16', '1:1'] as AspectRatio[]).map((ratio) => (
              <button
                key={ratio}
                onClick={() => onChangeAspectRatio(ratio)}
                className={`rounded-md py-1.5 text-[11px] font-semibold transition ${
                  aspectRatio === ratio
                    ? 'border border-violet-500/40 bg-violet-600/20 text-violet-300'
                    : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-2.5">
          <span className="mb-1.5 block text-[11px] font-medium text-zinc-400">Duration</span>
          <div className="grid grid-cols-2 gap-1">
            {(['5s', '10s'] as VideoDuration[]).map((d) => (
              <button
                key={d}
                onClick={() => onChangeDuration(d)}
                className={`rounded-md py-1.5 text-[11px] font-semibold transition ${
                  duration === d
                    ? 'border border-violet-500/40 bg-violet-600/20 text-violet-300'
                    : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Resolution */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-2.5">
          <span className="mb-1.5 block text-[11px] font-medium text-zinc-400">Resolution</span>
          <div className="grid grid-cols-2 gap-1">
            {(['720p', '1080p'] as VideoResolution[]).map((res) => (
              <button
                key={res}
                onClick={() => onChangeResolution(res)}
                className={`rounded-md py-1.5 text-[11px] font-semibold transition ${
                  resolution === res
                    ? 'border border-violet-500/40 bg-violet-600/20 text-violet-300'
                    : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {res}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Camera Motion Director */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Camera className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-xs font-semibold text-zinc-300">Camera Direction</span>
          </div>
          <span className="text-[10px] text-zinc-500">Motion Path</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {CAMERA_MOTIONS.map((cam) => (
            <button
              key={cam.id}
              onClick={() => onChangeCameraMotion(cam.name)}
              className={`flex flex-col items-start rounded-lg border p-2 text-left transition ${
                cameraMotion === cam.name
                  ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-200'
                  : 'border-zinc-800/80 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <span className="text-[11px] font-semibold">{cam.name}</span>
              <span className="line-clamp-1 text-[9px] text-zinc-500">{cam.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Cinematography Drawer: Lighting & Style */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center justify-between p-3 text-xs font-semibold text-zinc-300 hover:text-white"
        >
          <div className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-violet-400" />
            <span>Cinematography & Style Grading</span>
          </div>
          {showAdvanced ? (
            <ChevronUp className="h-3.5 w-3.5 text-zinc-400" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
          )}
        </button>

        {showAdvanced && (
          <div className="space-y-3.5 border-t border-zinc-800 p-3">
            {/* Lighting Style */}
            <div>
              <div className="mb-1.5 flex items-center gap-1.5">
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs font-medium text-zinc-300">Atmosphere & Lighting</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {LIGHTING_STYLES.map((light) => (
                  <button
                    key={light.id}
                    onClick={() => onChangeLightingStyle(light.name)}
                    className={`rounded-lg border p-2 text-left transition ${
                      lightingStyle === light.name
                        ? 'border-amber-500/50 bg-amber-500/10 text-amber-200'
                        : 'border-zinc-800/80 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div className="text-[11px] font-medium">{light.name}</div>
                    <div className="line-clamp-1 text-[9px] text-zinc-500">{light.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Style Engine */}
            <div>
              <div className="mb-1.5 flex items-center gap-1.5">
                <Film className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-xs font-medium text-zinc-300">Style Engine</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {STYLE_ENGINES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => onChangeStyleEngine(style.name)}
                    className={`flex items-center justify-between rounded-lg border p-2 text-left transition ${
                      styleEngine === style.name
                        ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-200'
                        : 'border-zinc-800/80 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div>
                      <div className="text-[11px] font-medium">{style.name}</div>
                      <div className="line-clamp-1 text-[9px] text-zinc-500">{style.description}</div>
                    </div>
                    <span className="rounded bg-zinc-800 px-1 py-0.5 text-[9px] text-zinc-400">
                      {style.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Generation CTA */}
      <button
        onClick={onGenerate}
        disabled={isGenerating || !prompt.trim()}
        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/30 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Video className={`h-4 w-4 ${isGenerating ? 'animate-bounce' : 'transition group-hover:scale-110'}`} />
        <span>{isGenerating ? 'Rendering Video Stream...' : 'Generate AI Video'}</span>
        <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-normal tracking-wide text-white/90">
          {duration} · {resolution}
        </span>
      </button>
    </div>
  );
};
