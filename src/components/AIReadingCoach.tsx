import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, PlayCircle, PauseCircle, Brain, Sparkles, Award, Camera, Heart, Lightbulb } from 'lucide-react';

interface ReadingCoachProps {
  childId?: string;
  onProgress?: (progress: any) => void;
}

export const AIReadingCoach: React.FC<ReadingCoachProps> = ({ 
  childId = 'child1', 
  onProgress = () => {} 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [practiceText] = useState("The friendly dragon loves to read books about space adventures.");
  const [currentExercise, setCurrentExercise] = useState<any>(null);
  const [showExercise, setShowExercise] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        analyzeReading(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const analyzeReading = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    
    try {
      // Convert audio to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      const response = await fetch('http://localhost:5001/analyze_reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audio_base64: base64Audio,
          expected_text: practiceText,
          child_id: childId
        })
      });

      const result = await response.json();
      setAnalysisResult(result);
      
      if (result.success) {
        onProgress(result.analysis);
        
        // Generate personalized exercise if needed
        if (result.analysis?.error_patterns?.length > 0) {
          generatePersonalizedExercise(result.analysis.error_patterns);
        }
      }
    } catch (error) {
      console.error('Reading analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generatePersonalizedExercise = async (errorPatterns: string[]) => {
    try {
      const response = await fetch('http://localhost:5001/generate_phonics_exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error_patterns: errorPatterns,
          child_id: childId,
          difficulty: 'beginner'
        })
      });

      const result = await response.json();
      if (result.success) {
        setCurrentExercise(result.exercise);
        setShowExercise(true);
      }
    } catch (error) {
      console.error('Exercise generation failed:', error);
    }
  };

  const playPronunciationGuide = (word: string) => {
    // Text-to-speech for pronunciation guide
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.8;
    utterance.volume = 0.8;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-3xl p-6">
        <div className="flex items-center justify-center mb-4">
          <Brain className="h-12 w-12 mr-3" />
          <h1 className="text-3xl font-bold">AI Reading Coach 2.0</h1>
        </div>
        <p className="text-xl opacity-90">Practice reading with real-time AI feedback!</p>
      </div>

      {/* Practice Text */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          📖 Practice Reading
        </h2>
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-4">
          <p className="text-2xl leading-relaxed text-gray-800 font-medium">
            {practiceText}
          </p>
        </div>
        
        {/* Recording Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isAnalyzing}
            className={`flex items-center space-x-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-green-500 text-white hover:bg-green-600'
            } disabled:opacity-50`}
          >
            {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            <span>{isRecording ? 'Stop Recording' : 'Start Reading'}</span>
          </button>
          
          {audioBlob && (
            <button
              onClick={() => {
                const audio = new Audio(URL.createObjectURL(audioBlob));
                audio.play();
              }}
              className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
            >
              <PlayCircle className="h-5 w-5" />
              <span>Play Recording</span>
            </button>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      {isAnalyzing && (
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4 animate-spin" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Analyzing Your Reading...</h3>
          <p className="text-gray-600">AI is listening and providing personalized feedback!</p>
        </div>
      )}

      {analysisResult && analysisResult.success && (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <Award className="h-8 w-8 text-yellow-500 mr-3" />
            Your Reading Analysis
          </h3>
          
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.round((analysisResult.analysis?.overall_accuracy || 0.75) * 100)}%
              </div>
              <div className="text-green-700 font-medium">Accuracy</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {Math.round(analysisResult.analysis?.words_per_minute || 45)}
              </div>
              <div className="text-blue-700 font-medium">Words/Minute</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round((analysisResult.analysis?.fluency_score || 0.8) * 10)}/10
              </div>
              <div className="text-purple-700 font-medium">Fluency</div>
            </div>
          </div>

          {/* Personalized Feedback */}
          {analysisResult.feedback && (
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6">
              <h4 className="text-xl font-bold text-purple-800 mb-4">🌟 Personal Feedback</h4>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-bold text-green-700 mb-2">🎉 Great Job!</h5>
                  <p className="text-gray-800">{analysisResult.feedback.celebration}</p>
                </div>
                {analysisResult.feedback.areas_to_work_on && (
                  <div className="bg-white rounded-lg p-4">
                    <h5 className="font-bold text-orange-700 mb-2">📚 Let's Practice</h5>
                    <ul className="space-y-1">
                      {analysisResult.feedback.areas_to_work_on.map((area: string, index: number) => (
                        <li key={index} className="text-gray-800">• {area}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pronunciation Help */}
          {analysisResult.analysis?.mispronounced_words?.length > 0 && (
            <div className="bg-yellow-50 rounded-xl p-6">
              <h4 className="text-xl font-bold text-yellow-800 mb-4">🔤 Pronunciation Practice</h4>
              <div className="space-y-2">
                {analysisResult.analysis.mispronounced_words.slice(0, 3).map((wordError: any, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3">
                    <div>
                      <span className="font-bold text-gray-800">{wordError.word}</span>
                      <span className="text-gray-600 ml-2">(you said: {wordError.spoken_as})</span>
                    </div>
                    <button
                      onClick={() => playPronunciationGuide(wordError.word)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      🔊 Hear It
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Personalized Exercise */}
      {showExercise && currentExercise && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
              <Lightbulb className="h-8 w-8 text-orange-500 mr-3" />
              {currentExercise.title}
            </h3>
            <button
              onClick={() => setShowExercise(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 mb-4">
            <p className="text-lg text-gray-800 mb-4">{currentExercise.instructions}</p>
            
            {currentExercise.themed_context && (
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-gray-700">{currentExercise.themed_context}</p>
              </div>
            )}
            
            {/* Word Pairs Exercise */}
            {currentExercise.word_pairs && (
              <div className="space-y-3">
                {currentExercise.word_pairs.map((pair: string[], index: number) => (
                  <div key={index} className="flex space-x-4">
                    <button className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-800 py-3 px-4 rounded-lg font-medium transition-colors">
                      {pair[0]}
                    </button>
                    <span className="flex items-center text-gray-400">vs</span>
                    <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-800 py-3 px-4 rounded-lg font-medium transition-colors">
                      {pair[1]}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="text-center">
            <button
              onClick={() => setShowExercise(false)}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-xl font-bold hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105"
            >
              Great Job! Continue Reading 🌟
            </button>
          </div>
        </div>
      )}

      {/* Next Exercises Suggestions */}
      {analysisResult?.next_exercises && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-purple-800 mb-4">🎯 Recommended Practice</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysisResult.next_exercises.map((exercise: any, index: number) => (
              <div key={index} className="bg-white rounded-xl p-4 hover:shadow-lg transition-shadow">
                <h4 className="font-bold text-gray-800 mb-2">{exercise.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{exercise.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    {exercise.estimated_time} mins
                  </span>
                  <button className="text-purple-600 hover:text-purple-800 font-medium">
                    Start →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
