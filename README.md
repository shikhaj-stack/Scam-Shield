# 🛡️ ScamShield — Digital Safety Companion for Parents

> **A Digital Bodyguard for Parents**  
> *Detect scams. Understand the danger. Stay safe.*

ScamShield is a mobile-first Progressive Web Application (PWA) built to protect parents and elderly citizens from digital scams, phishing messages, malicious payment QR codes, and fake bank block notices.

---

## 🌟 Key Features

### 1. 🔍 Hybrid Scam Detection Engine
- Evaluates weighted evidence across **Urgency**, **Financial Pressure**, **Credential Requests (OTP/PIN/CVV/APK)**, and **Brand Impersonation**.
- **Contextual False-Positive Defense:** Common banking terms (like "KYC" or "OTP") do not trigger false alarms when accompanied by legitimate bank context and official branch guidance.
- Zero-crash fallback: Runs 100% offline out-of-the-box using the built-in rule engine.

### 2. 📱 Android Notification Protection Architecture
- Implements the contract for Android's `NotificationListenerService` (`NotificationInput` → `NotificationAdapter` → `ScamDetector` → `Parent Warning`).
- Includes an in-app **Live Notification Intercept Simulator** for hackathon judges to simulate incoming WhatsApp or SMS pushes and observe instant parental warnings.

### 3. 🚨 Automatic ThreatAlert Component
- Non-alarmist, high-visibility popup warning with clear risk drivers and direct advice:
  - ❌ *Don't click links*
  - ❌ *Don't share OTP or UPI PIN*
  - ✅ *Verify through official banking app*
  - **[View Analysis]** / **[Ask My Family]**

### 4. 🖼️ Screenshot OCR Scanner
- Upload WhatsApp, SMS, or banking screenshots.
- In-browser OCR via Tesseract.js extracts message text with manual editing fallback.

### 5. 🔗 URL & Domain Intelligence
- Checks domain structure, HTTPS status, suspicious TLDs (`.xyz`, `.top`, `.site`), raw IP addresses, and link shorteners.
- **Configurable Brand Registry:** Detects lookalike domains (e.g. `sbi-kyc-update.xyz` imitating `onlinesbi.sbi`).

### 6. 📷 QR Code Scam Scanner
- Upload or scan QR screenshots before opening them in UPI apps.
- Detects deceptive "scan to receive payment" UPI request-pay hooks and malicious URLs.

### 7. 🗣️ Parent-Friendly Vernacular & Voice
- **Full Bilingual Support:** Live 1-click toggle between **English** and **हिंदी (Hindi)**.
- **Voice Assistant:** Speech-to-text input + Text-to-Speech (TTS) audio explanation reading warnings aloud.

### 8. 👨‍👩‍👧 "Ask My Family" Escalation & Dual Dashboard
- 1-click generation of structured family alerts ready to share via WhatsApp or SMS.
- **Dual Perspective:** Switch between the simple **Parent View** and the detailed **Family Member / Child View**.

### 9. 🔒 Dedicated Privacy Center & Threat History
- Explains what ScamShield accesses and why.
- Local browser storage only; 1-click **Purge All / Clear History** button.

