export interface CameraOption {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface LightingOption {
  id: string;
  name: string;
  description: string;
}

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  badge: string;
}

export const CAMERA_MOTIONS: CameraOption[] = [
  {
    id: 'pan-right',
    name: 'Slow Pan Right',
    description: 'Smooth horizontal glide scanning the environment',
    iconName: 'MoveRight',
  },
  {
    id: 'dolly-in',
    name: 'Cinematic Dolly In',
    description: 'Slow forward camera push toward the subject',
    iconName: 'ArrowUpRight',
  },
  {
    id: 'orbital-360',
    name: 'Orbital 360 Spin',
    description: 'Camera rotates smoothly around central focal point',
    iconName: 'RotateCw',
  },
  {
    id: 'drone-aerial',
    name: 'Drone Aerial Rise',
    description: 'Sweeping high-altitude crane rising above landscape',
    iconName: 'Plane',
  },
  {
    id: 'fpv-rush',
    name: 'FPV Forward Rush',
    description: 'Dynamic high-velocity motion weaving through space',
    iconName: 'Zap',
  },
  {
    id: 'static-lock',
    name: 'Static Tripod Lock',
    description: 'Stable locked-off camera letting action fill the frame',
    iconName: 'Crosshair',
  },
];

export const LIGHTING_STYLES: LightingOption[] = [
  {
    id: 'golden-hour',
    name: 'Golden Hour Sunset',
    description: 'Warm low-angle sunbeams, amber glow and long shadows',
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon & Rain',
    description: 'Vivid magenta & cyan reflections on wet asphalt with mist',
  },
  {
    id: 'dramatic-noir',
    name: 'Dramatic Film Noir',
    description: 'Chiaroscuro high-contrast shadows and moody rim light',
  },
  {
    id: 'volumetric-fog',
    name: 'Volumetric Ethereal Fog',
    description: 'Soft god rays cutting through dense atmospheric morning haze',
  },
  {
    id: 'studio-softbox',
    name: 'Studio Commercial Softbox',
    description: 'Pristine diffused key lighting, razor-sharp product details',
  },
  {
    id: 'bioluminescent',
    name: 'Bioluminescent Glow',
    description: 'Deep abyss darkness illuminated by glowing neon organisms',
  },
];

export const STYLE_ENGINES: StyleOption[] = [
  {
    id: 'photoreal',
    name: 'Photorealistic 35mm',
    description: 'Ultra-realistic cinematic film stock with subtle grain',
    badge: 'Cinema',
  },
  {
    id: 'anime',
    name: 'Anime / Ghibli Fantasy',
    description: 'Hand-painted watercolor backgrounds and lush cel shading',
    badge: 'Art',
  },
  {
    id: 'claymation',
    name: 'Stop-Motion Claymation',
    description: 'Tactile sculpted plasticine figures with charming jitter',
    badge: 'Stylized',
  },
  {
    id: 'vhs-retro',
    name: 'Vintage 1980s Retro VHS',
    description: 'Chromatic aberration, tape distortion, and nostalgic glow',
    badge: 'Retro',
  },
  {
    id: 'sci-fi-render',
    name: 'Futuristic Octane 3D',
    description: 'Hyper-detailed metallic textures, raytraced reflections',
    badge: '3D Render',
  },
];

export const INSPIRATION_PROMPTS = [
  {
    title: 'Cyberpunk Rain Alley',
    prompt: 'A hooded cybernetic wanderer walks down a neon-drenched Tokyo alleyway at midnight, holographic koi fish swimming through the misty air, puddles reflecting magenta and electric cyan light.',
    camera: 'Cinematic Dolly In',
    lighting: 'Cyberpunk Neon & Rain',
    style: 'Photorealistic 35mm',
  },
  {
    title: 'Deep Ocean Bioluminescence',
    prompt: 'A giant ethereal jellyfish made of glowing azure crystal gently pulsating in the midnight ocean trenches, surrounded by shimmering golden plankton drifting upward.',
    camera: 'Slow Pan Right',
    lighting: 'Bioluminescent Glow',
    style: 'Futuristic Octane 3D',
  },
  {
    title: 'Ancient Temple Discovery',
    prompt: 'Sunlight streams through the collapsed ceiling of an overgrown Mayan jungle temple, illuminating floating dust motes and ancient stone carvings covered in flowering vines.',
    camera: 'Drone Aerial Rise',
    lighting: 'Volumetric Ethereal Fog',
    style: 'Photorealistic 35mm',
  },
  {
    title: 'Whimsical Clay Bakery',
    prompt: 'A cute claymation badger baker wearing an apron cheerfully kneading dough on a rustic wooden table, flour puffing in the air, morning sunshine through cottage windows.',
    camera: 'Orbital 360 Spin',
    lighting: 'Golden Hour Sunset',
    style: 'Stop-Motion Claymation',
  },
  {
    title: 'Hyperdrive Warp Passage',
    prompt: 'Cockpit view of an explorer starship accelerating into hyperspace, distant galaxies warping into streaks of chromatic starlight, neon telemetry reflecting on the visor.',
    camera: 'FPV Forward Rush',
    lighting: 'Cyberpunk Neon & Rain',
    style: 'Futuristic Octane 3D',
  },
  {
    title: 'Floating Sakura Islands',
    prompt: 'Ancient floating pagoda islands suspended in the clouds during cherry blossom festival, pink petals swirling in mountain winds, anime watercolor aesthetic.',
    camera: 'Slow Pan Right',
    lighting: 'Golden Hour Sunset',
    style: 'Anime / Ghibli Fantasy',
  },
];

// High quality curated starter images for Image-to-Video mode
export const STARTER_IMAGES = [
  {
    id: 'cyber-samurai',
    name: 'Cyberpunk Street',
    prompt: 'The neon lights flicker as steam rises from manholes and light rain begins falling across the street.',
    url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'alpine-lake',
    name: 'Alpine Lake & Peaks',
    prompt: 'Gentle ripples spread across the crystal turquoise water as morning mist lifts off the pine forest.',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'desert-dune',
    name: 'Golden Sahara Dunes',
    prompt: 'Wind gently blows swirling ribbons of golden sand across the dune ridges under a blazing orange sun.',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'deep-space',
    name: 'Nebula Starfield',
    prompt: 'Cosmic clouds of interstellar gas slowly rotate and spiral around a newborn sapphire star.',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
  },
];
