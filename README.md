# 👑 goktype

> An exact, minimalist clone of **Monkeytype** featuring personal branding on **gok**, tactile mechanical typing sound effects, and an interactive **EdClub**-style finger position previewer.

Built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**. 100% client-side with **LocalStorage persistence** — no backend required.

🌐 Live App: **[https://typing.gokgok.in](https://typing.gokgok.in)**  
👤 Author: [sanjai8173](https://github.com/sanjai8173)  
📦 Repository: [goktype](https://github.com/sanjai8173/goktype)  
🗺️ Sitemap: [https://typing.gokgok.in/sitemap.xml](https://typing.gokgok.in/sitemap.xml)  
🤖 Robots.txt: [https://typing.gokgok.in/robots.txt](https://typing.gokgok.in/robots.txt)

---

## ⚡ Features

### 1. 🎯 Authentic Monkeytype Experience
- **Modes**:
  - `time`: 15s, 30s, 60s, 120s
  - `words`: 10, 25, 50, 100 words
  - `quote`: short, medium, long quotes
  - `zen`: free-flow typing practice
  - `punctuation` (`@`) and `numbers` (`#`) toggles
- **Smooth Caret**: Animated caret with line, block, underline, or box styles.
- **Real-time Performance Metrics**:
  - Live Words Per Minute (WPM)
  - Raw WPM
  - Accuracy (%)
  - Consistency (%)
  - Character breakdown: `correct` / `incorrect` / `extra` / `missed`
- **Result Screen**:
  - Big stats cards (WPM, Accuracy, Raw, Consistency)
  - Second-by-second SVG graph showing WPM trajectory & error marks
  - Confetti celebration upon beating a Personal Best (PB)!
  - Quick action buttons: Next Test (`Tab`), Repeat Test, and Copy results

### 2. 🖐️ EdClub / TypingClub Finger Position Previewer
- **Interactive QWERTY Keyboard**: Color-coded keys showing touch-typing finger zones.
- **Interactive Hands (Left & Right)**:
  - Highlights the exact finger assigned to hit the next target key (e.g. Left Index for `F`, Right Pinky for `P`, etc.)
  - Real-time animated tap gesture on keystrokes
  - Color-coded finger zones:
    - 🔴 **Left Pinky**: `~, 1, Q, A, Z, Tab, Caps, Shift`
    - 🟠 **Left Ring**: `2, W, S, X`
    - 🟡 **Left Middle**: `3, E, D, C`
    - 🟢 **Left Index**: `4, 5, R, T, F, G, V, B`
    - 🔵 **Thumbs**: `Spacebar`
    - 🟢 **Right Index**: `6, 7, Y, U, H, J, N, M`
    - 🟣 **Right Middle**: `8, I, K, ,`
    - 🟣 **Right Ring**: `9, O, L, .`
    - 🌸 **Right Pinky**: `0, -, =, P, [, ], ;, ', /, Enter, Backspace`
  - Toggle hands and keyboard guides on/off with one click or in Settings.

### 3. 🔊 Procedural Typing Sound Effects (Web Audio API)
Zero external audio file latency and 100% offline reliability. Uses synthesis with organic pitch jitter:
- **Holy Panda (Deep Thock)**
- **Cherry MX Blue (Crisp Click)**
- **Cherry MX Brown (Tactile Snap)**
- **Vintage Typewriter (Metallic strike)**
- **Bubble Pop (Playful pop)**
- **8-Bit Retro Synth**
- Dedicated spacebar acoustic bottom-out sound and error feedback tone.
- Volume control and mute toggle.

### 4. 🎨 10 Iconic Themes (Dynamic CSS Variables)
- **Gok Gold (Signature)**: Luxury gold & dark slate
- **Serika Dark**: Iconic charcoal and amber
- **Matrix**: Hacker green & deep black
- **Dracula**: Neon purple, pink, and slate
- **Nord**: Arctic frost blue
- **Carbon**: Industrial charcoal & orange
- **Cyberpunk**: High-contrast cyan & neon yellow
- **Chalk**: Chalkboard white and warm yellow
- **8008**: Hot pink & dark navy
- **Botanical**: Forest and mint green

### 5. 💾 100% LocalStorage Persistence
- Complete test history tracking
- Personal Bests (PBs) recorded per mode and duration
- Analytics modal with all-time highest WPM, average accuracy, total typing time, and JSON export

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v22)
- npm or yarn

### Installation
```bash
git clone https://github.com/sanjai8173/goktype.git
cd goktype
npm install
```

### Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

---

## ⌨️ Shortcuts

| Key | Action |
| --- | --- |
| `Tab` | Quick restart test |
| `Enter` (on result screen) | Next test |
| `Esc` | Reset test / finish Zen mode |

---

## 👤 Author

Crafted by **[sanjai8173](https://github.com/sanjai8173)**  
Personal branding: **gok** / **goktype**
