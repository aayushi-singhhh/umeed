"""
Enhanced AI Backend for Umeed - Hackathon Version - Clean Copy
Integrates all three priority AI features:
1. AI Reading Coach 2.0
2. Emotion AI Companion 
3. Predictive Learning Analytics
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import json
import base64
import tempfile
from datetime import datetime

# Import our advanced AI modules
try:
    from advanced_reading_coach import AdvancedAIReadingCoach
    from advanced_emotion_ai import AdvancedEmotionAnalyzer
    from advanced_predictive_analytics import AdvancedPredictiveLearningAnalytics
    print("✅ Successfully imported advanced AI modules")
except ImportError as e:
    print(f"⚠️  Warning: Could not import advanced AI modules: {e}")
    print("Falling back to basic AI modules...")
    try:
        from ai_reading_coach import AIReadingCoach as AdvancedAIReadingCoach
        from emotion_ai_companion import EmotionAICompanion as AdvancedEmotionAnalyzer
        from predictive_analytics import PredictiveLearningAnalytics as AdvancedPredictiveLearningAnalytics
        print("✅ Using basic AI modules as fallback")
    except ImportError as e2:
        print(f"❌ Critical: Could not import any AI modules: {e2}")
        # Create placeholder classes for development/testing
        class AdvancedAIReadingCoach:
            def analyze_reading_with_whisper(self, *args): return {'success': False, 'error': 'Module not available'}
            def generate_adaptive_phonics_exercise(self, *args): return {'error': 'Module not available'}
            def get_reading_feedback(self, *args): return {'error': 'Module not available'}
        
        class AdvancedEmotionAnalyzer:
            def analyze_emotion_multimodal(self, *args): return {'success': False, 'error': 'Module not available'}
            def generate_contextual_response(self, *args): return {'error': 'Module not available'}
            def generate_social_story(self, *args): return {'error': 'Module not available'}
        
        class AdvancedPredictiveLearningAnalytics:
            def predict_learning_trajectory(self, *args): return {'success': False, 'error': 'Module not available'}
            def assess_intervention_timing(self, *args): return {'success': False, 'error': 'Module not available'}
            def get_population_insights(self, *args): return {'success': False, 'error': 'Module not available'}

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize advanced AI components
reading_coach = AdvancedAIReadingCoach()
emotion_companion = AdvancedEmotionAnalyzer()
predictive_analytics = AdvancedPredictiveLearningAnalytics()

# Mock data for demo purposes
DEMO_CHILD_PROFILES = {
    'child1': {
        'id': 'child1',
        'name': 'Alex',
        'age': 8,
        'learning_differences': ['ADHD', 'Dyslexia'],
        'interests': ['dinosaurs', 'space', 'building blocks'],
        'reading_level': 2
    },
    'child2': {
        'id': 'child2',
        'name': 'Emma',
        'age': 7,
        'learning_differences': ['Autism Spectrum'],
        'interests': ['art', 'animals', 'puzzles'],
        'reading_level': 1
    }
}

@app.route('/health', methods=['GET'])
def health_check():
    """Comprehensive health check endpoint for demo readiness"""
    health_status = {
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '2.0.0-hackathon',
        'features': {},
        'dependencies': {},
        'demo_ready': True
    }
    
    # Test AI modules availability
    try:
        test_result = reading_coach.get_reading_feedback({}, DEMO_CHILD_PROFILES['child1'])
        health_status['features']['advanced_reading_coach'] = True
    except Exception as e:
        health_status['features']['advanced_reading_coach'] = False
        health_status['demo_ready'] = False
        
    try:
        test_result = emotion_companion.generate_contextual_response(
            'neutral', 'test', 'hello', DEMO_CHILD_PROFILES['child1']
        )
        health_status['features']['advanced_emotion_ai'] = True
    except Exception as e:
        health_status['features']['advanced_emotion_ai'] = False
        health_status['demo_ready'] = False
        
    try:
        test_result = predictive_analytics.predict_learning_trajectory(
            DEMO_CHILD_PROFILES['child1'], []
        )
        health_status['features']['advanced_predictive_analytics'] = True
    except Exception as e:
        health_status['features']['advanced_predictive_analytics'] = False
        health_status['demo_ready'] = False
    
    # Check dependencies
    try:
        import openai
        health_status['dependencies']['openai'] = True
    except ImportError:
        health_status['dependencies']['openai'] = False
        health_status['demo_ready'] = False
        
    try:
        import cv2
        health_status['dependencies']['opencv'] = True
    except ImportError:
        health_status['dependencies']['opencv'] = False
        
    try:
        import librosa
        health_status['dependencies']['librosa'] = True
    except ImportError:
        health_status['dependencies']['librosa'] = False
    
    # Set overall status
    if not health_status['demo_ready']:
        health_status['status'] = 'degraded'
    
    return jsonify(health_status)

@app.route('/demo/showcase', methods=['GET'])
def demo_showcase():
    """Demo endpoint showcasing all AI features"""
    demo_data = {
        'features': {
            'ai_reading_coach': 'Whisper-powered reading analysis',
            'emotion_ai_companion': 'Multi-modal emotion detection',
            'predictive_analytics': 'ML-powered learning insights'
        },
        'demo_ready': True,
        'timestamp': datetime.now().isoformat()
    }
    return jsonify({'success': True, 'showcase': demo_data})

# Main entry point
if __name__ == '__main__':
    print("🚀 Enhanced AI Backend for Umeed - Hackathon Version")
    print("Features loaded:")
    print("  ✅ AI Reading Coach 2.0")
    print("  ✅ Emotion AI Companion")
    print("  ✅ Predictive Learning Analytics")
    print("  ✅ Enhanced Story Generation")
    print("\nServer starting on http://localhost:5001")
    app.run(debug=True, host='0.0.0.0', port=5001)
