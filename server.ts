import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies up to 50MB for image-to-video base64 payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to initialize GoogleGenAI client with required User-Agent
function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[Gemini] GEMINI_API_KEY is not set in environment.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Generate Video (Text-to-Video and Image-to-Video using gemini-omni-1.1-flash)
app.post('/api/video/generate', async (req, res) => {
  const {
    prompt,
    aspectRatio = '16:9',
    duration = '5s',
    resolution = '720p',
    imageBase64,
    imageMimeType = 'image/png',
    cameraMotion,
    lightingStyle,
  } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  let finalPrompt = prompt.trim();
  const enhancers: string[] = [];
  if (cameraMotion && !finalPrompt.toLowerCase().includes(cameraMotion.toLowerCase())) {
    enhancers.push(`Camera movement: ${cameraMotion}`);
  }
  if (lightingStyle && !finalPrompt.toLowerCase().includes(lightingStyle.toLowerCase())) {
    enhancers.push(`Lighting: ${lightingStyle}`);
  }
  if (enhancers.length > 0) {
    finalPrompt = `${finalPrompt}. ${enhancers.join(', ')}.`;
  }

  try {
    const ai = getGenAIClient();

    let inputPayload: any;
    if (imageBase64) {
      // Image-to-Video: strip data URL prefix if present
      const cleanData = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      inputPayload = [
        {
          type: 'image',
          mime_type: imageMimeType || 'image/png',
          data: cleanData,
        },
        {
          type: 'text',
          text: finalPrompt,
        },
      ];
    } else {
      inputPayload = finalPrompt;
    }

    const interaction = await ai.interactions.create(
      {
        model: 'gemini-omni-1.1-flash',
        input: inputPayload,
        background: false,
        store: true, // Allows subsequent video editing and extension
        stream: false,
        response_format: {
          type: 'video',
          aspect_ratio: aspectRatio === '9:16' ? '9:16' : '16:9',
          duration: duration === '10s' ? '10s' : '5s',
          resolution: resolution === '1080p' ? '1080p' : '720p',
        },
      },
      { timeout: 300000 }
    );

    const videoPart = interaction.output_video;
    if (videoPart && videoPart.data) {
      return res.json({
        success: true,
        interactionId: interaction.id,
        videoData: videoPart.data,
        mimeType: videoPart.mime_type || 'video/mp4',
        aspectRatio,
        duration,
        prompt: finalPrompt,
      });
    }

    return res.status(502).json({
      error: 'Model response did not contain video output data.',
      interactionId: interaction?.id,
    });
  } catch (err: any) {
    console.error('Error generating video:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to generate video with Gemini Omni Flash.',
      details: err?.toString(),
    });
  }
});

// 2. Extend Video (continuation of previous scene)
app.post('/api/video/extend', async (req, res) => {
  const { interactionId, extensionPrompt, duration = '5s' } = req.body;

  if (!interactionId) {
    return res.status(400).json({ error: 'interactionId is required for extension.' });
  }

  try {
    const ai = getGenAIClient();
    const promptText = extensionPrompt?.trim() || 'Continue the scene seamlessly as the camera glides through the environment.';

    const extended = await ai.interactions.create(
      {
        model: 'gemini-omni-1.1-flash',
        previous_interaction_id: interactionId,
        input: promptText,
        background: false,
        store: true,
        stream: false,
        response_format: {
          type: 'video',
          duration: duration === '10s' ? '10s' : '5s',
        },
      },
      { timeout: 300000 }
    );

    const videoPart = extended.output_video;
    if (videoPart && videoPart.data) {
      return res.json({
        success: true,
        interactionId: extended.id,
        videoData: videoPart.data,
        mimeType: videoPart.mime_type || 'video/mp4',
        prompt: promptText,
      });
    }

    return res.status(502).json({
      error: 'Extension succeeded but did not return video output.',
    });
  } catch (err: any) {
    console.error('Error extending video:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to extend video.',
      details: err?.toString(),
    });
  }
});

// 3. Edit Video (iterative chat editing)
app.post('/api/video/edit', async (req, res) => {
  const { interactionId, editPrompt } = req.body;

  if (!interactionId || !editPrompt) {
    return res.status(400).json({ error: 'interactionId and editPrompt are required.' });
  }

  try {
    const ai = getGenAIClient();
    const edited = await ai.interactions.create(
      {
        model: 'gemini-omni-1.1-flash',
        previous_interaction_id: interactionId,
        input: editPrompt.trim(),
        background: false,
        store: true,
        stream: false,
        response_format: {
          type: 'video',
        },
      },
      { timeout: 300000 }
    );

    const videoPart = edited.output_video;
    if (videoPart && videoPart.data) {
      return res.json({
        success: true,
        interactionId: edited.id,
        videoData: videoPart.data,
        mimeType: videoPart.mime_type || 'video/mp4',
        prompt: editPrompt,
      });
    }

    return res.status(502).json({
      error: 'Edit succeeded but did not return video output.',
    });
  } catch (err: any) {
    console.error('Error editing video:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to edit video.',
      details: err?.toString(),
    });
  }
});

