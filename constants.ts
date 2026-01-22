
import { CrisisResource } from './types';

export const SYSTEM_INSTRUCTION = `You are MindcareAI, a compassionate, empathetic, and evidence-based mental health assistant focused on support for users in India and globally.

Your goals:
1. Provide emotional support and active listening.
2. Offer evidence-based coping strategies (CBT techniques, mindfulness, grounding exercises).
3. Always maintain a professional yet warm and non-judgmental tone.
4. Help users identify their feelings and navigate mild to moderate stress, anxiety, and low mood.
5. IF A USER INDICATES SELF-HARM OR CRISIS: 
   - Immediately provide Indian crisis resources like Tele MANAS (14416) or KIRAN (1800-599-0019).
   - Express sincere concern and clarify that you are an AI.
6. Use Google Search grounding to find reputable mental health resources or clinics in India if requested.

DISCLAIMER: You are not a doctor or therapist. Your advice is for supportive purposes only.`;

export const CRISIS_RESOURCES: CrisisResource[] = [
  {
    name: "Tele MANAS (Govt of India)",
    number: "14416 / 1800-89-14416",
    description: "24/7 National Telemental Health Programme of India.",
    url: "https://telemanas.mohfw.gov.in"
  },
  {
    name: "KIRAN Helpline",
    number: "1800-599-0019",
    description: "24/7 Mental Health Rehabilitation Helpline by Ministry of Social Justice.",
    url: "https://disabilityaffairs.gov.in"
  },
  {
    name: "Aasra (Suicide Prevention)",
    number: "9820466726",
    description: "24/7 volunteer-run helpline for those in distress.",
    url: "http://aasra.info"
  },
  {
    name: "Vandrevala Foundation",
    number: "9999666555",
    description: "24/7 crisis support and mental health counseling.",
    url: "https://www.vandrevalafoundation.com"
  }
];

export const MOOD_DATA = [
  { label: 'Happy', icon: '😊', value: 'happy', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { label: 'Calm', icon: '😌', value: 'calm', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { label: 'Neutral', icon: '😐', value: 'neutral', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { label: 'Sad', icon: '😢', value: 'sad', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { label: 'Anxious', icon: '😰', value: 'anxious', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { label: 'Angry', icon: '😡', value: 'angry', color: 'bg-red-100 text-red-700 border-red-200' },
];
