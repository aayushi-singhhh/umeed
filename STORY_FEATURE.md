# 📚 Adaptive Storytelling Feature for Umeed

A full-stack feature that creates personalized, interactive stories for neurodivergent children using AI.

## 🌟 Features

- **AI-Generated Stories**: Uses OpenAI GPT-4 to create simple, positive stories (500-700 words)
- **Custom Illustrations**: DALL-E generates kid-friendly illustrations for each page
- **Audio Narration**: Text-to-speech narration for accessibility
- **Interactive Storybook**: Beautiful, child-friendly interface with page navigation
- **Personalization**: Stories tailored to user-provided themes and characters

## 🏗️ Architecture

### Backend (Flask)
- **Framework**: Flask with CORS support
- **AI Integration**: 
  - OpenAI GPT-4 for story generation
  - DALL-E 3 for illustration creation
  - Google Text-to-Speech (gTTS) for narration
- **API Endpoint**: `POST /generate_story`
- **Response**: JSON with story text, paragraphs, image URLs, and base64 audio

### Frontend (React)
- **Component**: `StoryCreator.tsx`
- **Features**: Theme/character input, storybook display, audio playback
- **Design**: Kid-friendly UI with rounded corners, pastel colors, large fonts
- **Integration**: Accessible from Child Dashboard

## 🚀 Setup Instructions

### 1. Backend Setup

```bash
cd backend
./setup.sh
```

This will:
- Create a Python virtual environment
- Install required packages
- Create an `.env` file template

### 2. Configure API Keys

Edit `backend/.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Get your API key from: https://platform.openai.com/api-keys

### 3. Start the Backend

```bash
cd backend
source venv/bin/activate
python app.py
```

The API will be available at `http://localhost:5000`

### 4. Start the Frontend

```bash
cd ..  # Back to root directory
npm run dev
```

## 🎯 Usage Flow

1. **Child Dashboard**: Click "Create My Story!" button
2. **Story Input**: Enter theme (e.g., "friendship") and characters (e.g., "Emma the elephant, Sam the squirrel")
3. **AI Generation**: 
   - GPT-4 creates the story
   - DALL-E generates illustrations
   - gTTS creates narration audio
4. **Story Display**: Interactive storybook with:
   - Page-by-page navigation
   - Illustrations for each page
   - Play/pause audio narration
   - Kid-friendly controls

## 🔧 API Reference

### Generate Story

**Endpoint**: `POST /generate_story`

**Request Body**:
```json
{
  "theme": "friendship and adventure",
  "characters": "Emma the elephant, Sam the squirrel"
}
```

**Response**:
```json
{
  "success": true,
  "story": {
    "full_text": "Complete story text...",
    "theme": "friendship and adventure",
    "characters": ["Emma the elephant", "Sam the squirrel"],
    "paragraphs": ["Page 1 text...", "Page 2 text..."],
    "illustrations": ["https://image1.url", "https://image2.url"],
    "audio_base64": "base64_encoded_audio_data",
    "page_count": 5
  }
}
```

## 🎨 Design Principles

### For Neurodivergent Children
- **Simple Language**: Age-appropriate vocabulary and sentence structure
- **Positive Messages**: Focus on friendship, problem-solving, and acceptance
- **Calming Visuals**: Soft colors, non-overwhelming illustrations
- **Accessibility**: Audio narration and large, clear text
- **Predictable Structure**: Clear beginning, middle, and end

### UI/UX Features
- **Kid-Friendly Design**: Rounded corners, bright colors, large buttons
- **Visual Feedback**: Loading animations and progress indicators
- **Error Handling**: Gentle error messages and retry options
- **Responsive Design**: Works on tablets and desktops

## 🔍 Troubleshooting

### Backend Issues
- **OpenAI API Errors**: Check your API key and billing account
- **CORS Issues**: Ensure Flask-CORS is properly configured
- **Audio Generation**: gTTS requires internet connection

### Frontend Issues
- **API Connection**: Verify backend is running on port 5000
- **Audio Playback**: Check browser audio permissions
- **Image Loading**: DALL-E images are hosted by OpenAI

## 🚀 Future Enhancements

- **Voice Input**: Allow children to speak their story ideas
- **Story Sharing**: Save and share stories with family
- **Character Customization**: Upload custom character images
- **Multi-language Support**: Stories in different languages
- **Adaptive Difficulty**: Adjust vocabulary based on reading level
- **Interactive Elements**: Clickable story elements for engagement

## 📁 File Structure

```
backend/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── setup.sh           # Setup script
├── .env.template      # Environment variables template
└── README.md          # This file

src/components/
├── StoryCreator.tsx   # Main story creation component
└── ChildDashboard.tsx # Updated with story creator access
```

## 🔒 Security Notes

- API keys are stored in environment variables
- CORS is configured for development (adjust for production)
- Audio data is base64 encoded for secure transmission
- No user data is stored permanently

---

**Made with ❤️ for neurodivergent children and their families**
