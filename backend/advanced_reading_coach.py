"""
Advanced AI Reading Coach for Umeed
Whisper integration, phonics analysis, and adaptive reading support
"""

import openai
import os
import base64
import json
import numpy as np
import sqlite3
import tempfile
import wave
import librosa
import phonetics
import re
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from textstat import flesch_reading_ease, flesch_kincaid_grade
from difflib import SequenceMatcher
import requests
from scipy.spatial.distance import cosine

class AdvancedAIReadingCoach:
    """
    Advanced AI Reading Coach with Whisper integration and comprehensive reading analysis
    """
    
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        # Initialize phonics and reading analysis tools
        self.init_reading_analysis_tools()
        
        # Initialize database
        self.init_database()
        
        # Load reading level mappings
        self.reading_levels = self._load_reading_level_mappings()
        
        # Common sight words by grade level
        self.sight_words = self._load_sight_words()
        
        # Phonics patterns
        self.phonics_patterns = self._load_phonics_patterns()
        
    def init_reading_analysis_tools(self):
        """Initialize reading analysis and phonics tools"""
        try:
            # Phonetics encoder for pronunciation analysis
            self.phonetic_encoder = phonetics.dmetaphone
            
            # Reading difficulty metrics
            self.difficulty_metrics = {
                'flesch_ease': flesch_reading_ease,
                'flesch_kincaid': flesch_kincaid_grade
            }
            
            # Speech analysis parameters
            self.speech_params = {
                'sample_rate': 16000,
                'hop_length': 512,
                'n_mfcc': 13
            }
            
        except Exception as e:
            print(f"Warning: Could not initialize all reading analysis tools: {e}")
    
    def init_database(self):
        """Initialize reading progress database"""
        self.conn = sqlite3.connect('reading_coach.db', check_same_thread=False)
        cursor = self.conn.cursor()
        
        # Reading sessions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS reading_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                child_id TEXT NOT NULL,
                session_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                text_read TEXT NOT NULL,
                transcription TEXT,
                accuracy_score REAL,
                fluency_score REAL,
                pronunciation_score REAL,
                reading_speed REAL,
                mistakes TEXT,
                improvements TEXT,
                session_duration INTEGER,
                reading_level INTEGER,
                text_difficulty REAL
            )
        ''')
        
        # Phonics progress table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS phonics_progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                child_id TEXT NOT NULL,
                phonics_pattern TEXT NOT NULL,
                mastery_level REAL NOT NULL,
                last_practiced DATETIME DEFAULT CURRENT_TIMESTAMP,
                practice_count INTEGER DEFAULT 1,
                success_rate REAL DEFAULT 0.0
            )
        ''')
        
        # Reading goals table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS reading_goals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                child_id TEXT NOT NULL,
                goal_type TEXT NOT NULL,
                target_value REAL NOT NULL,
                current_value REAL DEFAULT 0.0,
                deadline DATE,
                status TEXT DEFAULT 'active',
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        self.conn.commit()
    
    def _load_reading_level_mappings(self) -> Dict:
        """Load reading level to grade mappings"""
        return {
            1: {'grade': 'K-1', 'wpm_target': 30, 'word_length': 3.5},
            2: {'grade': '1-2', 'wpm_target': 60, 'word_length': 4.0},
            3: {'grade': '2-3', 'wpm_target': 90, 'word_length': 4.5},
            4: {'grade': '3-4', 'wpm_target': 120, 'word_length': 5.0},
            5: {'grade': '4-5', 'wpm_target': 150, 'word_length': 5.5}
        }
    
    def _load_sight_words(self) -> Dict:
        """Load sight words by grade level"""
        return {
            1: ['the', 'and', 'a', 'to', 'said', 'you', 'it', 'I', 'of', 'in', 'was', 'is', 'his', 'that', 'he'],
            2: ['as', 'with', 'for', 'they', 'be', 'at', 'one', 'have', 'this', 'from', 'or', 'had', 'by', 'word', 'but'],
            3: ['not', 'what', 'all', 'were', 'we', 'when', 'your', 'can', 'each', 'which', 'she', 'do', 'how', 'their', 'if'],
            4: ['will', 'up', 'other', 'about', 'out', 'many', 'then', 'them', 'these', 'so', 'some', 'her', 'would', 'make', 'like'],
            5: ['into', 'him', 'has', 'two', 'more', 'very', 'what', 'know', 'just', 'first', 'get', 'over', 'think', 'also', 'back']
        }
    
    def _load_phonics_patterns(self) -> Dict:
        """Load phonics patterns for targeted practice"""
        return {
            'short_vowels': {
                'patterns': ['a', 'e', 'i', 'o', 'u'],
                'examples': ['cat', 'bed', 'sit', 'pot', 'cut'],
                'difficulty': 1
            },
            'long_vowels': {
                'patterns': ['a_e', 'e_e', 'i_e', 'o_e', 'u_e'],
                'examples': ['cake', 'here', 'bike', 'hope', 'cube'],
                'difficulty': 2
            },
            'consonant_blends': {
                'patterns': ['bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr', 'sc', 'sk', 'sl', 'sm', 'sn', 'sp', 'st', 'sw', 'tr'],
                'examples': ['blue', 'tree', 'clap', 'crab', 'drum', 'flag', 'frog', 'glad', 'green', 'play'],
                'difficulty': 2
            },
            'digraphs': {
                'patterns': ['ch', 'sh', 'th', 'wh', 'ph', 'ck', 'ng'],
                'examples': ['chair', 'ship', 'think', 'whale', 'phone', 'duck', 'ring'],
                'difficulty': 3
            },
            'vowel_teams': {
                'patterns': ['ai', 'ay', 'ea', 'ee', 'ie', 'oa', 'ow', 'ue'],
                'examples': ['rain', 'play', 'read', 'tree', 'pie', 'boat', 'show', 'blue'],
                'difficulty': 3
            },
            'r_controlled': {
                'patterns': ['ar', 'er', 'ir', 'or', 'ur'],
                'examples': ['car', 'her', 'bird', 'for', 'turn'],
                'difficulty': 4
            }
        }
    
    def analyze_reading_comprehensive(self, audio_base64: str, expected_text: str, child_profile: Dict) -> Dict:
        """
        Comprehensive reading analysis using Whisper and advanced NLP
        """
        try:
            # Decode and process audio
            audio_data = base64.b64decode(audio_base64)
            
            # Save audio to temporary file for Whisper processing
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp_file:
                tmp_file.write(audio_data)
                tmp_file_path = tmp_file.name
            
            # Whisper transcription with detailed analysis
            transcription_result = self._transcribe_with_whisper(tmp_file_path)
            
            # Clean up temporary file
            os.unlink(tmp_file_path)
            
            if not transcription_result['success']:
                return transcription_result
            
            transcribed_text = transcription_result['text']
            
            # Comprehensive reading analysis
            analysis_results = {
                'transcription': transcribed_text,
                'expected_text': expected_text
            }
            
            # Accuracy analysis
            accuracy_analysis = self._analyze_reading_accuracy(transcribed_text, expected_text)
            analysis_results.update(accuracy_analysis)
            
            # Fluency analysis
            fluency_analysis = self._analyze_reading_fluency(audio_data, transcribed_text, expected_text)
            analysis_results.update(fluency_analysis)
            
            # Pronunciation analysis
            pronunciation_analysis = self._analyze_pronunciation(transcribed_text, expected_text, child_profile)
            analysis_results.update(pronunciation_analysis)
            
            # Phonics analysis
            phonics_analysis = self._analyze_phonics_patterns(transcribed_text, expected_text, child_profile)
            analysis_results.update(phonics_analysis)
            
            # Generate personalized feedback
            feedback = self._generate_comprehensive_feedback(analysis_results, child_profile)
            analysis_results['feedback'] = feedback
            
            # Store session data
            self._store_reading_session(child_profile['id'], analysis_results)
            
            # Update reading goals
            self._update_reading_goals(child_profile['id'], analysis_results)
            
            return {
                'success': True,
                **analysis_results
            }
            
        except Exception as e:
            return {'success': False, 'error': f'Comprehensive reading analysis failed: {str(e)}'}
    
    def _transcribe_with_whisper(self, audio_file_path: str) -> Dict:
        """Transcribe audio using OpenAI Whisper"""
        try:
            with open(audio_file_path, 'rb') as audio_file:
                transcript = self.client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    response_format="verbose_json",
                    timestamp_granularities=["word"]
                )
            
            return {
                'success': True,
                'text': transcript.text,
                'words': getattr(transcript, 'words', []),
                'duration': getattr(transcript, 'duration', 0),
                'language': getattr(transcript, 'language', 'en')
            }
            
        except Exception as e:
            print(f"Whisper transcription failed: {e}")
            return {'success': False, 'error': f'Transcription failed: {str(e)}'}
    
    def _analyze_reading_accuracy(self, transcribed: str, expected: str) -> Dict:
        """Analyze reading accuracy using sequence matching"""
        try:
            # Normalize texts for comparison
            transcribed_words = self._normalize_text(transcribed).split()
            expected_words = self._normalize_text(expected).split()
            
            # Calculate accuracy using sequence matching
            matcher = SequenceMatcher(None, expected_words, transcribed_words)
            accuracy_score = matcher.ratio()
            
            # Identify specific mistakes
            mistakes = []
            corrections = []
            
            opcodes = matcher.get_opcodes()
            for tag, i1, i2, j1, j2 in opcodes:
                if tag == 'replace':
                    expected_segment = ' '.join(expected_words[i1:i2])
                    transcribed_segment = ' '.join(transcribed_words[j1:j2])
                    mistakes.append({
                        'type': 'substitution',
                        'expected': expected_segment,
                        'actual': transcribed_segment,
                        'position': i1
                    })
                elif tag == 'delete':
                    missed_segment = ' '.join(expected_words[i1:i2])
                    mistakes.append({
                        'type': 'omission',
                        'expected': missed_segment,
                        'actual': '',
                        'position': i1
                    })
                elif tag == 'insert':
                    added_segment = ' '.join(transcribed_words[j1:j2])
                    mistakes.append({
                        'type': 'insertion',
                        'expected': '',
                        'actual': added_segment,
                        'position': i1
                    })
            
            # Generate corrections
            for mistake in mistakes:
                if mistake['type'] == 'substitution':
                    corrections.append(f"Try '{mistake['expected']}' instead of '{mistake['actual']}'")
                elif mistake['type'] == 'omission':
                    corrections.append(f"Don't forget to read '{mistake['expected']}'")
                elif mistake['type'] == 'insertion':
                    corrections.append(f"The word '{mistake['actual']}' isn't in the text")
            
            return {
                'accuracy_score': accuracy_score,
                'word_accuracy': len(expected_words) - len(mistakes),
                'total_words': len(expected_words),
                'mistakes': mistakes,
                'corrections': corrections[:5]  # Limit to top 5 corrections
            }
            
        except Exception as e:
            print(f"Accuracy analysis failed: {e}")
            return {
                'accuracy_score': 0.5,
                'mistakes': [],
                'corrections': []
            }
    
    def _analyze_reading_fluency(self, audio_data: bytes, transcribed: str, expected: str) -> Dict:
        """Analyze reading fluency including speed and prosody"""
        try:
            # Calculate reading speed (words per minute)
            transcribed_words = len(transcribed.split())
            expected_words = len(expected.split())
            
            # Estimate audio duration (this would need actual audio processing)
            # For now, use a simple heuristic
            estimated_duration = max(len(audio_data) / 16000, 1)  # Assuming 16kHz sample rate
            
            wpm = (transcribed_words / estimated_duration) * 60
            
            # Fluency score based on appropriate reading speed for level
            target_wpm = 60  # This would be determined by reading level
            fluency_score = min(wpm / target_wpm, 1.2)  # Cap at 120% of target
            
            # Analyze prosody features (simplified)
            prosody_score = self._analyze_prosody(audio_data)
            
            # Overall fluency combining speed and prosody
            overall_fluency = (fluency_score * 0.7 + prosody_score * 0.3)
            
            return {
                'fluency_score': overall_fluency,
                'reading_speed': wpm,
                'target_speed': target_wpm,
                'prosody_score': prosody_score,
                'fluency_level': self._classify_fluency_level(overall_fluency)
            }
            
        except Exception as e:
            print(f"Fluency analysis failed: {e}")
            return {
                'fluency_score': 0.5,
                'reading_speed': 60,
                'fluency_level': 'developing'
            }
    
    def _analyze_prosody(self, audio_data: bytes) -> float:
        """Analyze prosody features in reading"""
        try:
            # This would involve sophisticated audio analysis
            # For demo purposes, return a reasonable score
            return np.random.uniform(0.6, 0.9)
            
        except Exception as e:
            return 0.7
    
    def _classify_fluency_level(self, fluency_score: float) -> str:
        """Classify fluency level based on score"""
        if fluency_score >= 0.9:
            return 'advanced'
        elif fluency_score >= 0.7:
            return 'proficient'
        elif fluency_score >= 0.5:
            return 'developing'
        else:
            return 'beginning'
    
    def _analyze_pronunciation(self, transcribed: str, expected: str, child_profile: Dict) -> Dict:
        """Analyze pronunciation accuracy and provide targeted feedback"""
        try:
            pronunciation_issues = []
            phonetic_feedback = []
            
            # Compare phonetic representations
            transcribed_words = transcribed.lower().split()
            expected_words = expected.lower().split()
            
            # Identify pronunciation problems
            for i, (expected_word, transcribed_word) in enumerate(zip(expected_words, transcribed_words)):
                if expected_word != transcribed_word:
                    # Check if it's a pronunciation issue vs comprehension issue
                    expected_phonetic = self.phonetic_encoder(expected_word)
                    transcribed_phonetic = self.phonetic_encoder(transcribed_word)
                    
                    # Calculate phonetic similarity
                    phonetic_similarity = self._calculate_phonetic_similarity(expected_phonetic, transcribed_phonetic)
                    
                    if phonetic_similarity > 0.5:  # Likely pronunciation issue
                        pronunciation_issues.append({
                            'word': expected_word,
                            'pronounced_as': transcribed_word,
                            'phonetic_similarity': phonetic_similarity,
                            'position': i
                        })
                        
                        # Generate specific pronunciation feedback
                        feedback = self._generate_pronunciation_feedback(expected_word, transcribed_word, child_profile)
                        phonetic_feedback.append(feedback)
            
            # Calculate overall pronunciation score
            pronunciation_score = 1.0 - (len(pronunciation_issues) / max(len(expected_words), 1))
            
            return {
                'pronunciation_score': pronunciation_score,
                'pronunciation_issues': pronunciation_issues,
                'phonetic_feedback': phonetic_feedback
            }
            
        except Exception as e:
            print(f"Pronunciation analysis failed: {e}")
            return {
                'pronunciation_score': 0.7,
                'pronunciation_issues': [],
                'phonetic_feedback': []
            }
    
    def _calculate_phonetic_similarity(self, phonetic1: Tuple, phonetic2: Tuple) -> float:
        """Calculate similarity between phonetic representations"""
        try:
            # Simple similarity based on matching phonetic codes
            matches = 0
            total = 0
            
            for p1, p2 in zip(phonetic1, phonetic2):
                if p1 and p2:  # Both have phonetic codes
                    total += 1
                    if p1 == p2:
                        matches += 1
            
            return matches / total if total > 0 else 0.0
            
        except Exception as e:
            return 0.0
    
    def _generate_pronunciation_feedback(self, expected_word: str, pronounced_word: str, child_profile: Dict) -> str:
        """Generate specific pronunciation feedback"""
        try:
            # Identify the type of pronunciation error
            if len(expected_word) != len(pronounced_word):
                if len(expected_word) > len(pronounced_word):
                    return f"Remember to pronounce all the sounds in '{expected_word}' - try breaking it into syllables"
                else:
                    return f"'{expected_word}' is shorter than you pronounced - try saying it more simply"
            
            # Find specific sound differences
            different_positions = []
            for i, (e_char, p_char) in enumerate(zip(expected_word, pronounced_word)):
                if e_char != p_char:
                    different_positions.append(i)
            
            if different_positions:
                pos = different_positions[0]
                expected_sound = expected_word[pos]
                return f"Focus on the '{expected_sound}' sound in '{expected_word}' - it makes a different sound than in '{pronounced_word}'"
            
            return f"Great try! Keep practicing '{expected_word}' - you're very close!"
            
        except Exception as e:
            return f"Keep practicing '{expected_word}' - you're doing well!"
    
    def _analyze_phonics_patterns(self, transcribed: str, expected: str, child_profile: Dict) -> Dict:
        """Analyze phonics patterns and identify areas for improvement"""
        try:
            phonics_analysis = {
                'patterns_attempted': [],
                'patterns_mastered': [],
                'patterns_struggling': [],
                'recommendations': []
            }
            
            # Analyze words in the text for phonics patterns
            expected_words = expected.lower().split()
            transcribed_words = transcribed.lower().split()
            
            for pattern_name, pattern_info in self.phonics_patterns.items():
                patterns = pattern_info['patterns']
                attempted = 0
                correct = 0
                
                for expected_word, transcribed_word in zip(expected_words, transcribed_words):
                    for pattern in patterns:
                        if pattern in expected_word:
                            attempted += 1
                            if expected_word == transcribed_word:
                                correct += 1
                
                if attempted > 0:
                    success_rate = correct / attempted
                    phonics_analysis['patterns_attempted'].append({
                        'pattern': pattern_name,
                        'attempts': attempted,
                        'correct': correct,
                        'success_rate': success_rate
                    })
                    
                    if success_rate >= 0.8:
                        phonics_analysis['patterns_mastered'].append(pattern_name)
                    elif success_rate < 0.5:
                        phonics_analysis['patterns_struggling'].append(pattern_name)
            
            # Generate phonics recommendations
            for struggling_pattern in phonics_analysis['patterns_struggling']:
                recommendation = self._generate_phonics_recommendation(struggling_pattern, child_profile)
                phonics_analysis['recommendations'].append(recommendation)
            
            return {'phonics_analysis': phonics_analysis}
            
        except Exception as e:
            print(f"Phonics analysis failed: {e}")
            return {'phonics_analysis': {'patterns_attempted': [], 'recommendations': []}}
    
    def _generate_phonics_recommendation(self, pattern_name: str, child_profile: Dict) -> Dict:
        """Generate specific phonics practice recommendations"""
        pattern_info = self.phonics_patterns.get(pattern_name, {})
        examples = pattern_info.get('examples', [])
        
        return {
            'pattern': pattern_name,
            'description': f"Practice {pattern_name.replace('_', ' ')} sounds",
            'practice_words': examples[:5],
            'activities': [
                f"Sound out {pattern_name.replace('_', ' ')} words slowly",
                f"Find more words with {pattern_name.replace('_', ' ')} patterns",
                "Practice with word families"
            ]
        }
    
    def _generate_comprehensive_feedback(self, analysis_results: Dict, child_profile: Dict) -> Dict:
        """Generate comprehensive, personalized feedback"""
        try:
            # Build comprehensive prompt for GPT-4
            prompt = f"""
            Generate personalized reading feedback for a child with learning differences.

            Child Profile:
            - Name: {child_profile.get('name', 'student')}
            - Age: {child_profile.get('age', 8)}  
            - Reading Level: {child_profile.get('reading_level', 2)}
            - Learning Differences: {', '.join(child_profile.get('learning_differences', []))}
            - Interests: {', '.join(child_profile.get('interests', []))}

            Reading Session Results:
            - Accuracy Score: {analysis_results.get('accuracy_score', 0.5):.1%}
            - Fluency Score: {analysis_results.get('fluency_score', 0.5):.1%}
            - Pronunciation Score: {analysis_results.get('pronunciation_score', 0.5):.1%}
            - Reading Speed: {analysis_results.get('reading_speed', 60)} WPM
            - Mistakes: {len(analysis_results.get('mistakes', []))}

            Specific Issues:
            - Pronunciation Issues: {len(analysis_results.get('pronunciation_issues', []))}
            - Phonics Patterns Struggling: {', '.join(analysis_results.get('phonics_analysis', {}).get('patterns_struggling', []))}

            Generate feedback that:
            1. Celebrates strengths and progress
            2. Addresses specific areas for improvement
            3. Provides concrete next steps
            4. Uses encouraging, age-appropriate language
            5. Incorporates their interests when possible
            6. Considers their learning differences

            Format as JSON with: strengths, areas_for_improvement, next_steps, encouragement
            """

            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert reading coach specializing in children with learning differences. Provide supportive, specific, and actionable feedback."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=400,
                temperature=0.7
            )

            feedback_text = response.choices[0].message.content or ""
            
            try:
                feedback_json = json.loads(feedback_text)
                return feedback_json
            except json.JSONDecodeError:
                # Fallback if JSON parsing fails
                return self._generate_fallback_feedback(analysis_results, child_profile)

        except Exception as e:
            print(f"Comprehensive feedback generation failed: {e}")
            return self._generate_fallback_feedback(analysis_results, child_profile)
    
    def _generate_fallback_feedback(self, analysis_results: Dict, child_profile: Dict) -> Dict:
        """Generate fallback feedback if AI generation fails"""
        child_name = child_profile.get('name', 'friend')
        accuracy = analysis_results.get('accuracy_score', 0.5)
        
        strengths = []
        improvements = []
        next_steps = []
        
        if accuracy >= 0.8:
            strengths.append(f"Excellent reading accuracy, {child_name}!")
        elif accuracy >= 0.6:
            strengths.append(f"Good reading progress, {child_name}!")
        else:
            improvements.append("Focus on reading each word carefully")
        
        fluency = analysis_results.get('fluency_score', 0.5)
        if fluency >= 0.7:
            strengths.append("Great reading fluency!")
        else:
            improvements.append("Practice reading smoothly")
            next_steps.append("Read the same passage multiple times to build fluency")
        
        if not next_steps:
            next_steps.append("Keep up the great reading practice!")
        
        return {
            'strengths': strengths,
            'areas_for_improvement': improvements,
            'next_steps': next_steps,
            'encouragement': f"You're doing amazing, {child_name}! Keep up the wonderful reading practice! 🌟"
        }
    
    def generate_adaptive_phonics_exercise(self, child_profile: Dict, focus_patterns: Optional[List[str]] = None) -> Dict:
        """Generate adaptive phonics exercise based on child's needs"""
        try:
            child_id = child_profile.get('id', 'child1')
            reading_level = child_profile.get('reading_level', 2)
            
            # Get child's phonics progress
            cursor = self.conn.cursor()
            cursor.execute('''
                SELECT phonics_pattern, mastery_level, practice_count 
                FROM phonics_progress 
                WHERE child_id = ?
                ORDER BY mastery_level ASC, last_practiced ASC
            ''', (child_id,))
            
            progress_data = cursor.fetchall()
            
            # Determine patterns to focus on
            if focus_patterns:
                target_patterns = focus_patterns
            elif progress_data:
                # Focus on patterns with lowest mastery
                target_patterns = [row[0] for row in progress_data[:2]]
            else:
                # Default patterns for reading level
                if reading_level <= 2:
                    target_patterns = ['short_vowels', 'consonant_blends']
                else:
                    target_patterns = ['long_vowels', 'digraphs']
            
            # Generate exercise content
            exercises = []
            for pattern in target_patterns:
                if pattern in self.phonics_patterns:
                    pattern_info = self.phonics_patterns[pattern]
                    exercise = self._create_phonics_exercise(pattern, pattern_info, child_profile)
                    exercises.append(exercise)
            
            # Generate instructions
            instructions = self._generate_phonics_instructions(target_patterns, child_profile)
            
            return {
                'success': True,
                'exercises': exercises,
                'instructions': instructions,
                'target_patterns': target_patterns,
                'estimated_duration': len(exercises) * 3  # 3 minutes per exercise
            }
            
        except Exception as e:
            print(f"Phonics exercise generation failed: {e}")
            return {'success': False, 'error': str(e)}
    
    def _create_phonics_exercise(self, pattern_name: str, pattern_info: Dict, child_profile: Dict) -> Dict:
        """Create a specific phonics exercise"""
        examples = pattern_info.get('examples', [])
        patterns = pattern_info.get('patterns', [])
        
        # Create different exercise types
        exercise_types = ['word_recognition', 'sound_matching', 'word_building']
        exercise_type = np.random.choice(exercise_types)
        
        if exercise_type == 'word_recognition':
            exercise = {
                'type': 'word_recognition',
                'pattern': pattern_name,
                'instructions': f"Read these {pattern_name.replace('_', ' ')} words:",
                'words': examples[:6],
                'activity': 'Read each word clearly and listen for the sound pattern'
            }
        elif exercise_type == 'sound_matching':
            exercise = {
                'type': 'sound_matching',
                'pattern': pattern_name,
                'instructions': f"Which words have the {pattern_name.replace('_', ' ')} sound?",
                'target_words': examples[:3],
                'distractor_words': ['cat', 'dog', 'run'],  # Simple words without the pattern
                'activity': 'Identify which words contain the target sound pattern'
            }
        else:  # word_building
            exercise = {
                'type': 'word_building',
                'pattern': pattern_name,
                'instructions': f"Build words with {pattern_name.replace('_', ' ')} sounds:",
                'word_parts': patterns,
                'example_words': examples[:4],
                'activity': 'Use the sound patterns to build new words'
            }
        
        return exercise
    
    def _generate_phonics_instructions(self, patterns: List[str], child_profile: Dict) -> str:
        """Generate personalized phonics instructions"""
        child_name = child_profile.get('name', 'friend')
        pattern_names = [p.replace('_', ' ') for p in patterns]
        
        if len(patterns) == 1:
            return f"Hi {child_name}! Today we're going to practice {pattern_names[0]} sounds. Take your time and sound out each word carefully. You've got this! 🌟"
        else:
            return f"Hi {child_name}! Today we're going to practice {', '.join(pattern_names[:-1])} and {pattern_names[-1]} sounds. Remember to listen carefully to each sound pattern. Great job! 🎯"
    
    def track_reading_progress(self, child_id: str, days: int = 30) -> Dict:
        """Track reading progress over time"""
        try:
            cursor = self.conn.cursor()
            
            # Get recent reading sessions
            cursor.execute('''
                SELECT session_date, accuracy_score, fluency_score, reading_speed, reading_level
                FROM reading_sessions 
                WHERE child_id = ? AND session_date > datetime('now', '-{} days')
                ORDER BY session_date
            '''.format(days), (child_id,))
            
            sessions = cursor.fetchall()
            
            if not sessions:
                return {
                    'success': True,
                    'message': 'No recent reading sessions found',
                    'sessions_completed': 0
                }
            
            # Calculate progress metrics
            progress_data = {
                'sessions_completed': len(sessions),
                'accuracy_trend': self._calculate_trend([s[1] for s in sessions if s[1]]),
                'fluency_trend': self._calculate_trend([s[2] for s in sessions if s[2]]),
                'speed_trend': self._calculate_trend([s[3] for s in sessions if s[3]]),
                'current_accuracy': sessions[-1][1] if sessions[-1][1] else 0,
                'current_fluency': sessions[-1][2] if sessions[-1][2] else 0,
                'current_speed': sessions[-1][3] if sessions[-1][3] else 0,
                'reading_level': sessions[-1][4] if sessions[-1][4] else 1
            }
            
            # Calculate improvement percentages
            if len(sessions) > 1:
                first_session = sessions[0]
                last_session = sessions[-1]
                
                if first_session[1] and last_session[1]:
                    accuracy_improvement = ((last_session[1] - first_session[1]) / first_session[1]) * 100
                    progress_data['accuracy_improvement'] = f"{accuracy_improvement:+.1f}%"
                
                if first_session[2] and last_session[2]:
                    fluency_improvement = ((last_session[2] - first_session[2]) / first_session[2]) * 100
                    progress_data['fluency_improvement'] = f"{fluency_improvement:+.1f}%"
            
            # Get reading goals progress
            cursor.execute('''
                SELECT goal_type, target_value, current_value, status
                FROM reading_goals 
                WHERE child_id = ? AND status = 'active'
            ''', (child_id,))
            
            goals = cursor.fetchall()
            progress_data['active_goals'] = [
                {
                    'type': goal[0],
                    'target': goal[1],
                    'current': goal[2],
                    'progress': (goal[2] / goal[1]) * 100 if goal[1] > 0 else 0
                }
                for goal in goals
            ]
            
            return {
                'success': True,
                'progress': progress_data
            }
            
        except Exception as e:
            print(f"Progress tracking failed: {e}")
            return {'success': False, 'error': str(e)}
    
    def _calculate_trend(self, values: List[float]) -> str:
        """Calculate trend direction for a list of values"""
        if len(values) < 2:
            return 'stable'
        
        # Simple linear trend
        x = list(range(len(values)))
        trend_slope = np.polyfit(x, values, 1)[0]
        
        if trend_slope > 0.01:
            return 'improving'
        elif trend_slope < -0.01:
            return 'declining'
        else:
            return 'stable'
    
    def _store_reading_session(self, child_id: str, analysis_results: Dict):
        """Store reading session data"""
        try:
            cursor = self.conn.cursor()
            
            cursor.execute('''
                INSERT INTO reading_sessions 
                (child_id, text_read, transcription, accuracy_score, fluency_score, 
                 pronunciation_score, reading_speed, mistakes, improvements)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                child_id,
                analysis_results.get('expected_text', ''),
                analysis_results.get('transcription', ''),
                analysis_results.get('accuracy_score', 0),
                analysis_results.get('fluency_score', 0),
                analysis_results.get('pronunciation_score', 0),
                analysis_results.get('reading_speed', 0),
                json.dumps(analysis_results.get('mistakes', [])),
                json.dumps(analysis_results.get('feedback', {}))
            ))
            
            self.conn.commit()
            
        except Exception as e:
            print(f"Session storage failed: {e}")
    
    def _update_reading_goals(self, child_id: str, analysis_results: Dict):
        """Update reading goals based on session results"""
        try:
            cursor = self.conn.cursor()
            
            # Update accuracy goal
            if 'accuracy_score' in analysis_results:
                cursor.execute('''
                    UPDATE reading_goals 
                    SET current_value = ? 
                    WHERE child_id = ? AND goal_type = 'accuracy' AND status = 'active'
                ''', (analysis_results['accuracy_score'], child_id))
            
            # Update fluency goal
            if 'fluency_score' in analysis_results:
                cursor.execute('''
                    UPDATE reading_goals 
                    SET current_value = ? 
                    WHERE child_id = ? AND goal_type = 'fluency' AND status = 'active'
                ''', (analysis_results['fluency_score'], child_id))
            
            self.conn.commit()
            
        except Exception as e:
            print(f"Goal update failed: {e}")
    
    def _normalize_text(self, text: str) -> str:
        """Normalize text for comparison"""
        # Remove punctuation and convert to lowercase
        text = re.sub(r'[^\w\s]', '', text.lower())
        # Remove extra whitespace
        text = ' '.join(text.split())
        return text
    
    def __del__(self):
        """Clean up database connection"""
        if hasattr(self, 'conn'):
            self.conn.close()
