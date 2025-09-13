# Umeed - AI-Powered Learning Platform for Children with Learning Disabilities

## 🚀 Hackathon Demo - Advanced AI Features

Umeed is an inclusive learning platform designed specifically for children with learning disabilities such as ADHD, Dyslexia, and Autism Spectrum Disorder. This hackathon version features three cutting-edge AI capabilities.

## ✨ Advanced AI Features

### 1. AI Reading Coach 2.0 (Whisper Integration)
- **Real-time speech recognition** using OpenAI Whisper
- **Phonics pattern analysis** and error detection
- **Adaptive difficulty adjustment** based on child's progress
- **Personalized reading recommendations** and exercises

### 2. Emotion AI Companion
- **Multi-modal emotion detection** (DeepFace + OpenCV + MediaPipe)
- **Context-aware AI companion** responses
- **Real-time emotional support** during learning sessions
- **Personalized social story generation** for autism spectrum children

### 3. Predictive Learning Analytics
- **Learning trajectory prediction** (3-6 months ahead)
- **Optimal intervention timing** assessment
- **Population-level insights** for schools and districts
- **Risk factor identification** and mitigation strategies

## 🛠️ Technology Stack

### Backend
- **Python 3.8+** with Flask
- **OpenAI API** (Whisper, GPT models)
- **Computer Vision** (OpenCV, DeepFace, MediaPipe)
- **Machine Learning** (scikit-learn, TensorFlow)
- **Audio Processing** (librosa, soundfile)

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Real-time webcam/microphone** integration

## 🚦 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- OpenAI API Key
- Webcam and microphone

### Setup
```bash
# Clone and navigate
cd /path/to/umeed

# Run automated setup
chmod +x setup_demo.sh
./setup_demo.sh

# Manual setup if needed:
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Frontend
cd ..
npm install
```

### Configuration
```bash
# Backend configuration
cd backend
cp env_template.txt .env
# Edit .env and add your OPENAI_API_KEY
```

### Run the Demo
```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate
python app_minimal.py

# Terminal 2: Frontend
npm run dev
```

Visit `http://localhost:5173` for the demo!

## 🎯 Demo Scenarios

### Reading Coach Demo
1. Navigate to "AI Reading Coach 2.0"
2. Click "Start Reading Session"
3. Read the provided text aloud
4. See real-time feedback and phonics analysis

### Emotion AI Demo
1. Go to "Emotion AI Companion"
2. Enable camera access
3. Show different emotions (happy, frustrated, confused)
4. Interact with the AI companion
5. Generate personalized social stories

### Predictive Analytics Demo
1. Access "Predictive Analytics Dashboard"
2. View learning trajectory predictions
3. Explore intervention timing recommendations
4. Check population-level insights

## 📊 API Endpoints

### Reading Coach
- `POST /analyze_reading` - Whisper-based reading analysis
- `POST /generate_phonics_exercise` - Adaptive phonics exercises
- `POST /advanced_reading_feedback` - Comprehensive feedback

### Emotion AI
- `POST /analyze_emotion` - Multi-modal emotion detection
- `POST /contextual_ai_response` - Context-aware responses
- `POST /real_time_emotion_support` - Immediate emotional support
- `POST /generate_social_story` - Personalized social stories

### Predictive Analytics
- `POST /predict_trajectory` - Learning trajectory prediction
- `POST /assess_intervention_timing` - Intervention recommendations
- `POST /population_insights` - School/district analytics

### System
- `GET /health` - Comprehensive health check
- `GET /demo/showcase` - Feature demonstration

## 🎨 UI Components

### New React Components
- `AIReadingCoach.tsx` - Enhanced reading interface
- `EmotionAICompanion.tsx` - Emotion detection and chat
- `PredictiveAnalyticsDashboard.tsx` - Analytics visualization

### Enhanced Features
- Real-time webcam integration
- Audio recording and analysis
- Interactive dashboards
- Responsive design for all devices

## 🧠 AI/ML Architecture

### Reading Analysis Pipeline
1. **Audio Capture** → Base64 encoding
2. **Whisper Processing** → Speech-to-text
3. **Text Comparison** → Error pattern detection
4. **Phonics Analysis** → Learning gap identification
5. **Adaptive Feedback** → Personalized recommendations

### Emotion Recognition Pipeline
1. **Video Stream** → Frame extraction
2. **Multi-model Analysis** → DeepFace + OpenCV
3. **Context Integration** → Activity awareness
4. **Response Generation** → GPT-based companion
5. **Real-time Support** → Immediate intervention

### Predictive Analytics Pipeline
1. **Data Collection** → Learning interactions
2. **Feature Engineering** → Progress indicators
3. **ML Model Inference** → Trajectory prediction
4. **Risk Assessment** → Intervention timing
5. **Population Analysis** → Aggregate insights

## 📈 Demo Data

The system includes comprehensive demo data:
- Sample child profiles with different learning differences
- Mock learning sessions and progress data
- Synthetic emotion detection scenarios
- Pre-computed analytics insights

## 🔒 Privacy & Security

- **Local Processing** - Sensitive data processed locally when possible
- **Data Anonymization** - Personal information protected
- **Secure API Keys** - Environment variable configuration
- **CORS Protection** - Frontend-backend security
- **Demo Mode** - Safe testing environment

## 🚀 Deployment

### Development
```bash
# Backend
python app_minimal.py

# Frontend
npm run dev
```

### Production Ready
- Docker containerization
- Environment-specific configurations
- Scalable database integration
- Load balancing and monitoring

## 📝 Notes for Judges/Reviewers

### Key Innovation Points
1. **Multi-modal AI Integration** - Combining vision, audio, and text
2. **Real-time Processing** - Immediate feedback during learning
3. **Personalization Engine** - Adaptive to individual needs
4. **Predictive Capabilities** - Proactive intervention timing
5. **Inclusive Design** - Specifically built for learning disabilities

### Technical Achievements
- Seamless Whisper integration for speech analysis
- Advanced emotion detection using multiple AI models
- Custom ML pipeline for learning trajectory prediction
- Responsive real-time UI with modern React patterns
- Comprehensive error handling and fallback systems

### Demo Highlights
- **Live emotion detection** with immediate AI responses
- **Real-time reading analysis** with phonics feedback
- **Interactive predictive dashboards** with ML insights
- **Personalized social story generation** for autism support
- **Comprehensive health monitoring** for system reliability

## 🤝 Team & Contributions

This hackathon project demonstrates advanced AI/ML integration for educational technology, specifically targeting the underserved population of children with learning disabilities.

## 📞 Support

For demo questions or technical issues:
- Check `/health` endpoint for system status
- Review browser console for frontend issues
- Verify OpenAI API key configuration
- Ensure camera/microphone permissions

---

**Built with ❤️ for inclusive education and AI innovation**
