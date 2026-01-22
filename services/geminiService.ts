import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Message } from "../types";

export class GeminiService {
  /**
   * Checks if the API key is configured correctly in the environment.
   */
  public hasApiKey(): boolean {
    const apiKey = process.env.API_KEY;
    return !!(
      apiKey && 
      apiKey !== "" && 
      apiKey !== "undefined" && 
      apiKey !== "null" &&
      !apiKey.startsWith("YOUR_")
    );
  }

  private getAI() {
    const apiKey = process.env.API_KEY;
    if (!this.hasApiKey()) {
      throw new Error("API Key is missing. Please ensure API_KEY is set in your hosting provider's environment variables or GitHub Secrets.");
    }
    return new GoogleGenAI({ apiKey: apiKey! });
  }

  async *sendMessageStream(history: Message[]) {
    const ai = this.getAI();
    
    // We use gemini-3-flash-preview for high speed and reliable mental health support
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const lastUserMessage = history[history.length - 1];
    if (!lastUserMessage || lastUserMessage.role !== 'user') return;

    try {
      const streamResponse = await chat.sendMessageStream({ 
        message: lastUserMessage.text 
      });
      
      for await (const chunk of streamResponse) {
        const c = chunk as GenerateContentResponse;
        yield {
          text: c.text,
          groundingMetadata: c.candidates?.[0]?.groundingMetadata
        };
      }
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();