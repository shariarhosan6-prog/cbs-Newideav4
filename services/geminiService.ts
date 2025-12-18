
import { GoogleGenAI } from "@google/genai";
import { Message, SenderType, ClientProfile, Partner, DocumentStatus } from "../types";

// Initialize the Google GenAI client
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
      You are an AI specialized in the education and migration industry. 
      Generate a professional email to a partner (${partner.type}) regarding a student application submission.
      
      Details:
      - Client Name: ${client.name}
      - Qualification Target: ${client.qualificationTarget}
      - Partner Name: ${partner.name}
      - Partner Contact: ${partner.contactPerson}
      - Documents being sent: ${docList}
      - Current Visa: ${client.visaStatus}
      
      The email should be professional, polite, and clear. 
      Return JSON: { "subject": string, "body": string }
    `;

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
    throw new Error("No response from AI");
  } catch (e) {
    console.error("Gemini email generation error:", e);
    return {
      subject: `Application Lodgment: ${client.name} - ${client.qualificationTarget}`,
      body: `Dear ${partner.contactPerson},\n\nWe are pleased to submit the application for ${client.name}. Attached are the verified documents for your review.\n\nBest regards,\nStitch OS Team`
    };
  }
};
