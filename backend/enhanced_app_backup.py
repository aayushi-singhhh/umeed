"""
Enhanced AI Backend for Umeed - Hackathon Version
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
        # Test reading coach
        test_result = reading_coach.get_reading_feedback({}, DEMO_CHILD_PROFILES['child1'])
        health_status['features']['advanced_reading_coach'] = True
    except Exception as e:
        health_status['features']['advanced_reading_coach'] = False
        health_status['demo_ready'] = False
        
    try:
        # Test emotion AI
        test_result = emotion_companion.generate_contextual_response(
            'neutral', 'test', 'hello', DEMO_CHILD_PROFILES['child1']
        )
        health_status['features']['advanced_emotion_ai'] = True
    except Exception as e:
        health_status['features']['advanced_emotion_ai'] = False
        health_status['demo_ready'] = False
        
    try:
        # Test predictive analytics
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

# ============================================================================
# PRIORITY 1: AI Reading Coach 2.0 Endpoints
# ============================================================================

@app.route('/analyze_reading', methods=['POST'])
def analyze_reading():
    """
    Analyze child's reading audio with Whisper and provide detailed feedback
    """
    try:
        data = request.get_json()
        
        audio_base64 = data.get('audio_base64')
        expected_text = data.get('expected_text')
        child_id = data.get('child_id', 'child1')
        
        if not audio_base64 or not expected_text:
            return jsonify({
                'success': False,
                'error': 'Missing audio data or expected text'
            }), 400
        
        # Get child profile
        child_profile = DEMO_CHILD_PROFILES.get(child_id, DEMO_CHILD_PROFILES['child1'])
        
        # Analyze reading with Advanced AI Reading Coach using Whisper
        analysis_result = reading_coach.analyze_reading_with_whisper(
            audio_base64, expected_text, child_profile
        )
        
        return jsonify(analysis_result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Reading analysis failed: {str(e)}'
        }), 500

@app.route('/generate_phonics_exercise', methods=['POST'])
def generate_phonics_exercise():
    """
    Generate personalized phonics exercise based on reading analysis
    """
    try:
        data = request.get_json()
        
        error_patterns = data.get('error_patterns', ['letter_reversal'])
        child_id = data.get('child_id', 'child1')
        difficulty = data.get('difficulty', 'beginner')
        
        # Get child profile
        child_profile = DEMO_CHILD_PROFILES.get(child_id, DEMO_CHILD_PROFILES['child1'])
        interests = child_profile['interests']
        
        # Generate adaptive exercise
        exercise = reading_coach.generate_adaptive_phonics_exercise(
            error_patterns, interests, difficulty
        )
        
        return jsonify({
            'success': True,
            'exercise': exercise
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Exercise generation failed: {str(e)}'
        }), 500

@app.route('/reading_progress_tracker', methods=['POST'])
def track_reading_progress():
    """
    Track reading progress and provide insights
    """
    try:
        data = request.get_json()
        
        child_id = data.get('child_id', 'child1')
        session_data = data.get('session_data', {})
        
        # Mock progress tracking for demo
        progress_data = {
            'session_id': f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'accuracy_improvement': '+5%',
            'fluency_score': session_data.get('fluency_score', 7.2),
            'words_per_minute': session_data.get('wpm', 45),
            'weekly_progress': {
                'sessions_completed': 12,
                'accuracy_trend': 'improving',
                'challenges_overcome': ['b/d confusion', 'sight words']
            },
            'next_goals': [
                'Increase reading speed to 50 WPM',
                'Master long vowel sounds',
                'Read 2-syllable words fluently'
            ]
        }
        
        return jsonify({
            'success': True,
            'progress': progress_data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Progress tracking failed: {str(e)}'
        }), 500

# ============================================================================
# PRIORITY 2: Emotion AI Companion Endpoints
# ============================================================================

@app.route('/analyze_emotion', methods=['POST'])
def analyze_emotion():
    """
    Analyze emotion from webcam image and provide AI companion response
    """
    try:
        data = request.get_json()
        
        image_base64 = data.get('image_base64')
        child_id = data.get('child_id', 'child1')
        activity_context = data.get('activity_context', 'learning')
        
        if not image_base64:
            return jsonify({
                'success': False,
                'error': 'Missing image data'
            }), 400
        
        # Get child profile
        child_profile = DEMO_CHILD_PROFILES.get(child_id, DEMO_CHILD_PROFILES['child1'])
        
        # Analyze emotion with Advanced AI using multimodal approach
        emotion_result = emotion_companion.analyze_emotion_multimodal(
            image_base64, child_profile, activity_context
        )
        
        return jsonify(emotion_result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Emotion analysis failed: {str(e)}'
        }), 500

@app.route('/companion_chat', methods=['POST'])
def companion_chat():
    """
    Chat with AI companion based on current emotional state
    """
    try:
        data = request.get_json()
        
        child_id = data.get('child_id', 'child1')
        user_message = data.get('message', '')
        current_emotion = data.get('current_emotion', 'neutral')
        
        # Get child profile
        child_profile = DEMO_CHILD_PROFILES.get(child_id, DEMO_CHILD_PROFILES['child1'])
        child_name = child_profile['name']
        
        # Simple companion responses based on emotion
        companion_responses = {
            'happy': f"Yay! I love seeing you happy, {child_name}! What's making you feel so great today? 😊",
            'sad': f"I can see you're feeling sad, {child_name}. That's okay - everyone feels sad sometimes. Want to talk about it? 🤗",
            'angry': f"I notice you're feeling frustrated, {child_name}. Let's take some deep breaths together. Breathe in... and out... 😌",
            'fear': f"It's okay to feel scared sometimes, {child_name}. You're very brave! What can we do to help you feel safer? 💪",
            'surprised': f"Wow! You look surprised, {child_name}! Sometimes surprises can be exciting! 🎉",
            'neutral': f"Hi there, {child_name}! I'm here if you want to chat or need any help with your learning! 🌟"
        }
        
        response_message = companion_responses.get(current_emotion, companion_responses['neutral'])
        
        # Add personalized touches based on interests
        interests = child_profile.get('interests', [])
        if interests and user_message:
            if any(interest in user_message.lower() for interest in interests):
                response_message += f" I see you mentioned {interests[0]}! I know you love that! 🌈"
        
        return jsonify({
            'success': True,
            'companion_response': {
                'message': response_message,
                'emotion_acknowledged': current_emotion,
                'suggested_activity': 'Would you like to try a calming breathing exercise?',
                'encouragement_level': 4
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Companion chat failed: {str(e)}'
        }), 500

@app.route('/generate_social_story', methods=['POST'])
def generate_social_story():
    """
    Generate personalized social story for emotional learning
    """
    try:
        data = request.get_json()
        
        child_id = data.get('child_id', 'child1')
        emotion_context = data.get('emotion_context', 'feeling frustrated during learning')
        
        # Get child profile
        child_profile = DEMO_CHILD_PROFILES.get(child_id, DEMO_CHILD_PROFILES['child1'])
        
        # Generate social story with AI Companion
        social_story = emotion_companion.generate_social_story(emotion_context, child_profile)
        
        return jsonify({
            'success': True,
            'social_story': social_story
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Social story generation failed: {str(e)}'
        }), 500

@app.route('/emotion_dashboard', methods=['GET'])
def emotion_dashboard():
    """
    Get emotion tracking dashboard data
    """
    try:
        child_id = request.args.get('child_id', 'child1')
        
        # Mock dashboard data for demo
        dashboard_data = {
            'today_emotions': ['happy', 'neutral', 'happy', 'surprised', 'happy'],
            'mood_trend': 'positive',
            'coping_strategies_used': [
                {'strategy': 'Deep breathing', 'times_used': 3, 'effectiveness': 85},
                {'strategy': 'Counting to 10', 'times_used': 2, 'effectiveness': 90}
            ],
            'achievements': [
                'Managed frustration independently',
                'Used calm voice when upset',
                'Asked for help appropriately'
            ],
            'weekly_summary': {
                'positive_emotions': 68,
                'challenging_moments': 8,
                'successful_coping': 12,
                'improvement_areas': ['Transition times', 'New activities']
            }
        }
        
        return jsonify({
            'success': True,
            'dashboard': dashboard_data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Dashboard generation failed: {str(e)}'
        }), 500

# ============================================================================
# PRIORITY 3: Predictive Learning Analytics Endpoints
# ============================================================================

@app.route('/predict_trajectory', methods=['POST'])
def predict_trajectory():
    """
    Predict learning trajectory for the next 3-6 months
    """
    try:
        data = request.get_json()
        
        child_id = data.get('child_id', 'child1')
        historical_data = data.get('historical_data', [])
        
        # Get child profile
        child_profile = DEMO_CHILD_PROFILES.get(child_id, DEMO_CHILD_PROFILES['child1'])
        
        # Generate prediction with Predictive Analytics
        trajectory_result = predictive_analytics.predict_learning_trajectory(
            child_profile, historical_data
        )
        
        return jsonify(trajectory_result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Trajectory prediction failed: {str(e)}'
        }), 500

@app.route('/intervention_timing', methods=['POST'])
def assess_intervention_timing():
    """
    Assess optimal timing for interventions
    """
    try:
        data = request.get_json()
        
        child_id = data.get('child_id', 'child1')
        current_performance = data.get('current_performance', {})
        
        # Get child profile
        child_profile = DEMO_CHILD_PROFILES.get(child_id, DEMO_CHILD_PROFILES['child1'])
        
        # Assess intervention timing
        timing_result = predictive_analytics.assess_intervention_timing(
            child_profile, current_performance
        )
        
        return jsonify(timing_result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Intervention timing assessment failed: {str(e)}'
        }), 500

@app.route('/population_insights', methods=['POST'])
def generate_population_insights():
    """
    Generate population-level insights for schools/districts
    """
    try:
        data = request.get_json()
        
        school_data = data.get('school_data', [])
        
        # Generate population insights using advanced analytics
        insights_result = predictive_analytics.get_population_insights(school_data)
        
        return jsonify(insights_result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Population insights generation failed: {str(e)}'
        }), 500

@app.route('/learning_analytics_dashboard', methods=['GET'])
def learning_analytics_dashboard():
    """
    Get comprehensive learning analytics dashboard
    """
    try:
        child_id = request.args.get('child_id', 'child1')
        
        # Mock analytics dashboard for demo
        analytics_data = {
            'performance_trends': {
                'reading': {'current': 78, 'trend': '+12%', 'prediction': '85% by next month'},
                'math': {'current': 65, 'trend': '+8%', 'prediction': '72% by next month'},
                'focus': {'current': 88, 'trend': '+5%', 'prediction': '90% by next month'},
                'social': {'current': 71, 'trend': '+15%', 'prediction': '80% by next month'}
            },
            'learning_patterns': {
                'best_learning_time': 'Morning (9-11 AM)',
                'optimal_session_length': '15-20 minutes',
                'engagement_drivers': ['Visual content', 'Interactive games', 'Immediate feedback'],
                'challenge_areas': ['Complex instructions', 'Evening sessions']
            },
            'intervention_recommendations': [
                {
                    'area': 'Reading Fluency',
                    'recommendation': 'Increase daily reading practice to 20 minutes',
                    'expected_impact': '+15% improvement in 6 weeks',
                    'priority': 'high'
                },
                {
                    'area': 'Attention Span',
                    'recommendation': 'Implement movement breaks every 15 minutes',
                    'expected_impact': '+20% sustained attention',
                    'priority': 'medium'
                }
            ],
            'milestone_predictions': [
                {'skill': 'Reading grade level', 'current': '2.1', 'predicted': '2.5 by December'},
                {'skill': 'Math facts fluency', 'current': '65%', 'predicted': '80% by November'},
                {'skill': 'Independent task completion', 'current': '70%', 'predicted': '85% by January'}
            ]
        }
        
        return jsonify({
            'success': True,
            'analytics': analytics_data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Analytics dashboard generation failed: {str(e)}'
        }), 500

# ============================================================================
# Enhanced Story Generation (Original Feature + AI Integration)
# ============================================================================

@app.route('/generate_story_enhanced', methods=['POST'])
def generate_story_enhanced():
    """
    Enhanced story generation with AI Reading Coach integration
    """
    try:
        data = request.get_json()
        
        theme = data.get('theme', 'friendship')
        characters = data.get('characters', 'a friendly dragon')
        reading_level = data.get('reading_level', 1)
        child_id = data.get('child_id', 'child1')
        
        # Get child profile for personalization
        child_profile = DEMO_CHILD_PROFILES.get(child_id, DEMO_CHILD_PROFILES['child1'])
        
        # Enhanced mock story response with reading coach integration
        story_response = {
            'success': True,
            'story': {
                'title': f'{theme.title()} Adventure',
                'theme': theme,
                'characters': characters.split(', '),
                'level': reading_level,
                'pages': [
                    {
                        'text': f'Once upon a time, there was a magical world where {characters} lived.',
                        'illustration_prompt': f'A colorful magical world with {characters}'
                    },
                    {
                        'text': f'Every day, they would explore and learn about {theme}.',
                        'illustration_prompt': f'{characters} exploring and discovering {theme}'
                    },
                    {
                        'text': f'Through their adventures, they discovered that {theme} makes everything better!',
                        'illustration_prompt': f'{characters} celebrating and showing {theme}'
                    }
                ],
                'illustrations': [
                    'https://via.placeholder.com/400x300/FFB6C1/000000?text=Story+Page+1',
                    'https://via.placeholder.com/400x300/98FB98/000000?text=Story+Page+2',
                    'https://via.placeholder.com/400x300/87CEEB/000000?text=Story+Page+3'
                ],
                'audio_base64': 'mock_audio_data_here',
                'page_count': 3
            },
            'reading_coach': {
                'sentence': f'Every day, they would explore and learn about {theme}.',
                'pronunciation': 'EV-ree day, they would ek-SPLOR and lurn a-BOWT...',
                'correction_phrases': [
                    'Break down "explore" into "ex-plore"',
                    'Sound out each syllable slowly',
                    'Remember: "learn" sounds like "lurn"'
                ]
            },
            'reward': {
                'badge': '🌟 Story Creator Master',
                'unlocked_character': f'🐲 Friendly {theme.title()} Dragon',
                'description': f'You created an amazing story about {theme}! Your imagination is wonderful!'
            },
            'ai_enhancements': {
                'personalized_for': child_profile['name'],
                'adapted_to_interests': child_profile['interests'],
                'reading_level_optimized': True,
                'learning_differences_considered': child_profile['learning_differences']
            }
        }
        
        return jsonify(story_response)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Enhanced story generation failed: {str(e)}'
        }), 500

# ============================================================================
# Comprehensive AI Dashboard
# ============================================================================

@app.route('/ai_dashboard', methods=['GET'])
def ai_dashboard():
    """
    Comprehensive AI dashboard combining all three features
    """
    try:
        child_id = request.args.get('child_id', 'child1')
        child_profile = DEMO_CHILD_PROFILES.get(child_id, DEMO_CHILD_PROFILES['child1'])
        
        dashboard_data = {
            'child_profile': child_profile,
            'ai_features_status': {
                'reading_coach': {'active': True, 'sessions_today': 3, 'improvement': '+12%'},
                'emotion_companion': {'active': True, 'check_ins_today': 5, 'mood_trend': 'positive'},
                'predictive_analytics': {'active': True, 'predictions_updated': 'today', 'accuracy': '87%'}
            },
            'daily_summary': {
                'reading_practice': {'minutes': 25, 'accuracy': 82, 'fluency_improvement': '+5%'},
                'emotional_wellness': {'mood_score': 8.2, 'coping_strategies_used': 2, 'positive_interactions': 12},
                'learning_progress': {'goals_met': 3, 'goals_total': 4, 'trajectory': 'on_track'}
            },
            'ai_recommendations': [
                'Continue morning reading sessions - optimal time for focus',
                'Practice deep breathing when frustrated - 90% success rate',
                'Math fluency games at 3 PM show highest engagement'
            ],
            'next_actions': [
                {'type': 'reading', 'action': 'Complete phonics exercise', 'priority': 'high'},
                {'type': 'emotion', 'action': 'Check-in with companion', 'priority': 'medium'},
                {'type': 'analytics', 'action': 'Review weekly progress', 'priority': 'low'}
            ]
        }
        
        return jsonify({
            'success': True,
            'dashboard': dashboard_data,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'AI dashboard generation failed: {str(e)}'
        }), 500

# ============================================================================
# Advanced AI Features - Contextual Intelligence
# ============================================================================

@app.route('/contextual_ai_response', methods=['POST'])
def contextual_ai_response():
    """
    Generate contextual AI companion response based on emotion and activity
    """
    try:
        data = request.get_json()
        
        child_id = data.get('child_id', 'child1')
        emotion_state = data.get('emotion_state', 'neutral')
        activity_context = data.get('activity_context', 'general_learning')
        user_message = data.get('message', '')
        
        # Get child profile
        child_profile = DEMO_CHILD_PROFILES.get(child_id, DEMO_CHILD_PROFILES['child1'])
        
        # Generate contextual response
        response = emotion_companion.generate_contextual_response(
            emotion_state, activity_context, user_message, child_profile
        )
        
        return jsonify({
            'success': True,
            'response': response
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Contextual response generation failed: {str(e)}'
        }), 500

@app.route('/advanced_reading_feedback', methods=['POST'])
def advanced_reading_feedback():
    """
    Get detailed reading feedback with phonics analysis and recommendations
    """
    try:
        data = request.get_json()
        
        child_id = data.get('child_id', 'child1')
        reading_session_data = data.get('session_data', {})
        
        # Get child profile
        child_profile = DEMO_CHILD_PROFILES.get(child_id, DEMO_CHILD_PROFILES['child1'])
        
        # Get comprehensive reading feedback
        feedback = reading_coach.get_reading_feedback(reading_session_data, child_profile)
        
        return jsonify({
            'success': True,
            'feedback': feedback
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Reading feedback generation failed: {str(e)}'
        }), 500

@app.route('/real_time_emotion_support', methods=['POST'])
def real_time_emotion_support():
    """
    Provide real-time emotional support based on detected emotion
    """
    try:
        data = request.get_json()
        
        child_id = data.get('child_id', 'child1')
        image_base64 = data.get('image_base64')
        immediate_context = data.get('context', 'learning_session')
        
        if not image_base64:
            return jsonify({
                'success': False,
                'error': 'Image data required for emotion detection'
            }), 400
        
        # Get child profile
        child_profile = DEMO_CHILD_PROFILES.get(child_id, DEMO_CHILD_PROFILES['child1'])
        
        # Analyze emotion and provide immediate support
        emotion_result = emotion_companion.analyze_emotion_multimodal(
            image_base64, child_profile, immediate_context
        )
        
        if emotion_result.get('success'):
            # Generate immediate support response
            support_response = emotion_companion.generate_contextual_response(
                emotion_result['emotion'],
                immediate_context,
                "I need help with my feelings",
                child_profile
            )
            
            emotion_result['immediate_support'] = support_response
        
        return jsonify(emotion_result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Real-time emotion support failed: {str(e)}'
        }), 500

@app.route('/demo/showcase', methods=['GET'])
def demo_showcase():
    """Demo endpoint showcasing all AI features"""
    demo_data = {
        'features': {sing all three AI features
            'ai_reading_coach': 'Whisper-powered reading analysis',
            'emotion_ai_companion': 'Multi-modal emotion detection',
            'predictive_analytics': 'ML-powered learning insights'
        },        'ai_reading_coach': {
        'demo_ready': True,
        'timestamp': datetime.now().isoformat()                'description': 'Whisper-powered reading analysis with adaptive phonics',














    app.run(debug=True, host='0.0.0.0', port=5001)        print("\nServer starting on http://localhost:5001")    print("  ✅ Enhanced Story Generation")    print("  ✅ Predictive Learning Analytics")    print("  ✅ Emotion AI Companion")     print("  ✅ AI Reading Coach 2.0")    print("Features loaded:")    print("🚀 Enhanced AI Backend for Umeed - Hackathon Version")if __name__ == '__main__':    return jsonify({'success': True, 'showcase': demo_data})    }                'features': [
                    'Real-time speech recognition with OpenAI Whisper',
                    'Phonics pattern analysis and error detection',
                    'Adaptive difficulty adjustment',
                    'Personalized reading recommendations'
                ],
                'demo_scenarios': [
                    {
                        'scenario': 'Child with Dyslexia reading practice',
                        'expected_outcome': 'Identifies letter reversals, provides phonics support'
                    },
                    {
                        'scenario': 'ADHD child attention tracking',
                        'expected_outcome': 'Adjusts reading pace, maintains engagement'
                    }
                ]
            },
            'emotion_ai_companion': {
                'title': 'Emotion AI Companion',
                'description': 'Multi-modal emotion detection with contextual AI support',
                'features': [
                    'Real-time facial emotion detection (DeepFace + OpenCV)',
                    'Context-aware AI companion responses',
                    'Personalized social story generation',
                    'Adaptive emotional support strategies'
                ],
                'demo_scenarios': [
                    {
                        'scenario': 'Child showing frustration during math',
                        'expected_outcome': 'Detects emotion, offers coping strategies'
                    },
                    {
                        'scenario': 'Autism spectrum child needs social guidance',
                        'expected_outcome': 'Generates personalized social story'
                    }
                ]
            },
            'predictive_analytics': {
                'title': 'Predictive Learning Analytics',
                'description': 'ML-powered learning trajectory and intervention timing',
                'features': [
                    'Learning trajectory prediction (3-6 months)',
                    'Optimal intervention timing assessment',
                    'Population-level insights for schools',
                    'Risk factor identification and mitigation'
                ],
                'demo_scenarios': [
                    {
                        'scenario': 'Predicting reading improvement timeline',
                        'expected_outcome': 'ML model suggests 3-month improvement plan'
                    },
                    {
                        'scenario': 'School district intervention planning',
                        'expected_outcome': 'Population insights identify at-risk students'
                    }
                ]
            },
            'integration_highlights': [
                'Seamless cross-feature data sharing',
                'Unified child profile management',
                'Real-time adaptation based on multiple AI inputs',
                'Comprehensive parent/teacher dashboards'
            ],
            'technical_stack': {
                'backend': ['Python', 'Flask', 'OpenAI API', 'scikit-learn', 'OpenCV'],
                'frontend': ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
                'ai_models': ['OpenAI Whisper', 'DeepFace', 'Custom ML models']
            }
        }
        
        return jsonify({
            'success': True,
            'demo_ready': True,
            'showcase': demo_data,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Demo showcase failed: {str(e)}'
        }), 500

@app.route('/demo/test_all', methods=['POST'])
def demo_test_all():
    """
    Run a comprehensive test of all AI features with sample data
    """
    try:
        results = {}
        
        # Test Reading Coach
        try:
            sample_audio = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DwumlTWUP3"
            reading_result = reading_coach.analyze_reading_with_whisper(
                sample_audio, "The cat sat on the mat", DEMO_CHILD_PROFILES['child1']
            )
            results['reading_coach'] = {'status': 'success', 'result': reading_result}
        except Exception as e:
            results['reading_coach'] = {'status': 'error', 'error': str(e)}
        
        # Test Emotion AI
        try:
            sample_image = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCACAAIADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK