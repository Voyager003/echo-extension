# Echo - AI-Powered Learning Feedback Extension

A Chrome extension that analyzes web page content and provides AI-powered learning feedback.

## Features

- Automatic text extraction from web pages
- Content analysis using Gemini AI
- Recall comparison and personalized feedback
- Deep dive Q&A for enhanced learning
- Learning history with detailed records

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Build

```bash
npm run build
```

### 3. Load Extension in Chrome

1. Open `chrome://extensions` in Chrome
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the `dist` folder

## API Key Setup

1. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Right-click the extension icon → Options
3. Enter your API key and save

## Usage

1. Navigate to a web page you want to learn from
2. Click the extension icon to open the side panel
3. Click "Start Learning" button
4. Read the content, then write what you remember
5. Review AI-generated feedback and track your progress

## Development

Run in development mode (auto-rebuild on file changes):

```bash
npm run dev
```

## Tech Stack

- TypeScript
- React
- Tailwind CSS
- Webpack
- Gemini API (gemini-2.0-flash-lite)
