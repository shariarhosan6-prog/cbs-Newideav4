
import { GoogleGenAI, Type } from "@google/genai";
import { Message, SenderType, ClientProfile, Partner, DocumentStatus } from "../types";

/**
 * Fast AI responses using gemini-flash-lite-latest
 */
export const fastRewrite = async (text: string): Promise<string> => {
  if (!process.env.API_KEY) return text;
  // Create a new GoogleGenAI instance right before making an API call to ensure up-to-date config
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: `Rewrite this message to be more professional for an RPL agent: "${text}"`,
    });
    return response.text || text;
  } catch (error) {
    return text;
  }
};

/**
 * Complex Strategy Generation using gemini-3-pro-preview with Thinking Mode
 */
export const generateMigrationStrategy = async (client: ClientProfile): Promise<string> => {
  if (!process.env.API_KEY) return "API Key missing.";
  // Create a new GoogleGenAI instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Develop a comprehensive 12-month migration and qualification strategy for:
      Name: ${client.name}
      Current Location: ${client.location}
      Education: ${JSON.stringify(client.educationHistory)}
      Experience: ${client.experienceYears} years
      Target: ${client.qualificationTarget}
      Visa: ${client.visaStatus}`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      },
    });
    return response.text || "Could not generate strategy.";
  } catch (error) {
    console.error("Gemini thinking error:", error);
    return "Error generating complex strategy.";
  }
};

/**
 * Analyze images/documents using gemini-3-pro-preview
 */
export const analyzeUploadedImage = async (base64Data: string, mimeType: string): Promise<string> => {
  if (!process.env.API_KEY) return "API Key missing.";
  // Create a new GoogleGenAI instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };
    const textPart = {
      text: "Analyze this document image. Extract key details like Full Name, Date of Birth, Document Type, and Expiry Date if visible. Also assess its validity for an RPL application."
    };
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: [imagePart, textPart] },
    });
    return response.text || "Could not analyze image.";
  } catch (error) {
    return "Image analysis failed.";
  }
};

/**
 * General AI Chatbot for Agent Queries
 */
export const askGeminiAssistant = async (query: string): Promise<string> => {
  if (!process.env.API_KEY) return "Agent, I need an API key to help you.";
  // Create a new GoogleGenAI instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: query,
      config: {
        systemInstruction: "You are an expert AI assistant for Stitch RPL CRM. You help agents with Australian migration rules, RPL documentation requirements, and RTO processes."
      }
    });
    return response.text || "I'm not sure how to answer that.";
  } catch (error) {
    return "Assistant error occurred.";
  }
};

/**
 * Generate 3 smart reply suggestions using gemini-flash-lite-latest
 */
export const getSmartSuggestions = async (
  contextMessages: Message[],
  clientName: string,
  qualification: string
): Promise<string[]> => {
  if (!process.env.API_KEY) {
    return ["Please configure API Key", "Check Document", "Schedule Call"];
  }

  // Create a new GoogleGenAI instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const recentHistory = contextMessages
      .slice(-5)
      .map(m => `${m.sender}: ${m.content}`)
      .join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: `
        Client Name: ${clientName}
        Target Qualification: ${qualification}
        Recent Chat History:
        ${recentHistory}
        Generate 3 short, professional, and friendly quick-reply suggestions.
      `,
      config: {
        systemInstruction: "You are an AI assistant for an RPL (Recognition of Prior Learning) Agent.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const text = response.text;
    if (text) return JSON.parse(text);
    return ["Request specific documents", "Schedule a consultation", "Confirm details"];
  } catch (error) {
    return ["Got it, thanks!", "Please send your resume", "Is there anything else?"];
  }
};
