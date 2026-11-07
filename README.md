# 🎬 Consistent Character Studio (VideoExpress AI Copilot)

An interactive, production-grade web application and companion copilot designed specifically for producing photorealistic, ~30-second videos with consistent characters in **[VideoExpress](https://app.videoexpress.ai/)**.

Built to operationalize 100% of the official **[Consistent Character Producer Playbook](https://github.com/ai-playbooks/realistic-consistent-character-videos)** rules and formulas.

---

## 🌟 Key Features

### 1. ✂️ Head-and-Shoulders Face Cropper (Solves the #1 Likeness Problem)
- **Playbook Section 3:** Likeness fails if faces are small or far away in full-body shots.
- Built-in interactive canvas face cropper with zoom, pan, and oval face guides to ensure reference photos have a tight, sharp chest-up crop (filling 50–70% of frame) before uploading to VideoExpress.

### 2. 📝 Character Bible & Word Budget Engine
- **Playbook Section 2a:** Automatically writes the dense **90–140 word** physical description (face shape, cheek fullness, jaw, chin, eyes, brows, nose, lips, resting expression, skin tone, pores/texture, facial hair, ears, hair style, build, and fixed wardrobe).
- Live word counter and Playbook compliance indicator.
- Generates the exact **Short Tag** (8–12 words visible traits, no pronouns/names).
- Generates the fixed **Voice Lock** (verbatim audio delivery tag).

### 3. 🖼️ Anchor Portrait Generator (+ Consistent Character Helper)
- Generates the clean studio chest-up anchor prompt according to Playbook Section 5.
- Embedded step-by-step instructions for VideoExpress reference photo assignment (`Slot 1 = Character 1 Anchor`, `Slot 2 = Character 2 Anchor`).

### 4. 📐 Clip Math & Storyboard Planner
- Automatically calculates clip counts and duration:
  - **30s Multi-shot:** 4 clips × 8s (2–3 shots each, ~10 shots total).
  - **20s Multi-shot:** 3 clips × 8s.
  - **45s Multi-shot:** 6 clips × 8s.
  - **Single-shot:** 5s clips (1 continuous take).
- Maps the narrative arc: **C01 Hook** → **Middle Escalation** → **~70% Twist** → **Last Payoff**.

### 5. 🔍 Real-Time Playbook Linter / Prompt Inspector
Evaluates every prompt against Playbook Section 7 rules in real time:
- Starts with `C## —`
- Single flowing paragraph (no bullets or linebreaks)
- Word count within 130–200 words
- Quoted dialogue ≤ 8 words per shot
- Listener explicitly assigned "lips closed, does not speak"
- Phrased with explicit transitions: `"A hard cut transitions to..."`
- Mandatory ending tag: `"no music"` and `"no on-screen text"`
- Realism tag prepended to all start images

### 6. 🌊 VideoExpress Wave Manager (5-Parallel Limit)
- Playbook Section 8: VideoExpress allows a maximum of 5 parallel render jobs per account.
- Interactive slot tracker monitors active rendering jobs, shows progress, and warns before hitting the 5-video limit.

### 7. ⏱️ Dead-Air Trimming Assistant & Timeline Visualizer
- Calibrated to VideoExpress editor timeline at **Zoom in ×3 (40 px = 1 second)**:
  - **8s Clip:** Trim left edge rightward by **12 px (-0.3 s)** and right edge leftward by **20 px (-0.5 s)**.
  - **5s Clip:** Trim left edge by **12 px (-0.3 s)** and right edge by **16 px (-0.4 s)**.
- Reminders for **Auto Align Clips (`+|+`)** and avoiding the whole-track delete icon.

### 8. 🔖 In-Browser Bookmarklet Copilot
- Drag-and-drop bookmarklet that opens a floating, collapsible copilot sidebar directly on `app.videoexpress.ai`, providing one-click copy buttons for every clip prompt side-by-side with VideoExpress!

### 9. 📄 Export Full Production Script
- One-click copy or download of the complete script in Markdown (`.md`) or project state in JSON (`.json`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### Installation & Local Run

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev
```

Open `http://localhost:3000` (or the port indicated in your terminal) in your browser.

### Production Build

```bash
# Build production bundle
npm run build

# Preview build locally
npm run preview
```

---

## 🛠️ Tech Stack
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Custom Dark Theme
- **Icons:** Lucide React
- **Canvas:** Native HTML5 Canvas for head-and-shoulders face cropping and export

---

## 📖 Playbook Reference
This application is strictly built to follow the rules outlined in:
- [Consistent Character Producer: Full Playbook (v1.0.0)](https://github.com/ai-playbooks/realistic-consistent-character-videos)
