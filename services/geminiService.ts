
import { GoogleGenAI } from "@google/genai";

// Always use the process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAlgorithmComparisonSummary = async (metrics: any[]) => {
  try {
    const prompt = `Compare these Gene Regulatory Network (GRN) benchmarking results. 
    Analyze which algorithm performed best based on AUROC and AUPRC.
    Data: ${JSON.stringify(metrics)}`;
    
    // Using gemini-3-pro-preview for complex scientific/STEM analysis
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a bioinformatics expert specializing in Gene Regulatory Networks and the BEELINE benchmarking suite.",
      }
    });
    
    // Extracting text output directly from property
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate AI insights. Please check your API key.";
  }
};
