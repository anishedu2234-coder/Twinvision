👁️ Vision Assist AI

<p align="center">
  <img src="https://img.shields.io/badge/Accessibility-First-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/AI-Gemini-powered-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p><p align="center">
  <b>Making the world more accessible using AI 🌍</b>
</p>
---

🌐 Live Demo

🔗 https://twinvision23-ga34.vercel.app/


---

🎥 Demo Preview

<p align="center">
  <img src="/demo.gif" alt="Vision Assist AI Demo" width="600" />
</p>> 📌 Replace demo.gif with your actual recorded demo (recommended: 20–30 sec showing both features)




---

🚀 Overview

Vision Assist AI is an AI-powered accessibility web application that helps visually impaired users understand their surroundings and read documents using real-time audio feedback.

By combining camera input with generative AI, the app translates the visual world into meaningful spoken descriptions.


---

✨ Key Features

🔍 Scene Understanding

Real-time camera capture

AI-generated contextual descriptions

Helps users understand surroundings instantly


📄 Document Reader

Scan printed text using camera

Converts text into speech output


🌐 Bilingual Support

English (en-US)

Hindi (hi-IN)

Instant switching


🧠 Smart History

Stores last 50 scans

Includes timestamp and mode

Persistent via localStorage


📳 Tactile Feedback

Device vibration for interaction cues

Improves usability for blind users


♿ Accessibility First

High-contrast UI

Voice feedback for interactions

Designed for assistive usage



---

🧱 Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,ts,tailwind,nodejs,vite" />
</p>Layer	Technology

Frontend	React 19 + TypeScript
Styling	Tailwind CSS
Build Tool	Vite
AI	Gemini API (@google/genai)
Storage	LocalStorage
Runtime	Node.js



---

⚙️ Architecture & Workflow

flowchart TD
A[User Opens App] --> B[Camera Activated]
B --> C[Capture Frame]
C --> D[Send to Gemini API]
D --> E[AI Generates Description]
E --> F[Display Output]
F --> G[Text-to-Speech]
E --> H[Save to History]
H --> I[LocalStorage]


---

⚙️ How It Works

1️⃣ Initialization

Validates Gemini API key

Loads saved preferences

Restores scan history


2️⃣ Scan Process

1. User opens Scan tab


2. Camera captures frame


3. Image sent to AI


4. AI returns description


5. App reads output aloud



3️⃣ Persistence

Results stored in state

Synced to localStorage automatically


4️⃣ Review

History tab shows past scans

Option to clear history



---

🧪 Getting Started

📦 Installation

git clone https://github.com/your-username/vision-assist-ai.git
cd vision-assist-ai
npm install

▶️ Run Locally

npm run dev

🏗️ Build

npm run build


---

🔐 Environment Variables

Create .env file:

VITE_GEMINI_API_KEY=your_api_key_here


---

📸 Screenshots

<p align="center">
  <img src="/screenshots/scene.png" width="250" />
  <img src="/screenshots/document.png" width="250" />
  <img src="/screenshots/ui.png" width="250" />
</p>> 📌 Add real screenshots in /screenshots folder




---

🎯 Future Roadmap

🚧 Real-time object detection alerts

⚡ Faster AI response time

🌍 More language support

📡 Offline mode (edge AI)



---

🤝 Contributing

Contributions are welcome!

fork → clone → commit → push → PR 🚀


---

📄 License

MIT License © 2026


---

🙌 Acknowledgements

Google Gemini API

Open-source community



---

👨‍💻 Author

Built with purpose to empower accessibility using AI 💙


---

<p align="center">
  ⭐ Star this repo if you found it useful!
</p>