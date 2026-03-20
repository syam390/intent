import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface IntentResult {
  detectedIntent: string;
  riskLevel: "Low" | "Medium" | "High";
  recommendedAction: string;
  relevantServices: string[];
  explanation: string;
}

export async function analyzeIntent(
  input: string | { data: string; mimeType: string } | { audio: { data: string; mimeType: string } }
): Promise<IntentResult> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are IntentBridge, an AI designed to analyze messy real-world inputs and translate them into actionable decisions.
    Your goal is to provide a structured analysis of the user's intent, assess potential risks, and recommend actions.
    
    Return the response in JSON format with the following fields:
    - detectedIntent: A concise summary of what the user wants or is trying to achieve.
    - riskLevel: One of "Low", "Medium", or "High" based on the potential impact or danger of the intent.
    - recommendedAction: A clear, actionable step for the user to take.
    - relevantServices: A list of 2-3 relevant services or categories of resources.
    - explanation: A detailed explanation of your reasoning and analysis.
  `;

  let contents: any;
  if (typeof input === "string") {
    contents = input;
  } else if ("audio" in input) {
    contents = { parts: [{ inlineData: input.audio }, { text: "Analyze the intent of this audio." }] };
  } else {
    contents = { parts: [{ inlineData: input }, { text: "Analyze the intent of this image." }] };
  }

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          detectedIntent: { type: Type.STRING },
          riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          recommendedAction: { type: Type.STRING },
          relevantServices: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          explanation: { type: Type.STRING }
        },
        required: ["detectedIntent", "riskLevel", "recommendedAction", "relevantServices", "explanation"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as IntentResult;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to analyze intent. Please try again.");
  }
}