### 10. 🧪 20-Case Automated Test Runner
- Live in-app test runner evaluating 10 real scam attacks against 10 legitimate bank notifications to demonstrate 100% accuracy in false-positive avoidance.

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Local Development Server
```bash
npm run dev
```
Open **[http://127.0.0.1:5173/](http://127.0.0.1:5173/)** in your browser (or Chrome DevTools Mobile View).

### 3. Run Production Build Verification
```bash
npm run build
```

---

## ⚙️ Environment Variables (Optional)

ScamShield works **100% offline out-of-the-box** using local rules. If you wish to enable optional Gemini AI conversational summaries, create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
*(Alternatively, enter an API key directly in Settings → Optional AI Configuration).*

---

## 🎬 Live Hackathon Demo Walkthrough

1. **Open Home Screen** (`/`): Observe the active protection status, quick action tiles, and prototype activity counts.
2. **Go to Notification Guard** (`/notification`): Click **"Simulate SBI Scam Push"**. Notice the **ThreatAlert** warning popup appear instantly at the top.
3. **Click "View Analysis"**:
   - Inspect the normalized risk score (e.g., 84/100).
   - Review the explainable signals (*Urgent account threat*, *Unverified link*).
   - Click **"हिंदी"** to see instant translation.
   - Click **"Listen to Explanation"** to hear the audio readout.
4. **Click "👨‍👩‍👧 Ask My Family"**:
   - Select trusted contact (e.g. *Aarav Sharma — Son*).
   - Review the prepared alert and test simulated dispatch or WhatsApp forward.
5. **Inspect Threat History** (`/history`): Verify the scan is catalogued in local history.
6. **Open Settings → 20-Case Test Suite**: Run the automated test suite to show judges zero false positives on legitimate bank messages!

---

## 📁 Architecture Overview

```text
src/
├── android/
│   └── NotificationListenerStub.ts  # Android NotificationListenerService contracts & adapter
├── components/
│   ├── BottomNav.tsx                # Mobile navigation bar
│   ├── DemoExampleSelector.tsx      # 1-click test scenarios
│   ├── FamilyAlertModal.tsx         # Family escalation modal
│   ├── Header.tsx                   # Bilingual header & audio controls
│   ├── RiskBadge.tsx                # Visual risk level indicator
│   ├── RiskScore.tsx                # Evidence-based score gauge
│   ├── SafetyActionCard.tsx         # Clear "Safe Actions" & "What NOT to Do"
│   ├── SignalCard.tsx               # Explainable signal evidence cards
│   ├── ThreatAlert.tsx              # Calm, high-visibility warning banner
│   └── VoiceModal.tsx               # Speech recognition & TTS modal
├── data/
│   ├── brandRegistry.ts             # Configurable official brand domain registry
│   ├── demoExamples.ts              # Preloaded hackathon scenarios
│   └── detectionTestSuite.ts        # 20-case test suite (10 scams vs 10 legitimate)
├── engine/
│   ├── aiAnalyzer.ts                # AI integration with seamless local fallback
│   ├── ocrScanner.ts                # In-browser Tesseract.js OCR extractor
│   ├── riskEngine.ts                # Structured explainable rule engine & false-positive defense
│   └── urlScanner.ts                # Deep URL inspection & lookalike detector
├── i18n/
│   └── translations.ts              # English & Hindi dictionaries
├── pages/
│   ├── FamilyPage.tsx               # Dual-perspective family safety dashboard
│   ├── HomePage.tsx                 # Dashboard, quick tiles, golden rules
│   ├── LinkScannerPage.tsx          # URL intelligence scanner
│   ├── MessageScannerPage.tsx       # Message & SMS scanner with demo presets
│   ├── NotificationProtectionPage.tsx # Android push intercept & simulation
│   ├── PrivacyCenterPage.tsx        # Privacy principles & transparency breakdown
│   ├── QrScannerPage.tsx            # QR code scam & UPI trap detector
│   ├── ResultPage.tsx               # Complete safety assessment screen
│   ├── RoadmapPage.tsx              # Hackathon pitch & product evolution
│   ├── ScreenshotScannerPage.tsx    # Screenshot OCR & text editor
│   ├── SettingsPage.tsx             # Preferences, AI key, data reset
│   └── TestRunnerPage.tsx           # Automated test suite UI
├── types/
│   └── index.ts                     # TypeScript interfaces
├── App.tsx                          # App shell, routing, state persistence
└── main.tsx                         # React 19 entry point
```

---

## ⚖️ Security & Privacy Disclaimers

> **Disclaimer:** ScamShield provides risk indicators and safety guidance. It does not guarantee that a message is legitimate or fraudulent. Always verify through official channels.
