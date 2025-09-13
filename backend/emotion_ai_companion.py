"""
Emotion AI Companion - Real-time emotion detection and personalized support
Uses computer vision for emotion detection and GPT-4 for contextual responses
"""

import cv2
import numpy as np
import base64
import json
import openai
import os
from typing import Dict, List, Tuple, Optional
import tempfile
from datetime import datetime, timedelta
import sqlite3
from gtts import gTTS

class EmotionAICompanion:
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.emotion_history = []
        self.init_database()
        
        # Emotion detection model (using OpenCV's pre-trained model)
        self.emotion_labels = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']
        
        # Load pre-trained emotion detection model
        try:
            # Using OpenCV's DNN module with a pre-trained model
            self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        except Exception as e:
            print(f"Warning: Could not load face detection model: {e}")
            self.face_cascade = None
    
    def init_database(self):
        """Initialize SQLite database for emotion tracking"""
        self.conn = sqlite3.connect('emotion_data.db', check_same_thread=False)
        cursor = self.conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS emotion_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                child_id TEXT,
                timestamp DATETIME,
                detected_emotion TEXT,
                confidence REAL,
                activity_context TEXT,
                ai_response TEXT,
                intervention_suggested BOOLEAN
            )
        ''')
        self.conn.commit()
    
    def analyze_emotion_from_image(self, image_base64: str, child_profile: Dict, activity_context: str = "") -> Dict:
        """
        Analyze emotion from webcam image and provide AI companion response
        """
        try:
            # Decode base64 image
            image_data = base64.b64decode(image_base64)
            nparr = np.frombuffer(image_data, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            # Detect faces and emotions
            emotion_result = self._detect_emotion_from_face(image)
            
            if not emotion_result['faces_detected']:
                return {
                    'success': False,
                    'message': 'No face detected. Please make sure you are visible to the camera! 😊'
                }
            
            # Analyze emotion context
            emotion_analysis = self._analyze_emotion_context(
                emotion_result['primary_emotion'],
                emotion_result['confidence'],
                child_profile,
                activity_context
            )
            
            # Generate AI companion response
            companion_response = self._generate_companion_response(
                emotion_analysis,
                child_profile,
                activity_context
            )
            
            # Store emotion data
            self._store_emotion_data(
                child_profile.get('id', 'unknown'),
                emotion_result['primary_emotion'],
                emotion_result['confidence'],
                activity_context,
                companion_response
            )
            
            # Check if intervention is needed
            intervention_needed = self._assess_intervention_need(
                emotion_result['primary_emotion'],
                emotion_result['confidence'],
                child_profile
            )
            
            return {
                'success': True,
                'emotion_detected': emotion_result['primary_emotion'],
                'confidence': emotion_result['confidence'],
                'companion_response': companion_response,
                'intervention_needed': intervention_needed,
                'coping_strategies': self._get_coping_strategies(emotion_result['primary_emotion'], child_profile),
                'emotion_trend': self._get_recent_emotion_trend(child_profile.get('id', 'unknown'))
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f"Emotion analysis failed: {str(e)}"
            }
    
    def _detect_emotion_from_face(self, image: np.ndarray) -> Dict:
        """
        Detect emotion from facial features using computer vision
        """
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        if self.face_cascade is None:
            # Fallback: simple emotion simulation based on image brightness/contrast
            brightness = np.mean(gray)
            contrast = np.std(gray)
            
            # Simple heuristic for demo purposes
            if brightness > 120 and contrast > 30:
                primary_emotion = 'happy'
                confidence = 0.7
            elif brightness < 80:
                primary_emotion = 'sad'
                confidence = 0.6
            else:
                primary_emotion = 'neutral'
                confidence = 0.5
            
            return {
                'faces_detected': True,
                'primary_emotion': primary_emotion,
                'confidence': confidence,
                'all_emotions': {primary_emotion: confidence}
            }
        
        # Detect faces
        faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)
        
        if len(faces) == 0:
            return {
                'faces_detected': False,
                'primary_emotion': None,
                'confidence': 0,
                'all_emotions': {}
            }
        
        # For demo purposes, we'll use a simplified emotion detection
        # In production, you'd use a trained emotion recognition model
        face_region = gray[faces[0][1]:faces[0][1]+faces[0][3], faces[0][0]:faces[0][0]+faces[0][2]]
        
        # Simple emotion detection based on facial features analysis
        emotion_scores = self._analyze_facial_features(face_region)
        primary_emotion = max(emotion_scores, key=emotion_scores.get)
        confidence = emotion_scores[primary_emotion]
        
        return {
            'faces_detected': True,
            'primary_emotion': primary_emotion,
            'confidence': confidence,
            'all_emotions': emotion_scores
        }
    
    def _analyze_facial_features(self, face_region: np.ndarray) -> Dict[str, float]:
        """
        Analyze facial features for emotion detection (simplified version)
        """
        # This is a simplified version for demo purposes
        # In production, you'd use a trained deep learning model
        
        brightness = np.mean(face_region)
        contrast = np.std(face_region)
        
        # Calculate gradient features
        grad_x = cv2.Sobel(face_region, cv2.CV_64F, 1, 0, ksize=3)
        grad_y = cv2.Sobel(face_region, cv2.CV_64F, 0, 1, ksize=3)
        gradient_magnitude = np.sqrt(grad_x**2 + grad_y**2)
        avg_gradient = np.mean(gradient_magnitude)
        
        # Simple heuristic mapping (replace with actual ML model)
        emotion_scores = {
            'happy': max(0, min(1, (brightness - 100) / 50 + (contrast - 20) / 30)),
            'sad': max(0, min(1, (120 - brightness) / 40)),
            'angry': max(0, min(1, (avg_gradient - 15) / 20)),
            'surprise': max(0, min(1, contrast / 50)),
            'fear': max(0, min(1, (avg_gradient - 10) / 30)),
            'neutral': max(0, min(1, 1 - abs(brightness - 110) / 50)),
            'disgust': max(0, min(1, (avg_gradient - 12) / 25))
        }
        
        # Normalize scores
        total = sum(emotion_scores.values())
        if total > 0:
            emotion_scores = {k: v / total for k, v in emotion_scores.items()}
        
        return emotion_scores
    
    def _analyze_emotion_context(self, emotion: str, confidence: float, child_profile: Dict, activity_context: str) -> Dict:
        """
        Analyze emotion in context of child's profile and current activity
        """
        learning_differences = child_profile.get('learning_differences', [])
        age = child_profile.get('age', 8)
        interests = child_profile.get('interests', [])
        
        # Context-specific analysis
        context_factors = {
            'learning_stress': False,
            'engagement_level': 'medium',
            'support_needed': False,
            'positive_reinforcement': False
        }
        
        # Analyze based on learning differences
        if 'ADHD' in learning_differences:
            if emotion in ['angry', 'frustration'] and 'learning' in activity_context:
                context_factors['learning_stress'] = True
                context_factors['support_needed'] = True
        
        if 'Autism' in learning_differences:
            if emotion in ['fear', 'surprise'] and confidence > 0.7:
                context_factors['support_needed'] = True
                context_factors['engagement_level'] = 'low'
        
        if 'Dyslexia' in learning_differences:
            if emotion in ['sad', 'frustration'] and 'reading' in activity_context:
                context_factors['learning_stress'] = True
                context_factors['positive_reinforcement'] = True
        
        # Positive emotions
        if emotion in ['happy', 'surprise'] and confidence > 0.6:
            context_factors['positive_reinforcement'] = True
            context_factors['engagement_level'] = 'high'
        
        return {
            'emotion': emotion,
            'confidence': confidence,
            'context_factors': context_factors,
            'recommended_approach': self._get_recommended_approach(emotion, context_factors, child_profile)
        }
    
    def _generate_companion_response(self, emotion_analysis: Dict, child_profile: Dict, activity_context: str) -> Dict:
        """
        Generate AI companion response using GPT-4
        """
        emotion = emotion_analysis['emotion']
        context_factors = emotion_analysis['context_factors']
        child_name = child_profile.get('name', 'friend')
        interests = child_profile.get('interests', ['learning'])
        age = child_profile.get('age', 8)
        
        prompt = f"""
        You are Buddy, a warm, supportive AI companion for {child_name}, a {age}-year-old child with {', '.join(child_profile.get('learning_differences', []))}.
        
        Current situation:
        - Detected emotion: {emotion} (confidence: {emotion_analysis['confidence']:.1%})
        - Activity context: {activity_context}
        - Child's interests: {', '.join(interests)}
        - Learning stress detected: {context_factors['learning_stress']}
        - Support needed: {context_factors['support_needed']}
        
        Respond as Buddy in a way that:
        1. Acknowledges their emotion with empathy
        2. Provides age-appropriate emotional support
        3. Connects to their interests when possible
        4. Offers a simple coping strategy if needed
        5. Encourages them to continue or suggests a break if stressed
        
        Keep response under 100 words, warm and encouraging.
        
        Format as JSON with: message, suggested_action, encouragement_level (1-5), break_suggested (boolean)
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.8,
                max_tokens=200
            )
            
            companion_response = json.loads(response.choices[0].message.content or "{}")
            
            # Generate audio version
            message = companion_response.get('message', f"Hi {child_name}! I'm here to help! 😊")
            audio_base64 = self._generate_companion_audio(message)
            companion_response['audio'] = audio_base64
            
            return companion_response
            
        except Exception as e:
            return {
                'message': f"Hi {child_name}! I can see you're feeling {emotion}. That's totally okay! I'm here to help! 😊",
                'suggested_action': 'take_deep_breaths',
                'encouragement_level': 4,
                'break_suggested': context_factors['learning_stress'],
                'audio': ''
            }
    
    def _get_coping_strategies(self, emotion: str, child_profile: Dict) -> List[Dict]:
        """
        Get personalized coping strategies based on emotion and child profile
        """
        interests = child_profile.get('interests', ['animals'])
        learning_differences = child_profile.get('learning_differences', [])
        
        strategies = []
        
        if emotion in ['angry', 'frustration']:
            strategies.extend([
                {
                    'title': f'Count to 10 with {interests[0].title()}',
                    'description': f'Imagine 10 friendly {interests[0]} and count each one slowly',
                    'duration': '2 minutes',
                    'type': 'breathing'
                },
                {
                    'title': 'Squeeze and Release',
                    'description': 'Make tight fists, count to 5, then let go and feel the calm',
                    'duration': '1 minute',
                    'type': 'physical'
                }
            ])
        
        if emotion in ['sad', 'fear']:
            strategies.extend([
                {
                    'title': f'Happy {interests[0].title()} Thoughts',
                    'description': f'Think of three happy things about {interests[0]}',
                    'duration': '3 minutes',
                    'type': 'cognitive'
                },
                {
                    'title': 'Comfort Breathing',
                    'description': 'Breathe in for 4, hold for 4, breathe out for 6',
                    'duration': '5 minutes',
                    'type': 'breathing'
                }
            ])
        
        if 'ADHD' in learning_differences:
            strategies.append({
                'title': 'Movement Break',
                'description': 'Do 10 jumping jacks or stretch like your favorite animal',
                'duration': '2 minutes',
                'type': 'movement'
            })
        
        return strategies
    
    def _assess_intervention_need(self, emotion: str, confidence: float, child_profile: Dict) -> Dict:
        """
        Assess if immediate intervention is needed
        """
        high_stress_emotions = ['angry', 'fear', 'disgust']
        learning_differences = child_profile.get('learning_differences', [])
        
        intervention_needed = False
        urgency_level = 'low'
        suggested_actions = []
        
        if emotion in high_stress_emotions and confidence > 0.7:
            intervention_needed = True
            urgency_level = 'medium'
            suggested_actions.extend([
                'Offer immediate emotional support',
                'Suggest coping strategies',
                'Consider break from current activity'
            ])
        
        # Check recent emotion history for patterns
        recent_negative_count = self._count_recent_negative_emotions(child_profile.get('id', 'unknown'))
        if recent_negative_count >= 3:
            intervention_needed = True
            urgency_level = 'high'
            suggested_actions.append('Alert parent/teacher - pattern of distress detected')
        
        return {
            'needed': intervention_needed,
            'urgency': urgency_level,
            'suggested_actions': suggested_actions,
            'parent_notification': urgency_level == 'high'
        }
    
    def _generate_companion_audio(self, message: str) -> str:
        """
        Generate audio version of companion message
        """
        try:
            # Use a more cheerful voice setting for children
            tts = gTTS(text=message, lang='en', slow=False)
            
            with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as temp_audio:
                tts.save(temp_audio.name)
                
                with open(temp_audio.name, 'rb') as audio_file:
                    audio_base64 = base64.b64encode(audio_file.read()).decode('utf-8')
                
                os.unlink(temp_audio.name)
                return audio_base64
                
        except Exception as e:
            return ""
    
    def _store_emotion_data(self, child_id: str, emotion: str, confidence: float, activity_context: str, ai_response: Dict):
        """
        Store emotion data for pattern analysis
        """
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
                INSERT INTO emotion_sessions 
                (child_id, timestamp, detected_emotion, confidence, activity_context, ai_response, intervention_suggested)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                child_id,
                datetime.now(),
                emotion,
                confidence,
                activity_context,
                json.dumps(ai_response),
                ai_response.get('break_suggested', False)
            ))
            self.conn.commit()
        except Exception as e:
            print(f"Error storing emotion data: {e}")
    
    def _get_recent_emotion_trend(self, child_id: str, hours: int = 24) -> Dict:
        """
        Get recent emotion trend for the child
        """
        try:
            cursor = self.conn.cursor()
            since_time = datetime.now() - timedelta(hours=hours)
            
            cursor.execute('''
                SELECT detected_emotion, confidence, timestamp 
                FROM emotion_sessions 
                WHERE child_id = ? AND timestamp > ?
                ORDER BY timestamp DESC
            ''', (child_id, since_time))
            
            results = cursor.fetchall()
            
            if not results:
                return {'trend': 'neutral', 'pattern': 'insufficient_data'}
            
            emotions = [row[0] for row in results]
            positive_emotions = ['happy', 'surprise', 'neutral']
            
            positive_count = sum(1 for e in emotions if e in positive_emotions)
            trend_ratio = positive_count / len(emotions)
            
            trend = 'positive' if trend_ratio > 0.6 else 'negative' if trend_ratio < 0.3 else 'mixed'
            
            return {
                'trend': trend,
                'recent_emotions': emotions[:5],  # Last 5 emotions
                'positive_ratio': trend_ratio,
                'total_sessions': len(emotions)
            }
            
        except Exception as e:
            return {'trend': 'neutral', 'pattern': 'error', 'error': str(e)}
    
    def _count_recent_negative_emotions(self, child_id: str, hours: int = 2) -> int:
        """
        Count recent negative emotions for intervention assessment
        """
        try:
            cursor = self.conn.cursor()
            since_time = datetime.now() - timedelta(hours=hours)
            
            cursor.execute('''
                SELECT COUNT(*) FROM emotion_sessions 
                WHERE child_id = ? AND timestamp > ? 
                AND detected_emotion IN ('angry', 'sad', 'fear', 'disgust')
                AND confidence > 0.6
            ''', (child_id, since_time))
            
            return cursor.fetchone()[0]
            
        except Exception as e:
            return 0
    
    def _get_recommended_approach(self, emotion: str, context_factors: Dict, child_profile: Dict) -> str:
        """
        Get recommended approach based on emotion and context
        """
        learning_differences = child_profile.get('learning_differences', [])
        
        if context_factors['learning_stress']:
            if 'ADHD' in learning_differences:
                return 'movement_break'
            elif 'Autism' in learning_differences:
                return 'sensory_break'
            else:
                return 'encouragement_and_break'
        
        if emotion in ['happy', 'surprise']:
            return 'positive_reinforcement'
        elif emotion in ['sad', 'fear']:
            return 'gentle_support'
        elif emotion in ['angry']:
            return 'calming_strategies'
        else:
            return 'general_support'
    
    def generate_social_story(self, emotion_context: str, child_profile: Dict) -> Dict:
        """
        Generate a personalized social story to help with emotional understanding
        """
        interests = child_profile.get('interests', ['friends'])
        name = child_profile.get('name', 'Alex')
        
        prompt = f"""
        Create a short, simple social story for {name}, a {child_profile.get('age', 8)}-year-old child who loves {', '.join(interests)}.
        
        The story should help them understand and cope with feeling {emotion_context}.
        
        Guidelines:
        - Use simple, positive language
        - Include characters related to their interests
        - Show healthy ways to handle the emotion
        - End with encouragement
        - Keep it 4-6 sentences
        
        Format as JSON with: title, story_text, lesson, encouragement
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=300
            )
            
            return json.loads(response.choices[0].message.content or "{}")
            
        except Exception as e:
            return {
                'title': f'{name} and the Feeling Helper',
                'story_text': f'{name} sometimes feels different emotions, and that\'s perfectly okay! When {name} feels {emotion_context}, they remember to take deep breaths and ask for help when needed.',
                'lesson': 'All feelings are okay, and there are ways to feel better.',
                'encouragement': f'You\'re doing great, {name}! Every feeling teaches us something new.'
            }
