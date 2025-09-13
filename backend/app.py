from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import requests
import base64
import io
import re
from gtts import gTTS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set OpenAI API key
openai.api_key = os.getenv('OPENAI_API_KEY')

class StoryGenerator:
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    
    def generate_story_text(self, theme, characters, reading_level=1):
        """Generate an adaptive story using OpenAI GPT with reading coach features"""
        try:
            character_list = [char.strip() for char in characters.split(',') if char.strip()]
            character_text = ', '.join(character_list)
            
            # Enhanced prompt for adaptive storytelling with reading coach
            prompt = f"""
            You are a friendly and patient learning companion for children aged 6–12, especially those with learning disabilities (like dyslexia, ADHD, or autism). You create engaging, adaptive stories and provide gentle reading support.

            Generate a short adaptive story for a child who chose the theme '{theme}' with characters '{character_text}'.

            Requirements:
            - Story Text: 5-6 short sentences, simple vocabulary, clear narrative
            - Keep the tone playful and positive
            - Reading Level {reading_level}: {"1-2 sentences per page" if reading_level == 1 else "2-3 sentences with slightly harder words" if reading_level == 2 else "3-4 sentences, introducing new vocabulary"}
            
            Return ONLY valid JSON in this exact format:
            {{
                "story": {{
                    "title": "Story Title 🚀",
                    "theme": "{theme}",
                    "characters": {character_list},
                    "level": {reading_level},
                    "pages": [
                        {{
                            "text": "Short sentence here.",
                            "illustration_prompt": "Colorful, cartoonish, child-friendly illustration description for DALL-E"
                        }},
                        {{
                            "text": "Another short sentence.",
                            "illustration_prompt": "Another illustration description"
                        }}
                    ]
                }},
                "tts_text": "Complete story text for narration",
                "reading_coach": {{
                    "sentence": "One key sentence from the story",
                    "pronunciation": "Phonetic pronunciation guide",
                    "correction_phrases": [
                        "Almost! Try saying 'word' slowly: w-o-r-d 🌟",
                        "Great try! Remember this sound 🎯"
                    ]
                }},
                "reward": {{
                    "badge": "Achievement Badge Name 🏆",
                    "unlocked_character": "New Character Name 🌟",
                    "description": "You're amazing at {theme.lower()}!"
                }}
            }}
            
            Rules:
            - Use simple, encouraging language
            - Make illustrations colorful and non-scary
            - Provide gentle, supportive feedback
            - Include appropriate emojis
            - Keep sentences short for reading level {reading_level}
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert adaptive storytelling AI for children with learning disabilities. Always respond with valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1200,
                temperature=0.7
            )
            
            return response.choices[0].message.content
        
        except Exception as e:
            print(f"Error generating story: {e}")
            return None
    
    def split_into_paragraphs(self, story):
        """Split story into paragraphs for pages"""
        paragraphs = [p.strip() for p in story.split('\n\n') if p.strip()]
        # Ensure we have reasonable paragraph lengths
        processed_paragraphs = []
        
        for paragraph in paragraphs:
            # If paragraph is too long, try to split it at sentence boundaries
            if len(paragraph) > 150:
                sentences = re.split(r'(?<=[.!?])\s+', paragraph)
                current_para = ""
                
                for sentence in sentences:
                    if len(current_para + sentence) <= 150:
                        current_para += sentence + " "
                    else:
                        if current_para:
                            processed_paragraphs.append(current_para.strip())
                        current_para = sentence + " "
                
                if current_para:
                    processed_paragraphs.append(current_para.strip())
            else:
                processed_paragraphs.append(paragraph)
        
        return processed_paragraphs
    
    def generate_illustration(self, paragraph, theme, characters):
        """Generate illustration for a paragraph using DALL-E"""
        try:
            character_list = [char.strip() for char in characters.split(',') if char.strip()]
            
            prompt = f"""
            Create a child-friendly, calming illustration for this story scene:
            
            Scene: {paragraph[:100]}...
            Theme: {theme}
            Characters: {', '.join(character_list)}
            
            Style: Soft, warm, cartoon-like illustration with pastel colors. 
            Kid-friendly, non-scary, gentle and welcoming. 
            Simple, clean art style suitable for children's books.
            No text or words in the image.
            """
            
            response = self.client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1024x1024",
                quality="standard",
                n=1
            )
            
            return response.data[0].url
        
        except Exception as e:
            print(f"Error generating illustration: {e}")
            return None
    
    def generate_audio_narration(self, story):
        """Generate audio narration using gTTS"""
        try:
            # Create TTS object
            tts = gTTS(text=story, lang='en', slow=False)
            
            # Save to a BytesIO object
            audio_buffer = io.BytesIO()
            tts.write_to_fp(audio_buffer)
            audio_buffer.seek(0)
            
            # Convert to base64
            audio_base64 = base64.b64encode(audio_buffer.read()).decode('utf-8')
            return audio_base64
        
        except Exception as e:
            print(f"Error generating audio: {e}")
            return None

story_generator = StoryGenerator()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Story API is running"})

@app.route('/generate_quests', methods=['POST'])
def generate_quests():
    """Generate gamified learning quests using OpenAI"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        theme = data.get('theme', '').strip()
        
        if not theme:
            return jsonify({"error": "Theme is required"}), 400
        
        # Enhanced prompt for quest generation
        prompt = f"""
        You are a playful and supportive learning coach for children (ages 6–12) with learning disabilities. 
        Your goal is to create simple, fun, and adaptive educational mini-games that help children learn while 
        feeling encouraged and motivated. Always use short sentences, friendly language, and positive reinforcement.

        Generate a set of Gamified Learning Quests for a child learning about {theme}.

        Create exactly 3 mini-games in this exact JSON format:

        {{
            "theme": "{theme}",
            "quests": [
                {{
                    "type": "matching",
                    "pictures": [
                        {{"emoji": "🐘", "word": "Elephant", "id": "elephant"}},
                        {{"emoji": "🦁", "word": "Lion", "id": "lion"}},
                        {{"emoji": "🐦", "word": "Bird", "id": "bird"}},
                        {{"emoji": "🐢", "word": "Turtle", "id": "turtle"}}
                    ],
                    "instruction": "Drag the words to the right picture!",
                    "encouragement": "Woohoo! You matched it! 🌟",
                    "hint": "Hmm, try again. Which one has a long trunk?"
                }},
                {{
                    "type": "fill-blank",
                    "sentence": "The 🦁 is the king of the ____.",
                    "options": ["jungle", "sky", "water"],
                    "correct": "jungle",
                    "encouragement": "Yes! Lions roar in the jungle! 🦁💛",
                    "hint": "Lions live in wild places with lots of trees!"
                }},
                {{
                    "type": "quiz",
                    "question": "Which animal can fly?",
                    "choices": [
                        {{"emoji": "🐘", "text": "Elephant", "id": "elephant"}},
                        {{"emoji": "🐢", "text": "Turtle", "id": "turtle"}},
                        {{"emoji": "🐦", "text": "Bird", "id": "bird"}}
                    ],
                    "correct": "bird",
                    "encouragement": "Amazing! Birds have wings to fly! 🐦✨",
                    "hint": "Almost! Look for wings 🪽."
                }}
            ],
            "badge": {{
                "name": "Explorer Badge",
                "emoji": "🌍",
                "description": "You're an amazing {theme.lower()} explorer!"
            }}
        }}

        Rules:
        - Use appropriate emojis for the {theme} theme
        - Keep all text simple and encouraging
        - Make questions age-appropriate for 6-12 year olds with learning disabilities
        - Provide gentle hints for wrong answers
        - Make each quest unique and engaging
        - Use exactly the JSON structure shown above
        - Return only valid JSON, no extra text
        """
        
        print(f"Generating quests for theme: {theme}")
        response = story_generator.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert educational game designer for children with learning disabilities. Always respond with valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1500,
            temperature=0.7
        )
        
        quest_content = response.choices[0].message.content
        if not quest_content:
            raise Exception("Empty response from OpenAI")
        
        quest_content = quest_content.strip()
        
        # Try to parse the JSON response
        try:
            import json
            quest_data = json.loads(quest_content)
        except json.JSONDecodeError:
            # If JSON parsing fails, return a fallback response
            quest_data = {
                "theme": theme,
                "quests": [
                    {
                        "type": "matching",
                        "pictures": [
                            {"emoji": "🌟", "word": "Star", "id": "star"},
                            {"emoji": "🌙", "word": "Moon", "id": "moon"},
                            {"emoji": "☀️", "word": "Sun", "id": "sun"},
                            {"emoji": "🌈", "word": "Rainbow", "id": "rainbow"}
                        ],
                        "instruction": "Match the words to the pictures!",
                        "encouragement": "Great job! You're a star! 🌟",
                        "hint": "Look carefully at the shapes!"
                    },
                    {
                        "type": "fill-blank",
                        "sentence": "The ☀️ shines during the ____.",
                        "options": ["day", "night", "rain"],
                        "correct": "day",
                        "encouragement": "Wonderful! The sun shines in the day! ☀️",
                        "hint": "When is it bright and warm?"
                    },
                    {
                        "type": "quiz",
                        "question": "What appears after rain?",
                        "choices": [
                            {"emoji": "🌙", "text": "Moon", "id": "moon"},
                            {"emoji": "🌈", "text": "Rainbow", "id": "rainbow"},
                            {"emoji": "⭐", "text": "Stars", "id": "stars"}
                        ],
                        "correct": "rainbow",
                        "encouragement": "Perfect! Rainbows appear after rain! 🌈✨",
                        "hint": "Think about colorful arches in the sky!"
                    }
                ],
                "badge": {
                    "name": f"{theme.title()} Explorer",
                    "emoji": "🏆",
                    "description": f"You're amazing at learning about {theme.lower()}!"
                }
            }
        
        response_data = {
            "success": True,
            "quest_set": quest_data
        }
        
        return jsonify(response_data)
    
    except Exception as e:
        print(f"Error in generate_quests: {e}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/generate_story_mock', methods=['POST'])
def generate_story_mock():
    """Mock endpoint for testing the frontend when OpenAI API is not available"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        theme = data.get('theme', 'friendship').strip()
        characters = data.get('characters', 'Buddy, Luna').strip()
        reading_level = data.get('reading_level', 1)
        
        # Mock story data
        mock_response = {
            "success": True,
            "story": {
                "title": f"The {theme.title()} Adventure",
                "theme": theme,
                "characters": [char.strip() for char in characters.split(',')],
                "level": reading_level,
                "pages": [
                    {
                        "text": f"Once upon a time, {characters.split(',')[0]} was feeling a little lonely.",
                        "illustration_prompt": f"A cute cartoon {characters.split(',')[0]} looking thoughtful in a beautiful meadow"
                    },
                    {
                        "text": f"Then {characters.split(',')[0]} met {characters.split(',')[1] if ',' in characters else 'a new friend'} and they became best friends!",
                        "illustration_prompt": f"Two happy cartoon characters playing together in a sunny park"
                    },
                    {
                        "text": "They learned that friendship makes everything better and more fun!",
                        "illustration_prompt": "Happy cartoon friends celebrating together with sparkles and rainbows"
                    }
                ],
                "illustrations": [
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzg3Q0VFQiIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TdG9yeSBJbGx1c3RyYXRpb24gMTwvdGV4dD48L3N2Zz4=",
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzk4RkI5OCIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TdG9yeSBJbGx1c3RyYXRpb24gMjwvdGV4dD48L3N2Zz4=",
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0ZGQjZDMSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TdG9yeSBJbGx1c3RyYXRpb24gMzwvdGV4dD48L3N2Zz4="
                ],
                "audio_base64": "UklGRiYEAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIEAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcXBT2H0fLCdSEFLYHN8diJOQgYZ73o66hVFApGn+DyvmcXBT2H0fLCdSEGMHzK8N2QQAoUXrTp66hVFApGn+DyvmcXBT2H0fLCdSEGLyA=",
                "page_count": 3
            },
            "reading_coach": {
                "sentence": "They learned that friendship makes everything better and more fun!",
                "pronunciation": "THEY LERND THAT FREND-ship MAYKS EV-ree-thing BET-ter AND MOR FUN!",
                "correction_phrases": [
                    "Great try! Let's practice 'friendship': FREND-ship 🌟",
                    "Almost there! 'Everything' sounds like: EV-ree-thing 🎯"
                ]
            },
            "reward": {
                "badge": "Friendship Explorer 🌟",
                "unlocked_character": "Buddy the Bear 🐻",
                "description": f"You're amazing at understanding {theme}!"
            }
        }
        
        return jsonify(mock_response)
    
    except Exception as e:
        print(f"Error in generate_story_mock: {e}")
        return jsonify({"error": f"Mock endpoint error: {str(e)}"}), 500

@app.route('/generate_story', methods=['POST'])
def generate_story():
    """Main endpoint to generate an adaptive story with reading coach features"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        theme = data.get('theme', '').strip()
        characters = data.get('characters', '').strip()
        reading_level = data.get('reading_level', 1)
        
        if not theme:
            return jsonify({"error": "Theme is required"}), 400
        
        if not characters:
            return jsonify({"error": "Characters are required"}), 400
        
        # Generate adaptive story with reading coach
        print(f"Generating adaptive story for theme: {theme}, characters: {characters}, level: {reading_level}")
        story_response = story_generator.generate_story_text(theme, characters, reading_level)
        
        if not story_response:
            return jsonify({"error": "Failed to generate story"}), 500
        
        # Try to parse the JSON response
        try:
            import json
            story_data = json.loads(story_response)
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            # Fallback to simple story structure
            story_data = {
                "story": {
                    "title": f"Adventure with {characters.split(',')[0].strip()}",
                    "theme": theme,
                    "characters": characters.split(','),
                    "level": reading_level,
                    "pages": [
                        {
                            "text": f"Once upon a time, there was a magical adventure about {theme.lower()}.",
                            "illustration_prompt": f"Colorful cartoon illustration of {characters.split(',')[0].strip()} in a {theme.lower()} setting"
                        },
                        {
                            "text": f"{characters.split(',')[0].strip()} discovered something wonderful.",
                            "illustration_prompt": f"Happy {characters.split(',')[0].strip()} making a discovery"
                        },
                        {
                            "text": "And they all lived happily ever after!",
                            "illustration_prompt": "Cheerful ending scene with all characters celebrating"
                        }
                    ]
                },
                "tts_text": f"Once upon a time, there was a magical adventure about {theme.lower()}. {characters.split(',')[0].strip()} discovered something wonderful. And they all lived happily ever after!",
                "reading_coach": {
                    "sentence": f"{characters.split(',')[0].strip()} discovered something wonderful.",
                    "pronunciation": f"{characters.split(',')[0].strip()} dis-cov-ered some-thing won-der-ful",
                    "correction_phrases": [
                        "Almost! Try saying 'discovered' slowly: dis-cov-ered 🌟",
                        "Great try! Remember 'wonderful' sounds like won-der-ful 🎯"
                    ]
                },
                "reward": {
                    "badge": f"{theme.title()} Explorer Badge 🏆",
                    "unlocked_character": "Brave Adventurer 🌟",
                    "description": f"You're amazing at {theme.lower()} stories!"
                }
            }
        
        # Generate illustrations for each page
        print("Generating illustrations...")
        illustrations = []
        for i, page in enumerate(story_data['story']['pages']):
            print(f"Generating illustration {i+1}/{len(story_data['story']['pages'])}")
            image_url = story_generator.generate_illustration(page['illustration_prompt'], theme, characters)
            illustrations.append(image_url)
        
        # Generate audio narration
        print("Generating audio narration...")
        audio_base64 = story_generator.generate_audio_narration(story_data['tts_text'])
        
        # Prepare enhanced response
        response_data = {
            "success": True,
            "story": {
                "title": story_data['story']['title'],
                "theme": story_data['story']['theme'],
                "characters": story_data['story']['characters'],
                "level": story_data['story']['level'],
                "pages": story_data['story']['pages'],
                "illustrations": illustrations,
                "audio_base64": audio_base64,
                "page_count": len(story_data['story']['pages'])
            },
            "reading_coach": story_data['reading_coach'],
            "reward": story_data['reward']
        }
        
        return jsonify(response_data)
    
    except Exception as e:
        print(f"Error in generate_story: {e}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

if __name__ == '__main__':
    # Check if OpenAI API key is set
    if not os.getenv('OPENAI_API_KEY'):
        print("Warning: OPENAI_API_KEY environment variable not set")
    
    app.run(debug=True, host='0.0.0.0', port=5001)
