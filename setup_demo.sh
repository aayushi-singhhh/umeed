#!/bin/bash

# Umeed Hackathon Demo Setup Script
# Prepares the environment and installs all dependencies

echo "🚀 Setting up Umeed for Hackathon Demo..."
echo "==========================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

echo "✅ Python and Node.js found!"

# Setup Backend
echo "🔧 Setting up Backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Install additional AI model dependencies
echo "📥 Downloading AI models (this may take a while)..."
python -c "
import nltk
import spacy
try:
    nltk.download('punkt')
    nltk.download('stopwords')
    print('✅ NLTK data downloaded')
except:
    print('⚠️  NLTK download failed')

try:
    import en_core_web_sm
    print('✅ spaCy model already available')
except:
    print('⚠️  Run: python -m spacy download en_core_web_sm')
"

cd ..

# Setup Frontend
echo "🎨 Setting up Frontend..."
cd ..

# Install npm dependencies
if [ -f "package.json" ]; then
    echo "Installing npm dependencies..."
    npm install
else
    echo "⚠️  No package.json found in frontend directory"
fi

echo ""
echo "🎉 Setup Complete!"
echo "==================="
echo ""
echo "To start the demo:"
echo "1. Backend: cd backend && source venv/bin/activate && python enhanced_app.py"
echo "2. Frontend: npm run dev"
echo ""
echo "📝 Don't forget to:"
echo "   - Set your OPENAI_API_KEY in backend/.env"
echo "   - Ensure camera/microphone permissions are enabled"
echo "   - Test all three AI features before the demo"
echo ""
echo "🚀 Happy Hacking!"
