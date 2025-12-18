
import { GoogleGenAI } from "@google/genai";
import { Message, SenderType } from "../types";

// Initialize the Google GenAI client
// Always use the named parameter and process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartSuggestions = async (
  contextMessages: Message[],
  clientName: string,
  qualification: string
): Promise<string[]> => {
  if (!process.env.API_KEY) {
    return ["Please configure API Key", "Check Document", "Schedule Call"];
  }

  try {
    const recentHistory = contextMessages
      .slice(-5)
      .map(m => `${m.sender}: ${m.content}`)
      .join('\n');

    const prompt = `
      You are an AI assistant for an RPL (Recognition of Prior Learning) Agent.
      Client Name: ${clientName}
      Target Qualification: ${qualification}
      
      Recent Chat History:
      ${recentHistory}

      Generate 3 short, professional, and friendly quick-reply suggestions for the agent to send next. 
      The replies should move the process forward (e.g., asking for docs, confirming receipt, payment reminder).
      Return ONLY the suggestions as a JSON array of strings.
    `;

    // Use gemini-3-flash-preview for text tasks as per guidelines.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return ["Request specific documents", "Schedule a consultation", "Confirm details"];
  } catch (error) {
    console.error("Gemini suggestion error:", error);
    return ["Got it, thanks!", "Please send your resume", "Is there anything else?"];
  }
};

export const analyzeDocumentMock = async (fileName: string): Promise<{ type: string; confidence: number; summary: string }> => {
  // Simulating document analysis using Gemini
  if (!process.env.API_KEY) {
    return {
       type: "Unknown",
       confidence: 0,
       summary: "API Key missing. Cannot analyze."
    };
  }

  try {
     const prompt = `
      Analyze the filename "${fileName}". 
      Predict the document type (e.g., Resume, ID, Reference, Transcript) and provide a fake 1-sentence summary of what this document likely contains for an RPL application.
      Return JSON: { "type": string, "confidence": number (0-100), "summary": string }
    `;

    // Use gemini-3-flash-preview for text tasks as per guidelines.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return { type: "General File", confidence: 50, summary: "Could not analyze file." };
  } catch (e) {
    return { type: "Error", confidence: 0, summary: "Analysis failed." };
  }
};
