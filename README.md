# AyuDerma

AyuDerma is an AI/ML-assisted skin wellness platform that analyzes skin images and provides Ayurvedic wellness recommendations and dietary guidance.

> **Disclaimer**: AyuDerma is an educational and wellness assistance platform. Its predictions and recommendations are informational only and should not be treated as a medical diagnosis or substitute for consultation with a qualified dermatologist or healthcare professional.

---

## Key Features

- **Skin Image Analysis**: Fast photo capture via camera or direct image upload.
- **AI/ML-Based Skin Condition Prediction**: Analyzes skin parameters to identify probable skin conditions and dosha characteristics.
- **Ayurvedic Remedy Recommendations**: Provides natural, herbal routine steps (Cleanse, Tone, Treat, Moisturize, Nourish) tailored to skin needs.
- **Dietary & Lifestyle Guidance**: Holistic dietary tips and lifestyle prescriptions based on traditional Ayurvedic principles.
- **Scan History**: Interactive timeline of past skin scans with detailed factor breakdowns.
- **Progress Tracking**: Quantitative metrics and visual before-and-after progress comparison.
- **User Profile Management**: Custom routine configuration, sensitivity preferences, and saved remedies.
- **Responsive Web Interface**: Fully optimized experience across desktop, tablet, and mobile devices.
- **Gemini-Powered Content**: Dynamic recommendation and wellness content generation.

---

## How It Works

1. **Upload or Capture**: The user opens AyuDerma and captures a live facial photo or uploads a skin image.
2. **Analysis**: The application processes the image through skin parameter detection routines.
3. **Condition Identification**: The system identifies probable skin types, primary concerns, and severity levels.
4. **Wellness & Dietary Guidance**: AyuDerma generates personalized Ayurvedic herbal recommendations, routine steps, and dietary suggestions.
5. **History & Progress**: Results are automatically saved to the user's scan history and reflected in progress metrics.

---

## Tech Stack

- **Frontend Core**: React 19, TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4, Custom CSS Design Tokens
- **Animations**: Motion (Framer Motion v12)
- **Icons**: Lucide React
- **AI Integration**: Google Gen AI SDK (`@google/genai`) / Gemini API

---

## Project Structure

```
AyuDerma_Minor_Project/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AddRemedyModal.tsx
│   │   ├── EditProfileModal.tsx
│   │   ├── Navbar.tsx
│   │   ├── RecommendationsModal.tsx
│   │   └── ScanDetailModal.tsx
│   ├── context/
│   │   └── AppContext.tsx
│   ├── data/
│   │   └── initialData.ts
│   ├── pages/
│   │   ├── HistoryPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── ProgressPage.tsx
│   │   └── ScanSkinPage.tsx
│   ├── utils/
│   │   └── animations.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── types.ts
│   └── vite-env.d.ts
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Rudraksh-SD/AyuDerma_Minor_Project.git

# Navigate into the project directory
cd AyuDerma_Minor_Project

# Install project dependencies
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Copy example file
cp .env.example .env.local
```

Populate `.env.local` with your credentials:

```env
GEMINI_API_KEY=your_gemini_api_key_here
APP_URL=http://localhost:3000
```

> **Security Note**: Never commit `.env.local` or expose private API keys in source control. `.env.local` is listed in `.gitignore` by default.

### Running Locally

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

### Production Build

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Environment Variables

| Variable | Purpose | Required |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Gemini AI API key for dynamic recommendation generation | Optional |
| `APP_URL` | Application base URL for local development or production hosting | Required |

---

## Security

- Private API keys are kept strictly within local environment variables (`.env.local`).
- Repository configuration ensures `.env` and `.env.local` files are ignored by git (`.gitignore`).
- `.env.example` contains non-sensitive placeholders only.

---

## Future Improvements

- **Improved Model Validation**: Higher accuracy dataset validation for edge-case skin conditions.
- **Broader & Diverse Datasets**: Integration of multi-ethnic skin tone datasets.
- **Uncertainty & Edge-Case Handling**: Enhanced confidence bounds for ambiguous image quality.
- **Multilingual Support**: Support for regional Indian languages (Hindi, Sanskrit, Tamil, etc.).
- **Dermatologist Consultation**: Direct appointment booking and clinical referral integrations.
- **Mobile Optimization & Accessibility**: Advanced screen-reader support and native PWA capabilities.
