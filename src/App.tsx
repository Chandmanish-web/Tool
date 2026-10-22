import React, { useState, useEffect } from 'react';
import { Navbar, StudioTab } from './components/Navbar';
import { PromptEditor } from './components/PromptEditor';
import { VideoPlayer } from './components/VideoPlayer';
import { GenerationProgress } from './components/GenerationProgress';
import { VideoEditorModal } from './components/VideoEditorModal';
import { StoryboardView } from './components/StoryboardView';
import { ShowcaseGallery } from './components/ShowcaseGallery';
import { HistoryDrawer } from './components/HistoryDrawer';
import { VideoClip, AspectRatio, VideoDuration, VideoResolution, ShowcaseItem, StoryboardScene } from './types/video';
import { SHOWCASE_ITEMS } from './data/showcase';
import { AlertCircle, Film, Sparkles, X } from 'lucide-react';

const STORAGE_KEY = 'cinecraft_saved_clips';

export default function App() {
  const [currentTab, setCurrentTab] = useState<StudioTab>('studio');

  // Studio Creation Controls
  const [prompt, setPrompt] = useState(
    'A cinematic close-up of a futuristic cybernetic tiger with glowing azure circuit stripes walking through a foggy neon alley in neo-Tokyo, slow camera tracking.'
  );
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [duration, setDuration] = useState<VideoDuration>('5s');
  const [resolution, setResolution] = useState<VideoResolution>('720p');
  const [cameraMotion, setCameraMotion] = useState('Cinematic Dolly In');
  const [lightingStyle, setLightingStyle] = useState('Cyberpunk Neon & Rain');
  const [styleEngine, setStyleEngine] = useState('Photorealistic 35mm');
  const [starterImage, setStarterImage] = useState<string | null>(null);

  // Operation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatingSceneNumber, setGeneratingSceneNumber] = useState<number | null>(null);

  // Editor Modal (Extend / Edit)
  const [editorModal, setEditorModal] = useState<{
    isOpen: boolean;
    mode: 'extend' | 'edit';
    clip: VideoClip | null;
  }>({
    isOpen: false,
    mode: 'extend',
    clip: null,
  });
  const [isProcessingEdit, setIsProcessingEdit] = useState(false);

  // History & Active Clip
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [activeClip, setActiveClip] = useState<VideoClip | null>(null);

  // Load clips from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as VideoClip[];
        setClips(parsed);
        if (parsed.length > 0) {
          setActiveClip(parsed[0]);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to load stored clips:', e);
    }

    // Default to first showcase clip if empty
    const defaultClip: VideoClip = {
      id: SHOWCASE_ITEMS[0].id,
      prompt: SHOWCASE_ITEMS[0].prompt,
      videoUrl: SHOWCASE_ITEMS[0].videoUrl,
      mimeType: 'video/mp4',
      aspectRatio: SHOWCASE_ITEMS[0].aspectRatio,
      duration: SHOWCASE_ITEMS[0].duration,
      resolution: '720p',
      cameraMotion: SHOWCASE_ITEMS[0].cameraMotion,
      lightingStyle: SHOWCASE_ITEMS[0].lightingStyle,
      styleEngine: SHOWCASE_ITEMS[0].styleEngine,
      createdAt: Date.now(),
    };
    setActiveClip(defaultClip);
  }, []);

  const saveClip = (newClip: VideoClip) => {
    setClips((prev) => {
      const updated = [newClip, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 30)));
      } catch (err) {
        console.warn('Storage quota limit:', err);
      }
      return updated;
    });
    setActiveClip(newClip);
  };

  // Convert Base64 string to Blob URL
  const base64ToBlobUrl = (base64: string, mimeType = 'video/mp4'): string => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    return URL.createObjectURL(blob);
  };

  // 1. Generate Video
  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspectRatio,
          duration,
          resolution,
          imageBase64: starterImage,
          cameraMotion,
          lightingStyle,
          styleEngine,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Video generation failed.');
      }

      if (data.videoData) {
        const videoUrl = base64ToBlobUrl(data.videoData, data.mimeType || 'video/mp4');
        const newClip: VideoClip = {
          id: `gen-${Date.now()}`,
          interactionId: data.interactionId,
          prompt: data.prompt || prompt,
          videoUrl,
          mimeType: data.mimeType || 'video/mp4',
          aspectRatio,
          duration,
          resolution,
          cameraMotion,
          lightingStyle,
          styleEngine,
          starterImage: starterImage || undefined,
          createdAt: Date.now(),
        };
        saveClip(newClip);
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMessage(
        err?.message ||
          'Failed to communicate with the Gemini Omni Flash video generation service. Please check your API key settings.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Enhance Prompt with Gemini 3.8 Flash
  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing) return;

    setIsEnhancing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/prompt/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style: styleEngine,
          targetRatio: aspectRatio,
        }),
      });

      const data = await res.json();
      if (data.success && data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
        if (data.cameraDirectorNote) {
          setCameraMotion(data.cameraDirectorNote);
        }
        if (data.lightingNote) {
          setLightingStyle(data.lightingNote);
        }
      } else {
        setErrorMessage(data.error || 'Could not enhance prompt.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to enhance prompt.');
    } finally {
      setIsEnhancing(false);
    }
  };

  // 3. Extend or Edit Video via Modal
  const handleModalSubmit = async (instruction: string, mode: 'extend' | 'edit') => {
    if (!editorModal.clip) return;
    setIsProcessingEdit(true);
    setErrorMessage(null);

    try {
      const endpoint = mode === 'extend' ? '/api/video/extend' : '/api/video/edit';
      const payload =
        mode === 'extend'
          ? {
              interactionId: editorModal.clip.interactionId || editorModal.clip.id,
              extensionPrompt: instruction,
              duration: '5s',
            }
          : {
              interactionId: editorModal.clip.interactionId || editorModal.clip.id,
              editPrompt: instruction,
            };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || `${mode} operation failed.`);
      }

      if (data.videoData) {
        const videoUrl = base64ToBlobUrl(data.videoData, data.mimeType || 'video/mp4');
        const newClip: VideoClip = {
          id: `${mode}-${Date.now()}`,
          interactionId: data.interactionId,
          prompt: data.prompt || instruction,
          videoUrl,
          mimeType: data.mimeType || 'video/mp4',
          aspectRatio: editorModal.clip.aspectRatio,
          duration: editorModal.clip.duration,
          resolution: editorModal.clip.resolution,
          cameraMotion: editorModal.clip.cameraMotion,
          lightingStyle: editorModal.clip.lightingStyle,
          styleEngine: editorModal.clip.styleEngine,
          parentClipId: editorModal.clip.id,
          createdAt: Date.now(),
        };
        saveClip(newClip);
        setEditorModal({ isOpen: false, mode: 'extend', clip: null });
        setCurrentTab('studio');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || `Failed to ${mode} video.`);
    } finally {
      setIsProcessingEdit(false);
    }
  };

  // 4. Storyboard Scene Generation
  const handleGenerateStoryboardScene = async (scene: StoryboardScene) => {
    setGeneratingSceneNumber(scene.sceneNumber);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: scene.prompt,
          aspectRatio: '16:9',
          duration: '5s',
          resolution: '720p',
          cameraMotion: scene.cameraMotion,
          lightingStyle: 'Cinematic Movie Lighting',
        }),
      });

      const data = await res.json();
      if (data.videoData) {
        const videoUrl = base64ToBlobUrl(data.videoData, data.mimeType || 'video/mp4');
        const newClip: VideoClip = {
          id: `scene-${scene.sceneNumber}-${Date.now()}`,
          interactionId: data.interactionId,
          prompt: scene.prompt,
          videoUrl,
          mimeType: data.mimeType || 'video/mp4',
          aspectRatio: '16:9',
          duration: '5s',
          resolution: '720p',
          cameraMotion: scene.cameraMotion,
          createdAt: Date.now(),
        };
        saveClip(newClip);
        setCurrentTab('studio');
      } else {
        throw new Error(data.error || 'Failed to render scene.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error generating scene video.');
    } finally {
      setGeneratingSceneNumber(null);
    }
  };

  // 5. Remix from Showcase
  const handleRemixShowcase = (item: ShowcaseItem) => {
    setPrompt(item.prompt);
    setAspectRatio(item.aspectRatio);
    setDuration(item.duration);
    setCameraMotion(item.cameraMotion);
    setLightingStyle(item.lightingStyle);
    setStyleEngine(item.styleEngine);
    setCurrentTab('studio');
  };

  // 6. Load clip into Studio
  const handleLoadClipIntoStudio = (clip: VideoClip) => {
    setPrompt(clip.prompt);
    setAspectRatio(clip.aspectRatio);
    setDuration(clip.duration);
    setResolution(clip.resolution);
    if (clip.cameraMotion) setCameraMotion(clip.cameraMotion);
    if (clip.lightingStyle) setLightingStyle(clip.lightingStyle);
    if (clip.styleEngine) setStyleEngine(clip.styleEngine);
    setActiveClip(clip);
    setCurrentTab('studio');
  };

  const handleDeleteClip = (id: string) => {
    const updated = clips.filter((c) => c.id !== id);
    setClips(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
    if (activeClip?.id === id) {
      setActiveClip(updated[0] || null);
    }
  };

  const handleClearAllClips = () => {
    setClips([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-violet-600/30">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        savedClipsCount={clips.length}
        onNewVideo={() => {
          setPrompt('');
          setStarterImage(null);
          setCurrentTab('studio');
        }}
        isGenerating={isGenerating}
      />

      {/* Error Banner with Dismiss */}
      {errorMessage && (
        <div className="mx-auto mt-4 w-full max-w-7xl px-4 sm:px-6">
          <div className="flex items-start justify-between rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-xs text-red-200 shadow-lg backdrop-blur-sm">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <div>
                <p className="font-semibold text-red-300">Generation Notice</p>
                <p className="mt-0.5 leading-relaxed text-red-200/90">{errorMessage}</p>
                <p className="mt-1.5 text-[11px] text-zinc-400">
                  Tip: Gemini Omni Flash video generation requires an active API key with access to the Gemini video service. You can also explore the <strong>Inspiration</strong> tab to inspect sample cinema reels.
                </p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="rounded-lg p-1 text-zinc-400 hover:bg-red-900/40 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main View Port */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {currentTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Studio Director Controls (5 cols) */}
            <div className="lg:col-span-5 flex flex-col">
              <PromptEditor
                prompt={prompt}
                onChangePrompt={setPrompt}
                aspectRatio={aspectRatio}
                onChangeAspectRatio={setAspectRatio}
                duration={duration}
                onChangeDuration={setDuration}
                resolution={resolution}
                onChangeResolution={setResolution}
                cameraMotion={cameraMotion}
                onChangeCameraMotion={setCameraMotion}
                lightingStyle={lightingStyle}
                onChangeLightingStyle={setLightingStyle}
                styleEngine={styleEngine}
                onChangeStyleEngine={setStyleEngine}
                starterImage={starterImage}
                onChangeStarterImage={setStarterImage}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                onEnhancePrompt={handleEnhancePrompt}
                isEnhancing={isEnhancing}
              />
            </div>

            {/* Right Column: Cinema Monitor & Playback Deck (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {isGenerating ? (
                <GenerationProgress
                  prompt={prompt}
                  duration={duration}
                  aspectRatio={aspectRatio}
                  cameraMotion={cameraMotion}
                />
              ) : activeClip ? (
                <VideoPlayer
                  clip={activeClip}
                  onExtend={(clip) =>
                    setEditorModal({ isOpen: true, mode: 'extend', clip })
                  }
                  onEdit={(clip) =>
                    setEditorModal({ isOpen: true, mode: 'edit', clip })
                  }
                  onRemixInPrompt={handleLoadClipIntoStudio}
                />
              ) : (
                <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950 p-8 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-violet-400">
                    <Film className="h-8 w-8" />
                  </div>
                  <h3 className="text-base font-bold text-white">Studio Monitor Ready</h3>
                  <p className="mt-1 max-w-md text-xs text-zinc-400">
                    Type a prompt on the left and click <strong>Generate AI Video</strong> to start synthesizing spatio-temporal video streams.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {currentTab === 'storyboard' && (
          <StoryboardView
            onGenerateScene={handleGenerateStoryboardScene}
            generatingSceneNumber={generatingSceneNumber}
            onLoadIntoStudio={(scenePrompt, cam) => {
              setPrompt(scenePrompt);
              setCameraMotion(cam);
              setCurrentTab('studio');
            }}
          />
        )}

        {currentTab === 'showcase' && (
          <ShowcaseGallery onRemix={handleRemixShowcase} />
        )}

        {currentTab === 'history' && (
          <HistoryDrawer
            clips={clips}
            onSelectClip={(clip) => {
              setActiveClip(clip);
              setCurrentTab('studio');
            }}
            onDeleteClip={handleDeleteClip}
            onClearAll={handleClearAllClips}
            onLoadIntoStudio={handleLoadClipIntoStudio}
          />
        )}
      </main>

      {/* Video Editor Modal for Multi-turn Extend & Edit */}
      {editorModal.isOpen && editorModal.clip && (
        <VideoEditorModal
          clip={editorModal.clip}
          mode={editorModal.mode}
          onClose={() => setEditorModal({ isOpen: false, mode: 'extend', clip: null })}
          onSubmit={handleModalSubmit}
          isProcessing={isProcessingEdit}
        />
      )}

      {/* Minimal Footer */}
      <footer className="mt-auto border-t border-zinc-800/60 bg-zinc-950 py-3 text-center text-[11px] text-zinc-500">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
          <span>CineCraft AI Studio · Built with Gemini Omni Flash</span>
          <div className="flex items-center gap-3">
            <span>Aspect Ratios: 16:9 · 9:16 · 1:1</span>
            <span>•</span>
            <span>Multimodal Continuity</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
