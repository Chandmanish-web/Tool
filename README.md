# CineCraft — AI Video Studio 🎬

Professional AI video creation and directing suite powered by **Google Gemini Omni Flash** (`gemini-omni-1.1-flash`) and **Gemini 3.8 Flash** (`gemini-3.8-flash`).

Built with **React 19**, **Vite**, **Tailwind CSS v4**, **Node.js / Express**, and the `@google/genai` TypeScript SDK.

---

## 🚀 Quick Start Guide (VS Code)

Follow these simple steps to run this project locally in **Visual Studio Code**:

### 1. Prerequisites
- **Node.js**: Version 18.0.0 or later (v20+ recommended). [Download Node.js](https://nodejs.org/)
- **Visual Studio Code**: [Download VS Code](https://code.visualstudio.com/)

### 2. Open Project in VS Code
1. Open Visual Studio Code.
2. Select **File > Open Folder...** (or press `Cmd+O` on macOS / `Ctrl+O` on Windows).
3. Select this project's root folder.

### 3. Install Dependencies
Open the integrated terminal in VS Code (`Ctrl+\`` or `Terminal > New Terminal`) and run:

```bash
npm install
```

### 4. Configure Environment Variables
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file in VS Code and set your **Gemini API Key**:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   PORT=3000
   ```
   > **Note:** Get an API key at [Google AI Studio](https://aistudio.google.com/app/apikey). Ensure your key has access to the Gemini Omni Flash / video models.

### 5. Launch the Development Server
In your VS Code terminal, run:

```bash
npm run dev
```

The application will start on:
👉 **http://localhost:3000**

Open this URL in your web browser.

---

## 📦 Project File Structure

```
├── .env.example              # Template environment variables
├── index.html                # Single-page application entry point
├── metadata.json             # AI Studio applet metadata & permissions
├── package.json              # Dependencies and scripts
├── server.ts                 # Full-stack Express server + Gemini proxy routes
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite & Tailwind CSS plugins
├── README.md                 # Handover & setup documentation
└── src/
    ├── main.tsx              # React DOM mounting
    ├── index.css             # Tailwind CSS imports & global styles
    ├── App.tsx               # Primary application state and view router
    ├── types/
    │   └── video.ts          # VideoClip, Storyboard & Preset types
    ├── data/
    │   ├── presets.ts        # Camera motions, lighting schemes & style engines
    │   └── showcase.ts       # Curated cinema sample reels
    └── components/
        ├── Navbar.tsx        # Studio header, tab switcher & status badge
        ├── PromptEditor.tsx  # Text & Image-to-Video director controls
        ├── VideoPlayer.tsx   # Custom cinema player with scrubber & actions
        ├── GenerationProgress.tsx # Real-time neural pipeline progress monitor
        ├── VideoEditorModal.tsx   # Multi-turn video extension & prompt remixing
        ├── StoryboardView.tsx     # 3-act film sequence script planner
        ├── ShowcaseGallery.tsx    # Playable showcase reels with 1-click remix
        └── HistoryDrawer.tsx      # Local archive with replay, search & export
```

---

## 🛠 Available Scripts

- **`npm run dev`**: Starts the full-stack Express server with Vite middleware at `http://localhost:3000`.
- **`npm run build`**: Compiles the frontend assets into the `dist/` directory.
- **`npm start`**: Runs the production server with `tsx server.ts`.
- **`npm run lint`**: Runs TypeScript type checking without emitting files.

---

## 💡 Key Features & Workflow

1. **Text-to-Video Synthesis (`gemini-omni-1.1-flash`)**:
   - Converts text prompts into smooth AI videos in `16:9` widescreen, `9:16` vertical (TikTok / Reels), or `1:1` square.
   - Choose between `5s` or `10s` clip durations and `720p` or `1080p` resolutions.

2. **Image-to-Video Frame Animation**:
   - Upload any starter image (PNG/JPEG) or choose from curated starters to animate static art into fluid cinematic video.

3. **Multi-Turn Video Continuations & Edits**:
   - **Extend Scene (+5s)**: Uses `previous_interaction_id` to extend your video smoothly forward in time.
   - **AI Prompt Remix / Edit**: Chat-based instructions to adjust lighting, weather, or style without re-rolling.

4. **Director Prompt Polish (`gemini-3.8-flash`)**:
   - Click **Magic Polish** to enrich raw prompts with 35mm anamorphic lenses, lighting plans, and camera trajectories.

5. **Multi-Shot Storyboard Planning**:
   - Plan a 3-scene micro-film narrative with camera transition directions and render shots individually.

6. **Local Archive & Playback**:
   - Saves all rendered clips to your browser's local library with MP4 download and frame-by-frame scrubbing.

---

## 💻 Recommended VS Code Extensions

For the best developer experience in VS Code, install:
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
