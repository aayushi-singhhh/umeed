"""
AI Reading Coach 2.0 - Advanced reading support with real-time feedback
Uses OpenAI Whisper for speech recognition and GPT-4 for personalized feedback
"""

import openai
import os
import base64
import io
import json
import re
from typing import List, Dict, Tuple
from gtts import gTTS
import tempfile
import librosa
import numpy as np
from scipy.spatial.distance import cosine
import phonetics

class AIReadingCoach:
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.phonetic_encoder = phonetics.dmetaphone
        
    def analyze_reading_audio(self, audio_base64: str, expected_text: str, child_profile: Dict) -> Dict:
        """
        Analyze child's reading audio using Whisper and provide detailed feedback
        """
        try:
            # Decode base64 audio
            audio_data = base64.b64decode(audio_base64)
            
            # Create temporary file for Whisper
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_audio:
                temp_audio.write(audio_data)
                temp_audio_path = temp_audio.name
            
            # Transcribe with Whisper
            with open(temp_audio_path, 'rb') as audio_file:
                transcript = self.client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    response_format="verbose_json",
                    timestamp_granularities=["word"]
                )
            
            # Clean up temp file
            os.unlink(temp_audio_path)
            
            # Analyze pronunciation and fluency
            analysis = self._analyze_pronunciation(
                transcript.text, 
                expected_text, 
                transcript.words if hasattr(transcript, 'words') else [],
                child_profile
            )
            
            # Generate personalized feedback
            feedback = self._generate_personalized_feedback(analysis, child_profile)
            
            return {
                'success': True,
                'transcription': transcript.text,
                'analysis': analysis,
                'feedback': feedback,
                'next_exercises': self._generate_targeted_exercises(analysis, child_profile)
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f"Reading analysis failed: {str(e)}"
            }
    
    def _analyze_pronunciation(self, spoken_text: str, expected_text: str, word_timestamps: List, child_profile: Dict) -> Dict:
        """
        Analyze pronunciation accuracy and reading fluency
        """
        spoken_words = spoken_text.lower().split()
        expected_words = expected_text.lower().split()
        
        # Word-level accuracy
        word_accuracy = []
        mispronounced_words = []
        
        for i, (spoken, expected) in enumerate(zip(spoken_words, expected_words)):
            # Use phonetic comparison for pronunciation analysis
            spoken_phonetic = self.phonetic_encoder(spoken)
            expected_phonetic = self.phonetic_encoder(expected)
            
            is_correct = (spoken == expected) or (spoken_phonetic[0] == expected_phonetic[0])
            word_accuracy.append(is_correct)
            
            if not is_correct:
                mispronounced_words.append({
                    'word': expected,
                    'spoken_as': spoken,
                    'position': i,
                    'phonetic_target': expected_phonetic[0],
                    'phonetic_spoken': spoken_phonetic[0]
                })
        
        # Calculate reading speed (words per minute)
        total_duration = word_timestamps[-1]['end'] - word_timestamps[0]['start'] if word_timestamps else 60
        wpm = len(spoken_words) / (total_duration / 60) if total_duration > 0 else 0
        
        # Identify common error patterns based on learning disability
        error_patterns = self._identify_error_patterns(mispronounced_words, child_profile)
        
        return {
            'overall_accuracy': sum(word_accuracy) / len(word_accuracy) if word_accuracy else 0,
            'words_per_minute': wpm,
            'mispronounced_words': mispronounced_words,
            'error_patterns': error_patterns,
            'fluency_score': self._calculate_fluency_score(word_timestamps),
            'confidence_level': self._assess_confidence(word_timestamps)
        }
    
    def _identify_error_patterns(self, mispronounced_words: List[Dict], child_profile: Dict) -> List[str]:
        """
        Identify specific error patterns based on child's learning disability
        """
        patterns = []
        learning_differences = child_profile.get('learning_differences', [])
        
        if 'Dyslexia' in learning_differences:
            # Common dyslexic patterns
            for word_error in mispronounced_words:
                word = word_error['word']
                spoken = word_error['spoken_as']
                
                if self._has_letter_reversal(word, spoken):
                    patterns.append('letter_reversal')
                if self._has_phoneme_substitution(word, spoken):
                    patterns.append('phoneme_substitution')
                if len(spoken) < len(word):
                    patterns.append('syllable_omission')
        
        if 'ADHD' in learning_differences:
            # ADHD-related reading patterns
            if len(mispronounced_words) > len(child_profile.get('expected_words', [])) * 0.3:
                patterns.append('attention_lapses')
        
        return list(set(patterns))
    
    def _generate_personalized_feedback(self, analysis: Dict, child_profile: Dict) -> Dict:
        """
        Generate personalized, encouraging feedback using GPT-4
        """
        prompt = f"""
        You are a warm, encouraging reading coach for a {child_profile.get('age', 8)}-year-old child with {', '.join(child_profile.get('learning_differences', []))}.
        
        Reading Analysis:
        - Overall accuracy: {analysis['overall_accuracy']:.1%}
        - Reading speed: {analysis['words_per_minute']:.1f} words per minute
        - Mispronounced words: {len(analysis['mispronounced_words'])}
        - Error patterns: {', '.join(analysis['error_patterns'])}
        
        Child's interests: {', '.join(child_profile.get('interests', []))}
        
        Provide encouraging, specific feedback in a child-friendly tone that:
        1. Celebrates what they did well
        2. Addresses specific areas for improvement
        3. Connects to their interests when possible
        4. Provides 2-3 specific practice strategies
        
        Format as JSON with: celebration, areas_to_work_on, practice_strategies, encouragement
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=500
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            return {
                'celebration': "Great job reading! You're getting stronger every day! 🌟",
                'areas_to_work_on': ["Keep practicing those tricky words!"],
                'practice_strategies': ["Read aloud for 10 minutes daily", "Sound out words slowly"],
                'encouragement': "You're doing amazing! Every reader needs practice! 📚✨"
            }
    
    def _generate_targeted_exercises(self, analysis: Dict, child_profile: Dict) -> List[Dict]:
        """
        Generate personalized reading exercises based on identified needs
        """
        exercises = []
        error_patterns = analysis.get('error_patterns', [])
        interests = child_profile.get('interests', ['animals'])
        
        # Generate exercises based on error patterns
        if 'letter_reversal' in error_patterns:
            exercises.append({
                'type': 'letter_discrimination',
                'title': f'Letter Detective with {interests[0].title()}!',
                'description': f'Find the correct letters in words about {interests[0]}',
                'difficulty': 'beginner',
                'estimated_time': 5
            })
        
        if 'phoneme_substitution' in error_patterns:
            exercises.append({
                'type': 'phonics_practice',
                'title': f'Sound Safari with {interests[0].title()}!',
                'description': f'Practice letter sounds with {interests[0]} words',
                'difficulty': 'intermediate',
                'estimated_time': 8
            })
        
        # Always include a fluency exercise
        exercises.append({
            'type': 'fluency_builder',
            'title': f'{interests[0].title()} Reading Race!',
            'description': f'Read fun stories about {interests[0]} to build speed',
            'difficulty': 'appropriate',
            'estimated_time': 10
        })
        
        return exercises
    
    def generate_adaptive_phonics_exercise(self, error_patterns: List[str], interests: List[str], difficulty: str) -> Dict:
        """
        Generate a specific phonics exercise using GPT-4
        """
        prompt = f"""
        Create a fun phonics exercise for a child who loves {', '.join(interests)} and needs help with {', '.join(error_patterns)}.
        
        Difficulty: {difficulty}
        
        Create a JSON response with:
        - title: Fun, engaging title
        - instructions: Simple, clear instructions
        - word_pairs: 5 pairs of [correct_word, similar_sounding_word]
        - success_message: Encouraging message
        - themed_context: Short story context using their interests
        
        Make it engaging and educational!
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.8,
                max_tokens=600
            )
            
            exercise = json.loads(response.choices[0].message.content)
            
            # Generate audio pronunciation guides
            for pair in exercise.get('word_pairs', []):
                correct_word = pair[0]
                audio_guide = self._generate_pronunciation_audio(correct_word)
                pair.append(audio_guide)
            
            return exercise
            
        except Exception as e:
            return {
                'title': 'Word Practice Game',
                'instructions': 'Choose the correct word!',
                'word_pairs': [['cat', 'bat'], ['dog', 'log']],
                'success_message': 'Great job! 🎉',
                'themed_context': 'Help the animals find their names!'
            }
    
    def _generate_pronunciation_audio(self, word: str) -> str:
        """
        Generate pronunciation guide audio using gTTS
        """
        try:
            tts = gTTS(text=word, lang='en', slow=True)
            with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as temp_audio:
                tts.save(temp_audio.name)
                
                with open(temp_audio.name, 'rb') as audio_file:
                    audio_base64 = base64.b64encode(audio_file.read()).decode('utf-8')
                
                os.unlink(temp_audio.name)
                return audio_base64
                
        except Exception as e:
            return ""
    
    def _calculate_fluency_score(self, word_timestamps: List) -> float:
        """
        Calculate reading fluency based on timing consistency
        """
        if not word_timestamps or len(word_timestamps) < 2:
            return 0.5
        
        # Calculate pause lengths between words
        pauses = []
        for i in range(1, len(word_timestamps)):
            pause = word_timestamps[i]['start'] - word_timestamps[i-1]['end']
            pauses.append(pause)
        
        if not pauses:
            return 0.5
        
        # Fluency is higher with consistent, appropriate pauses
        average_pause = np.mean(pauses)
        pause_consistency = 1 - (np.std(pauses) / average_pause if average_pause > 0 else 1)
        
        # Ideal pause length is 0.1-0.3 seconds
        ideal_pause_score = max(0, 1 - abs(average_pause - 0.2) / 0.2)
        
        return (pause_consistency + ideal_pause_score) / 2
    
    def _assess_confidence(self, word_timestamps: List) -> str:
        """
        Assess reading confidence based on speech patterns
        """
        if not word_timestamps:
            return 'moderate'
        
        # Analyze speech speed variation as confidence indicator
        word_durations = [w['end'] - w['start'] for w in word_timestamps]
        
        if not word_durations:
            return 'moderate'
        
        avg_duration = np.mean(word_durations)
        duration_std = np.std(word_durations)
        
        # Confident readers have more consistent timing
        if duration_std / avg_duration < 0.3:
            return 'high'
        elif duration_std / avg_duration > 0.6:
            return 'low'
        else:
            return 'moderate'
    
    def _has_letter_reversal(self, expected: str, spoken: str) -> bool:
        """Check for common letter reversals (b/d, p/q, etc.)"""
        reversals = {'b': 'd', 'd': 'b', 'p': 'q', 'q': 'p', 'was': 'saw', 'saw': 'was'}
        return any(expected.replace(k, v) == spoken for k, v in reversals.items())
    
    def _has_phoneme_substitution(self, expected: str, spoken: str) -> bool:
        """Check for common phoneme substitutions"""
        # Simple check for similar length words with different sounds
        return len(expected) == len(spoken) and expected != spoken
