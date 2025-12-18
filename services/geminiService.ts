
import { GoogleGenAI, Type } from "@google/genai";
import { Message, SenderType, ClientProfile, Partner, DocumentStatus } from "../types";

// Initialize the Google GenAI client
// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
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

    // Using ai.models.generateContent directly as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Client Name: ${clientName}
        Target Qualification: ${qualification}
        
        Recent Chat History:
        ${recentHistory}

        Generate 3 short, professional, and friendly quick-reply suggestions for the agent to send next. 
        The replies should move the process forward (e.g., asking for docs, confirming receipt, payment reminder).
      `,
      config: {
        systemInstruction: "You are an AI assistant for an RPL (Recognition of Prior Learning) Agent.",
        responseMimeType: 'application/json',
        // Defining responseSchema for more structured and reliable output
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
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
  if (!process.env.API_KEY) {
    return {
       type: "Unknown",
       confidence: 0,
       summary: "API Key missing. Cannot analyze."
    };
  }

  try {
     const prompt = `Analyze the filename "${fileName}". Predict the document type (e.g., Resume, ID, Reference, Transcript) and provide a fake 1-sentence summary of what this document likely contains for an RPL application.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        // Using Type for responseSchema structure
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            summary: { type: Type.STRING }
          },
          required: ["type", "confidence", "summary"]
        }
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

/**
 * Generates a professional email draft for a partner (RTO/University)
 * when a student's file is ready for submission.
 */
export const generatePartnerEmail = async (
  client: ClientProfile,
  partner: Partner,
  verifiedDocs: DocumentStatus[]
): Promise<{ subject: string; body: string }> => {
  if (!process.env.API_KEY) {
    return {
      subject: `New Application Submission: ${client.name}`,
      body: `Hi ${partner.contactPerson},\n\nPlease find attached the documents for ${client.name} for the ${client.qualificationTarget}.`
    };
  }

  try {
    const docList = verifiedDocs.map(d => d.name).join(', ');
    const prompt = `
      Generate a professional email to a partner (${partner.type}) regarding a student application submission.
      
      Details:
      - Client Name: ${client.name}
      - Qualification Target: ${client.qualificationTarget}
      - Partner Name: ${partner.name}
      - Partner Contact: ${partner.contactPerson}
      - Documents being sent: ${docList}
      - Current Visa: ${client.visaStatus}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an AI specialized in the education and migration industry.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            body: { type: Type.STRING }
          },
          required: ["subject", "body"]
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    throw new Error("No response from AI");
  } catch (e) {
    console.error("Gemini email generation error:", e);
    return {
      subject: `Application Lodgment: ${client.name} - ${client.qualificationTarget}`,
      body: `Dear ${partner.contactPerson},\n\nWe are pleased to submit the application for ${client.name}. Attached are the verified documents for your review.\n\nBest regards,\nStitch OS Team`
    };
  }
};
