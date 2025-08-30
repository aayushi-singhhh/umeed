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
    
    def generate_story_text(self, theme, characters):
        """Generate a story using OpenAI GPT"""
        try:
            character_list = [char.strip() for char in characters.split(',') if char.strip()]
            character_text = ', '.join(character_list)
            
            prompt = f"""
            Write a simple, positive, and engaging story for neurodivergent children aged 5-12.
            
            Theme: {theme}
            Characters: {character_text}
            
            Requirements:
            - 500-700 words
            - Simple vocabulary and sentence structure
            - Positive, uplifting message
            - Clear beginning, middle, and end
            - Include sensory details that are calming, not overwhelming
            - Focus on friendship, problem-solving, and acceptance
            - Break into natural paragraph breaks for illustration pages
            
            Make the story engaging but not overstimulating, with a gentle pace and reassuring tone.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert children's story writer specializing in content for neurodivergent children. You create calm, positive, and engaging stories with simple language."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
        
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

@app.route('/generate_story', methods=['POST'])
def generate_story():
    """Main endpoint to generate a complete story with illustrations and audio"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        theme = data.get('theme', '').strip()
        characters = data.get('characters', '').strip()
        
        if not theme:
            return jsonify({"error": "Theme is required"}), 400
        
        if not characters:
            return jsonify({"error": "Characters are required"}), 400
        
        # Generate story text
        print(f"Generating story for theme: {theme}, characters: {characters}")
        story_text = story_generator.generate_story_text(theme, characters)
        
        if not story_text:
            return jsonify({"error": "Failed to generate story"}), 500
        
        # Split into paragraphs
        paragraphs = story_generator.split_into_paragraphs(story_text)
        
        # Generate illustrations for each paragraph
        print("Generating illustrations...")
        illustrations = []
        for i, paragraph in enumerate(paragraphs):
            print(f"Generating illustration {i+1}/{len(paragraphs)}")
            image_url = story_generator.generate_illustration(paragraph, theme, characters)
            illustrations.append(image_url)
        
        # Generate audio narration
        print("Generating audio narration...")
        audio_base64 = story_generator.generate_audio_narration(story_text)
        
        # Prepare response
        response_data = {
            "success": True,
            "story": {
                "full_text": story_text,
                "theme": theme,
                "characters": characters.split(','),
                "paragraphs": paragraphs,
                "illustrations": illustrations,
                "audio_base64": audio_base64,
                "page_count": len(paragraphs)
            }
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
