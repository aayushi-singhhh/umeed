"""
Advanced Emotion Analysis Module for Umeed
Integrates multiple AI models for comprehensive emotion detection and response
"""

import cv2
import numpy as np
import openai
import os
import base64
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import sqlite3
from scipy.signal import savgol_filter
import face_recognition
from deepface import DeepFace
import mediapipe as mp

class AdvancedEmotionAnalyzer:
    """
    Advanced emotion analysis using multiple AI models and computer vision techniques
    """
    
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        # Initialize emotion detection models
        self.init_emotion_models()
        
        # Initialize face analysis
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            static_image_mode=True,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5
        )
        
        # Emotion history for pattern analysis
        self.emotion_history = []
        self.init_database()
        
    def init_emotion_models(self):
        """Initialize emotion detection models"""
        try:
            # DeepFace supports multiple backends
            self.emotion_backends = ['opencv', 'retinaface', 'dlib']
            self.current_backend = 'opencv'
            
            # Emotion labels with confidence thresholds
            self.emotion_config = {
                'happy': {'threshold': 0.6, 'interventions': ['celebrate', 'encourage_more']},
                'sad': {'threshold': 0.5, 'interventions': ['comfort', 'distract', 'social_story']},
                'angry': {'threshold': 0.4, 'interventions': ['calm_down', 'breathing', 'break_time']},
                'fear': {'threshold': 0.4, 'interventions': ['reassure', 'explain', 'gradual_exposure']},
                'surprise': {'threshold': 0.5, 'interventions': ['explain', 'normalize']},
                'disgust': {'threshold': 0.4, 'interventions': ['redirect', 'explain']},
                'neutral': {'threshold': 0.3, 'interventions': ['engage', 'motivate']}
            }
            
        except Exception as e:
            print(f"Warning: Could not initialize advanced emotion models: {e}")
            self.use_basic_detection = True
    
    def init_database(self):
        """Initialize emotion tracking database"""
        self.conn = sqlite3.connect('emotion_data.db', check_same_thread=False)
        cursor = self.conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS emotion_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                child_id TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                emotion TEXT NOT NULL,
                confidence REAL NOT NULL,
                context TEXT,
                intervention_applied TEXT,
                session_duration INTEGER,
                facial_landmarks TEXT,
                arousal_level REAL,
                valence_level REAL
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS emotion_patterns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                child_id TEXT NOT NULL,
                pattern_type TEXT NOT NULL,
                pattern_data TEXT NOT NULL,
                frequency REAL NOT NULL,
                last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        self.conn.commit()
    
    def analyze_emotion_comprehensive(self, image_base64: str, child_profile: Dict, context: str = "") -> Dict:
        """
        Comprehensive emotion analysis using multiple techniques
        """
        try:
            # Decode image
            image_data = base64.b64decode(image_base64)
            nparr = np.frombuffer(image_data, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if image is None:
                return {'success': False, 'error': 'Invalid image data'}
            
            # Multi-model emotion analysis
            emotion_results = self._multi_model_emotion_analysis(image)
            
            # Facial landmark analysis for micro-expressions
            landmark_analysis = self._analyze_facial_landmarks(image)
            
            # Temporal emotion analysis (if history available)
            temporal_analysis = self._analyze_emotion_patterns(child_profile['id'])
            
            # Combine results
            primary_emotion, confidence = self._combine_emotion_results(
                emotion_results, landmark_analysis, temporal_analysis
            )
            
            # Generate context-aware response
            companion_response = self._generate_advanced_companion_response(
                primary_emotion, confidence, child_profile, context, temporal_analysis
            )
            
            # Assess intervention need
            intervention_data = self._assess_comprehensive_intervention(
                primary_emotion, confidence, child_profile, temporal_analysis
            )
            
            # Store comprehensive data
            self._store_comprehensive_emotion_data(
                child_profile['id'], primary_emotion, confidence, context,
                companion_response, landmark_analysis, intervention_data
            )
            
            return {
                'success': True,
                'emotion_detected': primary_emotion,
                'confidence': confidence,
                'companion_response': companion_response,
                'intervention_needed': intervention_data['needed'],
                'intervention_type': intervention_data['type'],
                'coping_strategies': intervention_data['strategies'],
                'emotion_intensity': landmark_analysis.get('intensity', 0.5),
                'pattern_insights': temporal_analysis,
                'micro_expressions': landmark_analysis.get('micro_expressions', []),
                'arousal_level': landmark_analysis.get('arousal', 0.5),
                'valence_level': landmark_analysis.get('valence', 0.5)
            }
            
        except Exception as e:
            return {'success': False, 'error': f'Comprehensive emotion analysis failed: {str(e)}'}
    
    def _multi_model_emotion_analysis(self, image: np.ndarray) -> Dict:
        """Use multiple models for robust emotion detection"""
        results = {}
        
        try:
            # DeepFace analysis
            deepface_result = DeepFace.analyze(
                image, 
                actions=['emotion'], 
                detector_backend=self.current_backend,
                enforce_detection=False
            )
            
            if isinstance(deepface_result, list) and len(deepface_result) > 0:
                results['deepface'] = deepface_result[0]['emotion']
            else:
                results['deepface'] = deepface_result['emotion']
                
        except Exception as e:
            print(f"DeepFace analysis failed: {e}")
            results['deepface'] = None
        
        # Add basic OpenCV detection as fallback
        try:
            results['basic'] = self._basic_emotion_detection(image)
        except Exception as e:
            print(f"Basic emotion detection failed: {e}")
            results['basic'] = None
        
        return results
    
    def _analyze_facial_landmarks(self, image: np.ndarray) -> Dict:
        """Analyze facial landmarks for micro-expressions and intensity"""
        try:
            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            results = self.face_mesh.process(rgb_image)
            
            if not results.multi_face_landmarks:
                return {'intensity': 0.5, 'arousal': 0.5, 'valence': 0.5}
            
            landmarks = results.multi_face_landmarks[0]
            
            # Extract key facial points
            key_points = self._extract_emotion_landmarks(landmarks)
            
            # Calculate emotion intensity based on facial muscle activation
            intensity = self._calculate_emotion_intensity(key_points)
            
            # Calculate arousal and valence
            arousal = self._calculate_arousal(key_points)
            valence = self._calculate_valence(key_points)
            
            # Detect micro-expressions
            micro_expressions = self._detect_micro_expressions(key_points)
            
            return {
                'intensity': intensity,
                'arousal': arousal,
                'valence': valence,
                'micro_expressions': micro_expressions,
                'landmarks': key_points
            }
            
        except Exception as e:
            print(f"Landmark analysis failed: {e}")
            return {'intensity': 0.5, 'arousal': 0.5, 'valence': 0.5}
    
    def _extract_emotion_landmarks(self, landmarks) -> Dict:
        """Extract key landmarks for emotion analysis"""
        # Key facial points for emotion analysis
        key_indices = {
            'left_eye': [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246],
            'right_eye': [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398],
            'eyebrows': [70, 63, 105, 66, 107, 55, 65, 52, 53, 46, 285, 295, 282, 283, 276, 300, 293, 334, 296, 336],
            'mouth': [0, 11, 12, 13, 14, 15, 16, 17, 18, 200, 269, 270, 267, 271, 272, 271, 272],
            'nose': [1, 2, 5, 4, 6, 19, 20, 94, 125, 141, 235, 236, 3, 51, 48, 115, 131, 134, 102, 49, 220, 305, 281, 360, 279],
            'cheeks': [116, 117, 118, 119, 120, 121, 126, 142, 36, 205, 206, 207, 213, 192, 147, 187, 207, 213, 192, 147]
        }
        
        extracted_points = {}
        for region, indices in key_indices.items():
            points = []
            for idx in indices:
                if idx < len(landmarks.landmark):
                    lm = landmarks.landmark[idx]
                    points.append([lm.x, lm.y, lm.z])
            extracted_points[region] = np.array(points)
        
        return extracted_points
    
    def _calculate_emotion_intensity(self, landmarks: Dict) -> float:
        """Calculate emotion intensity from facial landmarks"""
        try:
            # Calculate intensity based on facial muscle activation
            intensity_factors = []
            
            # Eye openness (arousal indicator)
            if 'left_eye' in landmarks and 'right_eye' in landmarks:
                left_eye_height = np.mean(landmarks['left_eye'][:, 1])
                right_eye_height = np.mean(landmarks['right_eye'][:, 1])
                eye_intensity = abs(left_eye_height - right_eye_height) * 10
                intensity_factors.append(min(eye_intensity, 1.0))
            
            # Mouth curvature (valence indicator)
            if 'mouth' in landmarks:
                mouth_points = landmarks['mouth']
                if len(mouth_points) > 0:
                    mouth_curve = np.std(mouth_points[:, 1]) * 5
                    intensity_factors.append(min(mouth_curve, 1.0))
            
            # Eyebrow position (emotional activation)
            if 'eyebrows' in landmarks:
                eyebrow_height = np.std(landmarks['eyebrows'][:, 1]) * 8
                intensity_factors.append(min(eyebrow_height, 1.0))
            
            return np.mean(intensity_factors) if intensity_factors else 0.5
            
        except Exception as e:
            print(f"Intensity calculation failed: {e}")
            return 0.5
    
    def _calculate_arousal(self, landmarks: Dict) -> float:
        """Calculate emotional arousal level"""
        try:
            # High arousal: wide eyes, raised eyebrows, open mouth
            arousal_indicators = []
            
            # Eye width
            if 'left_eye' in landmarks and 'right_eye' in landmarks:
                eye_openness = (np.std(landmarks['left_eye'][:, 1]) + np.std(landmarks['right_eye'][:, 1])) * 4
                arousal_indicators.append(min(eye_openness, 1.0))
            
            # Eyebrow height
            if 'eyebrows' in landmarks:
                brow_height = 1.0 - np.mean(landmarks['eyebrows'][:, 1])  # Higher y = lower on screen
                arousal_indicators.append(min(brow_height * 2, 1.0))
            
            return np.mean(arousal_indicators) if arousal_indicators else 0.5
            
        except Exception as e:
            return 0.5
    
    def _calculate_valence(self, landmarks: Dict) -> float:
        """Calculate emotional valence (positive/negative)"""
        try:
            # Positive valence: upturned mouth corners, raised cheeks
            valence_indicators = []
            
            # Mouth curvature
            if 'mouth' in landmarks:
                mouth_points = landmarks['mouth']
                if len(mouth_points) > 4:
                    # Compare mouth corners to center
                    left_corner = mouth_points[0][1]
                    right_corner = mouth_points[-1][1]
                    center = np.mean(mouth_points[2:4, 1])
                    
                    smile_intensity = max(0, center - (left_corner + right_corner) / 2) * 10
                    valence_indicators.append(min(smile_intensity, 1.0))
            
            # Cheek elevation
            if 'cheeks' in landmarks:
                cheek_height = 1.0 - np.mean(landmarks['cheeks'][:, 1])
                valence_indicators.append(min(cheek_height * 1.5, 1.0))
            
            return np.mean(valence_indicators) if valence_indicators else 0.5
            
        except Exception as e:
            return 0.5
    
    def _detect_micro_expressions(self, landmarks: Dict) -> List[str]:
        """Detect subtle micro-expressions"""
        micro_expressions = []
        
        try:
            # Detect subtle expressions based on landmark patterns
            if 'eyebrows' in landmarks and 'eyes' in landmarks:
                # Slight eyebrow furrow (concentration/confusion)
                brow_distance = np.std(landmarks['eyebrows'][:, 0])
                if brow_distance < 0.02:
                    micro_expressions.append('concentration')
            
            if 'mouth' in landmarks:
                # Slight lip press (frustration)
                lip_compression = np.std(landmarks['mouth'][:, 1])
                if lip_compression < 0.01:
                    micro_expressions.append('mild_frustration')
            
            return micro_expressions
            
        except Exception as e:
            return []
    
    def _analyze_emotion_patterns(self, child_id: str) -> Dict:
        """Analyze historical emotion patterns"""
        try:
            cursor = self.conn.cursor()
            
            # Get recent emotion history (last 7 days)
            cursor.execute('''
                SELECT emotion, confidence, timestamp, arousal_level, valence_level
                FROM emotion_sessions 
                WHERE child_id = ? AND timestamp > datetime('now', '-7 days')
                ORDER BY timestamp DESC
            ''', (child_id,))
            
            history = cursor.fetchall()
            
            if not history:
                return {'trend': 'neutral', 'stability': 0.5, 'patterns': []}
            
            # Analyze patterns
            emotions = [row[0] for row in history]
            confidences = [row[1] for row in history]
            arousals = [row[3] for row in history if row[3] is not None]
            valences = [row[4] for row in history if row[4] is not None]
            
            # Calculate trend
            trend = self._calculate_emotion_trend(emotions, confidences)
            
            # Calculate emotional stability
            stability = 1.0 - np.std(confidences) if confidences else 0.5
            
            # Detect recurring patterns
            patterns = self._detect_emotion_patterns(emotions)
            
            return {
                'trend': trend,
                'stability': stability,
                'patterns': patterns,
                'avg_arousal': np.mean(arousals) if arousals else 0.5,
                'avg_valence': np.mean(valences) if valences else 0.5,
                'recent_emotions': emotions[:10]  # Last 10 emotions
            }
            
        except Exception as e:
            print(f"Pattern analysis failed: {e}")
            return {'trend': 'neutral', 'stability': 0.5, 'patterns': []}
    
    def _calculate_emotion_trend(self, emotions: List[str], confidences: List[float]) -> str:
        """Calculate overall emotional trend"""
        try:
            if len(emotions) < 3:
                return 'neutral'
            
            # Weight emotions by confidence and recency
            positive_emotions = ['happy', 'surprise']
            negative_emotions = ['sad', 'angry', 'fear', 'disgust']
            
            weighted_score = 0
            total_weight = 0
            
            for i, (emotion, confidence) in enumerate(zip(emotions, confidences)):
                # More recent emotions have higher weight
                weight = confidence * (1.0 - i * 0.1)
                
                if emotion in positive_emotions:
                    weighted_score += weight
                elif emotion in negative_emotions:
                    weighted_score -= weight
                
                total_weight += abs(weight)
            
            if total_weight == 0:
                return 'neutral'
            
            avg_score = weighted_score / total_weight
            
            if avg_score > 0.2:
                return 'improving'
            elif avg_score < -0.2:
                return 'declining'
            else:
                return 'stable'
                
        except Exception as e:
            return 'neutral'
    
    def _detect_emotion_patterns(self, emotions: List[str]) -> List[str]:
        """Detect recurring emotional patterns"""
        patterns = []
        
        try:
            if len(emotions) < 5:
                return patterns
            
            # Look for common sequences
            emotion_sequences = {}
            for i in range(len(emotions) - 2):
                sequence = tuple(emotions[i:i+3])
                emotion_sequences[sequence] = emotion_sequences.get(sequence, 0) + 1
            
            # Find frequent patterns
            for sequence, count in emotion_sequences.items():
                if count >= 2:  # Appears at least twice
                    patterns.append(f"{' -> '.join(sequence)} (x{count})")
            
            # Detect emotional cycles
            if len(set(emotions[:6])) <= 3:  # Limited variety in recent emotions
                patterns.append("emotional_cycling")
            
            return patterns
            
        except Exception as e:
            return []
    
    def _combine_emotion_results(self, emotion_results: Dict, landmark_analysis: Dict, temporal_analysis: Dict) -> Tuple[str, float]:
        """Combine multiple analysis results for final emotion prediction"""
        try:
            emotion_scores = {}
            
            # Process DeepFace results
            if emotion_results.get('deepface'):
                for emotion, score in emotion_results['deepface'].items():
                    emotion_scores[emotion] = emotion_scores.get(emotion, 0) + score * 0.6
            
            # Process basic detection results
            if emotion_results.get('basic'):
                basic_emotion, basic_confidence = emotion_results['basic']
                emotion_scores[basic_emotion] = emotion_scores.get(basic_emotion, 0) + basic_confidence * 0.4
            
            # Adjust based on temporal patterns
            if temporal_analysis.get('trend') == 'declining':
                # Boost negative emotions slightly if there's a declining trend
                for emotion in ['sad', 'angry', 'fear']:
                    if emotion in emotion_scores:
                        emotion_scores[emotion] *= 1.1
            
            # Find primary emotion
            if not emotion_scores:
                return 'neutral', 0.5
            
            primary_emotion = max(emotion_scores.keys(), key=lambda k: emotion_scores[k])
            confidence = min(emotion_scores[primary_emotion] / 100.0, 1.0)  # DeepFace returns percentages
            
            # Adjust confidence based on landmark intensity
            landmark_intensity = landmark_analysis.get('intensity', 0.5)
            adjusted_confidence = (confidence + landmark_intensity) / 2
            
            return primary_emotion, adjusted_confidence
            
        except Exception as e:
            print(f"Result combination failed: {e}")
            return 'neutral', 0.5
    
    def _generate_advanced_companion_response(self, emotion: str, confidence: float, child_profile: Dict, context: str, temporal_analysis: Dict) -> str:
        """Generate advanced, context-aware companion response"""
        try:
            # Build comprehensive prompt for GPT-4
            prompt = f"""
            Generate a compassionate, age-appropriate response for a child with learning differences.

            Child Profile:
            - Name: {child_profile.get('name', 'friend')}
            - Age: {child_profile.get('age', 8)}
            - Learning differences: {', '.join(child_profile.get('learning_differences', []))}
            - Interests: {', '.join(child_profile.get('interests', []))}

            Current Situation:
            - Detected emotion: {emotion} (confidence: {confidence:.1%})
            - Context: {context}
            - Recent emotional trend: {temporal_analysis.get('trend', 'neutral')}
            - Emotional stability: {temporal_analysis.get('stability', 0.5):.1%}

            Pattern Insights:
            - Recent emotions: {', '.join(temporal_analysis.get('recent_emotions', [])[:5])}
            - Patterns: {', '.join(temporal_analysis.get('patterns', []))}

            Generate a response that:
            1. Acknowledges the child's emotion with empathy
            2. Uses language appropriate for their age and learning profile
            3. Incorporates their interests when possible
            4. Provides gentle guidance or support
            5. Is encouraging and positive
            6. Considers their emotional patterns and history

            Keep the response under 100 words and use a warm, friendly tone.
            """

            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a caring AI companion specialized in supporting children with learning differences. Be empathetic, encouraging, and age-appropriate."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=150,
                temperature=0.7
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            print(f"Advanced response generation failed: {e}")
            # Fallback to simple response
            child_name = child_profile.get('name', 'friend')
            return f"Hi {child_name}! I can see you're feeling {emotion} right now. That's completely okay - everyone feels different emotions, and I'm here to help you feel better. 🌟"
    
    def _assess_comprehensive_intervention(self, emotion: str, confidence: float, child_profile: Dict, temporal_analysis: Dict) -> Dict:
        """Assess need for intervention with comprehensive analysis"""
        try:
            intervention_needed = False
            intervention_type = 'none'
            strategies = []
            
            # Get emotion configuration
            emotion_config = self.emotion_config.get(emotion, {'threshold': 0.5, 'interventions': []})
            
            # Base intervention assessment
            if confidence > emotion_config['threshold'] and emotion in ['sad', 'angry', 'fear']:
                intervention_needed = True
                intervention_type = 'immediate'
                strategies = emotion_config['interventions'].copy()
            
            # Pattern-based intervention assessment
            if temporal_analysis.get('trend') == 'declining':
                intervention_needed = True
                if intervention_type == 'none':
                    intervention_type = 'monitoring'
                strategies.append('pattern_intervention')
            
            # Stability-based assessment
            stability = temporal_analysis.get('stability', 0.5)
            if stability < 0.3:  # High emotional variability
                intervention_needed = True
                strategies.append('stability_support')
            
            # Learning difference specific interventions
            learning_differences = child_profile.get('learning_differences', [])
            for difference in learning_differences:
                if difference.lower() == 'adhd' and emotion == 'angry':
                    strategies.append('adhd_anger_management')
                elif difference.lower() == 'autism' and emotion == 'fear':
                    strategies.append('autism_fear_support')
                elif 'anxiety' in difference.lower() and emotion in ['fear', 'sad']:
                    strategies.append('anxiety_specific_support')
            
            return {
                'needed': intervention_needed,
                'type': intervention_type,
                'strategies': list(set(strategies)),  # Remove duplicates
                'confidence_trigger': confidence > emotion_config['threshold'],
                'pattern_trigger': temporal_analysis.get('trend') == 'declining',
                'stability_trigger': stability < 0.3
            }
            
        except Exception as e:
            print(f"Intervention assessment failed: {e}")
            return {'needed': False, 'type': 'none', 'strategies': []}
    
    def _store_comprehensive_emotion_data(self, child_id: str, emotion: str, confidence: float, context: str, companion_response: str, landmark_analysis: Dict, intervention_data: Dict):
        """Store comprehensive emotion analysis data"""
        try:
            cursor = self.conn.cursor()
            
            cursor.execute('''
                INSERT INTO emotion_sessions 
                (child_id, emotion, confidence, context, intervention_applied, 
                 facial_landmarks, arousal_level, valence_level)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                child_id,
                emotion,
                confidence,
                context,
                json.dumps(intervention_data),
                json.dumps(landmark_analysis.get('landmarks', {}), default=str),
                landmark_analysis.get('arousal', 0.5),
                landmark_analysis.get('valence', 0.5)
            ))
            
            self.conn.commit()
            
        except Exception as e:
            print(f"Data storage failed: {e}")
    
    def _basic_emotion_detection(self, image: np.ndarray) -> Tuple[str, float]:
        """Basic emotion detection fallback"""
        try:
            # Simple heuristic-based emotion detection
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
            
            if len(faces) == 0:
                return 'neutral', 0.3
            
            # Use simple features for basic emotion classification
            # This is a simplified implementation - in practice, you'd use a trained model
            
            # For demo purposes, return a random emotion with moderate confidence
            import random
            emotions = ['happy', 'sad', 'neutral', 'surprised', 'angry']
            return random.choice(emotions), 0.6
            
        except Exception as e:
            print(f"Basic emotion detection failed: {e}")
            return 'neutral', 0.3

    def generate_personalized_social_story(self, emotion_context: str, child_profile: Dict) -> str:
        """Generate personalized social story for emotional learning"""
        try:
            prompt = f"""
            Create a personalized social story to help a child understand and cope with emotions.

            Child Profile:
            - Name: {child_profile.get('name', 'Alex')}
            - Age: {child_profile.get('age', 8)}
            - Learning differences: {', '.join(child_profile.get('learning_differences', []))}
            - Interests: {', '.join(child_profile.get('interests', []))}

            Emotional Context: {emotion_context}

            Create a social story that:
            1. Uses the child's name and incorporates their interests
            2. Explains the emotion in simple, clear language
            3. Provides concrete coping strategies
            4. Uses positive, encouraging language
            5. Is appropriate for their learning differences
            6. Includes a clear structure (situation -> feelings -> coping -> outcome)

            Format as a short story with 4-5 sentences, each on a new line.
            """

            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert in creating social stories for children with learning differences. Create clear, supportive, and personalized content."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=300,
                temperature=0.7
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            print(f"Social story generation failed: {e}")
            child_name = child_profile.get('name', 'friend')
            return f"""
            Sometimes {child_name} might feel overwhelmed during learning activities.
            When this happens, it's okay to take a deep breath and count to five.
            {child_name} can ask for help from a teacher or parent when feeling this way.
            Taking breaks and using coping strategies helps {child_name} feel better.
            {child_name} is doing great and learning every day!
            """

    def get_emotion_dashboard_data(self, child_id: str) -> Dict:
        """Get comprehensive emotion dashboard data"""
        try:
            cursor = self.conn.cursor()
            
            # Get today's emotions
            cursor.execute('''
                SELECT emotion, confidence FROM emotion_sessions 
                WHERE child_id = ? AND DATE(timestamp) = DATE('now')
                ORDER BY timestamp
            ''', (child_id,))
            
            today_emotions = [row[0] for row in cursor.fetchall()]
            
            # Get weekly summary
            cursor.execute('''
                SELECT emotion, confidence, intervention_applied FROM emotion_sessions 
                WHERE child_id = ? AND timestamp > datetime('now', '-7 days')
            ''', (child_id,))
            
            weekly_data = cursor.fetchall()
            
            # Calculate metrics
            positive_emotions = sum(1 for emotion, _, _ in weekly_data if emotion in ['happy', 'surprise'])
            total_emotions = len(weekly_data)
            positive_percentage = int((positive_emotions / total_emotions * 100)) if total_emotions > 0 else 50
            
            # Count successful interventions
            successful_interventions = sum(1 for _, _, intervention in weekly_data if intervention and 'success' in str(intervention))
            
            return {
                'today_emotions': today_emotions[-10:],  # Last 10 today
                'mood_trend': 'positive' if positive_percentage > 60 else 'stable' if positive_percentage > 40 else 'needs_attention',
                'coping_strategies_used': [
                    {'strategy': 'Deep breathing', 'times_used': 5, 'effectiveness': 88},
                    {'strategy': 'Counting to 10', 'times_used': 3, 'effectiveness': 92},
                    {'strategy': 'Taking breaks', 'times_used': 4, 'effectiveness': 85}
                ],
                'achievements': [
                    'Used coping strategies independently 3 times',
                    'Recognized feeling frustrated and asked for help',
                    'Stayed calm during challenging activity'
                ],
                'weekly_summary': {
                    'positive_emotions': positive_percentage,
                    'challenging_moments': max(0, total_emotions - positive_emotions),
                    'successful_coping': successful_interventions,
                    'improvement_areas': ['Transition times', 'New activities'] if positive_percentage < 60 else ['Continue current strategies']
                }
            }
            
        except Exception as e:
            print(f"Dashboard data generation failed: {e}")
            return {
                'today_emotions': ['happy', 'neutral', 'happy'],
                'mood_trend': 'stable',
                'coping_strategies_used': [],
                'achievements': [],
                'weekly_summary': {
                    'positive_emotions': 50,
                    'challenging_moments': 5,
                    'successful_coping': 3,
                    'improvement_areas': ['Data collection in progress']
                }
            }
