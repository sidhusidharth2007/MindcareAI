
import os
import datetime
import gradio as gr
from typing import List, Tuple
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import SystemMessage, HumanMessage, AIMessage

# For Google Colab secret management
try:
    from google.colab import userdata
    COLAB_AVAILABLE = True
except ImportError:
    COLAB_AVAILABLE = False

# --- Configuration & Constants ---
SYSTEM_INSTRUCTION = """You are MindcareAI, a compassionate, empathetic, and evidence-based mental health assistant. 

Your goals:
1. Provide emotional support and active listening.
2. Offer evidence-based coping strategies (CBT techniques, mindfulness, grounding exercises).
3. Always maintain a professional yet warm and non-judgmental tone.
4. Help users identify their feelings and navigate mild to moderate stress, anxiety, and low mood.
5. IF A USER INDICATES SELF-HARM OR CRISIS: 
   - Immediately provide Indian crisis resources like Tele MANAS (14416) or KIRAN (1800-599-0019).
   - Express sincere concern.
   - Clarify that you are an AI.
6. Use grounding to find reputable mental health resources in India if asked.
7. Be concise but warm."""

CRISIS_RESOURCES = """
### 🚨 Indian Emergency Resources
If you are in immediate danger, please call emergency services (**100** or **112**).

*   **Tele MANAS**: Call **14416** or **1800-89-14416** (24/7 National Helpline)
*   **KIRAN Helpline**: Call **1800-599-0019** (24/7 Govt Mental Health Support)
*   **Aasra**: Call **9820466726** (Suicide Prevention)
*   **Vandrevala Foundation**: Call **9999666555** (24/7 Counseling)
"""

# --- App State & Logic ---
class MindcareApp:
    def __init__(self):
        api_key = None
        if COLAB_AVAILABLE:
            try:
                api_key = userdata.get('API_KEY')
            except:
                pass
        
        if not api_key:
            api_key = os.getenv("API_KEY")
            
        if not api_key:
            raise ValueError("API Key not found. Please add 'API_KEY' to your Colab Secrets.")
            
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-3-flash-preview",
            google_api_key=api_key,
            temperature=0.7,
            convert_system_message_to_human=True
        )
        self.mood_history = []

    def format_history(self, history: List[Tuple[str, str]]) -> List:
        messages = [SystemMessage(content=SYSTEM_INSTRUCTION)]
        for user_msg, ai_msg in history:
            if user_msg:
                messages.append(HumanMessage(content=user_msg))
            if ai_msg:
                messages.append(AIMessage(content=ai_msg))
        return messages

    def chat_response(self, message: str, history: List[Tuple[str, str]]):
        messages = self.format_history(history)
        messages.append(HumanMessage(content=message))
        
        response = self.llm.invoke(messages)
        return response.content

    def log_mood(self, mood: str, note: str):
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        entry = f"**{timestamp}**: {mood} - *{note}*"
        self.mood_history.append(entry)
        return "\n\n".join(self.mood_history[::-1])

# --- UI Definition ---
try:
    app = MindcareApp()
except Exception as e:
    print(f"Error initializing app: {e}")
    class DummyApp:
        def chat_response(self, m, h): return f"Error: {e}"
        def log_mood(self, m, n): return "Error"
    app = DummyApp()

with gr.Blocks(theme=gr.themes.Soft(primary_hue="emerald", secondary_hue="slate")) as demo:
    gr.Markdown("# 🌿 MindcareAI (India)")
    gr.Markdown("*Your compassionate AI companion for mental support.*")
    
    with gr.Tabs():
        with gr.TabItem("💬 Support Chat"):
            chatbot = gr.ChatInterface(
                fn=app.chat_response,
                description="I'm here to listen. Tell me what's on your mind.",
                examples=["I'm feeling very anxious today", "Help me with a breathing exercise", "Where can I find mental health clinics in Mumbai?"],
            )
            
        with gr.TabItem("📊 Mood Journal"):
            with gr.Row():
                with gr.Column(scale=1):
                    mood_input = gr.Radio(
                        ["😊 Happy", "😌 Calm", "😐 Neutral", "😔 Sad", "😰 Anxious", "😡 Angry"], 
                        label="How are you feeling?"
                    )
                    note_input = gr.Textbox(label="Optional Note", placeholder="What's on your mind?")
                    log_btn = gr.Button("Log Mood", variant="primary")
                with gr.Column(scale=2):
                    mood_display = gr.Markdown("### Recent Logs\n*No logs yet.*")
            
            log_btn.click(app.log_mood, inputs=[mood_input, note_input], outputs=mood_display)

        with gr.TabItem("🆘 Indian Help Resources"):
            gr.Markdown(CRISIS_RESOURCES)
            
    gr.Markdown("---")
    gr.Markdown("⚠️ **Disclaimer**: MindcareAI is an AI tool and not a replacement for professional therapy. If in crisis, please call the helplines listed above.")

if __name__ == "__main__":
    demo.launch(debug=True)
