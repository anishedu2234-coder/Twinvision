👁️ Vision Assist AI

<p align="center">
  <img src="https://res.cloudinary.com/dcyyg32oj/image/upload/v1776922632/IMG_20260423_11010550_aujvtj.jpg" />
  <img src="https://res.cloudinary.com/dcyyg32oj/image/upload/v1776922632/IMG_20260423_09410145_ggpqv3.jpg" />
  <img src="https://res.cloudinary.com/dcyyg32oj/image/upload/v1776922632/IMG_20260423_11011935_prz2qr.jpg" />
  <img src="https://res.cloudinary.com/dcyyg32oj/image/upload/v1776922633/IMG_20260423_09410982_r3dhrb.jpg" />
</p><p align="center">
  <b>Making the world more accessible using AI 🌍</b>
</p>
---

🌐 Live Demo

🔗 https://twinvision23-ga34.vercel.app/


---

🎥 Demo Preview

<p align="center">
  <video src="https://res.cloudinary.com/dcyyg32oj/video/upload/v1776922653/VID_20260423_093932_2_ozwcws.mp4" alt="Vision Assist AI Demo" width="600" />
</p>



---

🚀 Overview

Vision Assist AI is an AI-powered accessibility web application that helps visually impaired users understand their surroundings and read documents using real-time audio feedback.

By combining camera input with generative AI, the app translates the visual world into meaningful spoken descriptions.


---

## ✨ Key Features

<div align="center">

<table>
<tr>
<td width="300" align="center">

<h3>🔍 Scene Understanding</h3>
<p>
Real-time camera analysis powered by AI to describe surroundings and activities instantly.
</p>

</td>
<td width="300" align="center">

<h3>📄 Document Reader</h3>
<p>
Scan and convert printed text into clear voice output for easy understanding.
</p>

</td>
</tr>

<tr>
<td width="300" align="center">

<h3>🌐 Bilingual Support</h3>
<p>
Supports both English and Hindi with seamless switching for wider accessibility.
</p>

</td>
<td width="300" align="center">

<h3>🧠 Smart History</h3>
<p>
Stores last 50 scans with timestamps for quick review anytime.
</p>

</td>
</tr>

<tr>
<td width="300" align="center">

<h3>📳 Tactile Feedback</h3>
<p>
Device vibration ensures intuitive interaction for visually impaired users.
</p>

</td>
<td width="300" align="center">

<h3>♿ Accessibility First</h3>
<p>
High-contrast UI, voice feedback, and assistive-first design approach.
</p>

</td>
</tr>

</table>

</div>

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

## ⚙️ Architecture & Workflow

<div align="center">

<table>
<tr>
<td width="250" align="center">

<h3>📱 User Interaction</h3>
<p>
User opens the app and navigates to the Scan feature to begin interaction.
</p>

</td>
<td width="250" align="center">

<h3>📷 Camera Capture</h3>
<p>
The application activates the device camera and captures a frame on user trigger.
</p>

</td>
<td width="250" align="center">

<h3>🧠 AI Processing</h3>
<p>
Captured image is sent to the Gemini API for context-aware scene or text analysis.
</p>

</td>
</tr>

<tr>
<td width="250" align="center">

<h3>📝 Response Generation</h3>
<p>
AI returns a descriptive output explaining the scene or extracted document text.
</p>

</td>
<td width="250" align="center">

<h3>🔊 Voice Output</h3>
<p>
The generated response is converted into speech for accessibility.
</p>

</td>
<td width="250" align="center">

<h3>💾 Data Storage</h3>
<p>
Scan results are saved in localStorage for future reference and history tracking.
</p>

</td>
</tr>
</table>

</div>

---

## 🔄 Workflow Summary

<div align="center">

<p>
📱 User → 📷 Capture → 🧠 AI Analysis → 📝 Description → 🔊 Audio Output → 💾 Save History
</p>

</div>


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

git clone https://github.com/anishedu2234-coder/Twinvision.git
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