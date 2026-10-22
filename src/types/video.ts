export type AspectRatio = '16:9' | '9:16' | '1:1';
export type VideoDuration = '5s' | '10s';
export type VideoResolution = '720p' | '1080p';

export interface VideoClip {
  id: string;
  interactionId?: string;
  prompt: string;
  enhancedPrompt?: string;
  videoUrl: string; // Blob URL or data URL
  mimeType: string;
  aspectRatio: AspectRatio;
  duration: VideoDuration;
  resolution: VideoResolution;
  cameraMotion?: string;
  lightingStyle?: string;
  styleEngine?: string;
  createdAt: number;
  starterImage?: string;
  parentClipId?: string; // If extended from another clip
  editHistory?: string[];
}

export interface StoryboardScene {
  sceneNumber: number;
  title: string;
  prompt: string;
  cameraMotion: string;
  transitionToNext: string;
  status?: 'idle' | 'generating' | 'completed' | 'error';
  clip?: VideoClip;
}

export interface StoryboardProject {
  title: string;
  synopsis: string;
  scenes: StoryboardScene[];
}

export interface ShowcaseItem {
  id: string;
  title: string;
  category: string;
  prompt: string;
  aspectRatio: AspectRatio;
  duration: VideoDuration;
  cameraMotion: string;
  lightingStyle: string;
  styleEngine: string;
  videoUrl: string;
  posterUrl: string;
  tags: string[];
}