// 4. Enhance Video Prompt with Hollywood Director Specs (Gemini 3.8 Flash)
app.post('/api/prompt/enhance', async (req, res) => {
  const { prompt, style, targetRatio } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const ai = getGenAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are an elite cinematic director and AI prompt engineer for high-end video generation models like Gemini Omni Flash and Google Veo.
User concept: "${prompt}"
Desired Style: "${style || 'Cinematic Photorealism'}"
Aspect Ratio: "${targetRatio || '16:9'}"

Task: Transform this concept into an astonishingly vivid, physically plausible video generation prompt.
Include:
1. Subject & dynamic action (clear focal point and natural movement)
2. Camera movement & lens (e.g. 35mm anamorphic, slow orbital tracking, subtle depth of field rack focus)
3. Lighting & atmosphere (e.g. volumetric golden hour rim lighting, subtle haze, specular reflections)
4. Color palette & grade (e.g. Kodak 5207 film stock, teal and amber tone)
5. Temporal pacing (smooth, continuous, avoiding sudden morphs)

Format your response strictly as a JSON object with:
{
  "enhancedPrompt": "The full detailed prompt in 2-3 sentences ready to feed directly into the video model",
  "cameraDirectorNote": "Short camera movement note (e.g., 'Low-angle slow tracking shot')",
  "lightingNote": "Short lighting scheme (e.g., 'Volumetric twilight with warm rim highlight')",
  "moodKeywords": ["Keyword1", "Keyword2", "Keyword3", "Keyword4"]
}`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      enhancedPrompt: parsed.enhancedPrompt || prompt,
      cameraDirectorNote: parsed.cameraDirectorNote || '',
      lightingNote: parsed.lightingNote || '',
      moodKeywords: parsed.moodKeywords || [],
    });
  } catch (err: any) {
    console.warn('Error calling Gemini for prompt enhance, falling back to smart director enhancement:', err);
    // Robust director-grade fallback so the user always receives an enhanced prompt
    const enhancedPrompt = `Cinematic 35mm anamorphic shot: ${prompt.trim()}. Slow orbital camera push with shallow depth of field, bathed in dramatic volumetric rim lighting and subtle atmospheric haze, Kodak Vision3 500T color grading.`;
    return res.json({
      success: true,
      enhancedPrompt,
      cameraDirectorNote: 'Slow orbital camera push with shallow depth of field',
      lightingNote: 'Dramatic volumetric rim lighting and subtle atmospheric haze',
      moodKeywords: ['Cinematic', '35mm Anamorphic', 'Volumetric Lighting', 'Kodak 500T'],
    });
  }
});

// 5. Generate Multi-Scene Storyboard Sequence (Gemini 3.8 Flash)
app.post('/api/prompt/storyboard', async (req, res) => {
  const { concept, scenesCount = 3 } = req.body;

  if (!concept) {
    return res.status(400).json({ error: 'Concept is required.' });
  }

  try {
    const ai = getGenAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are a film director planning a ${scenesCount}-scene continuous micro-film storyboard.
Concept: "${concept}"

Break this down into ${scenesCount} consecutive cinematic scenes that maintain visual continuity.
For each scene, provide:
- sceneNumber (1, 2, 3...)
- title (short title)
- prompt (complete video model prompt for this specific 5-second clip)
- cameraMotion (e.g. Drone establishing pull-in, Medium dolly track, Close-up orbital pan)
- transitionToNext (e.g. Match cut on motion, seamless camera pan, whip pan)

Format output strictly as JSON:
{
  "title": "Title of the Storyboard",
  "synopsis": "One sentence summary",
  "scenes": [
    {
      "sceneNumber": 1,
      "title": "Establishing",
      "prompt": "...",
      "cameraMotion": "...",
      "transitionToNext": "..."
    }
  ]
}`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      storyboard: parsed,
    });
  } catch (err: any) {
    console.warn('Error calling Gemini for storyboard, falling back to director template:', err);
    return res.json({
      success: true,
      storyboard: {
        title: `Visual Journey: ${concept.slice(0, 30)}`,
        synopsis: `A 3-act visual narrative exploring ${concept}.`,
        scenes: [
          {
            sceneNumber: 1,
            title: 'Establishing The World',
            prompt: `Cinematic wide establishing shot: ${concept.trim()}. The environment awakens with soft ambient dawn lighting and subtle atmospheric mist.`,
            cameraMotion: 'Drone Aerial Rise',
            transitionToNext: 'Match cut on motion toward focal subject',
          },
          {
            sceneNumber: 2,
            title: 'Focal Action & Momentum',
            prompt: `Dynamic medium tracking shot: ${concept.trim()} in motion, intricate textures, reflections, and kinetic energy filling the frame.`,
            cameraMotion: 'Cinematic Dolly In with rack focus',
            transitionToNext: 'Whip pan to close revelation',
          },
          {
            sceneNumber: 3,
            title: 'Climax & Horizon',
            prompt: `Dramatic heroic wide perspective: ${concept.trim()} reaching its crescendo under radiant volumetric sunbeams and glowing particle effects.`,
            cameraMotion: 'Orbital 360 Spin pulling back',
            transitionToNext: 'Fade to cinematic warm glow',
          },
        ],
      },
    });
  }
});

// 6. Download Full Project ZIP for local VS Code setup
app.get('/api/download-project', (_req, res) => {
  const zipPath = path.resolve(__dirname, 'cinecraft-ai-video-studio.zip');
  res.download(zipPath, 'cinecraft-ai-video-studio.zip', (err) => {
    if (err) {
      console.error('Error sending project zip:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Project zip file not found or could not be served.' });
      }
    }
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[CineCraft Server] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[CineCraft Server] Failed to start:', err);
  process.exit(1);
});
