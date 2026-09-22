
import { GoogleGenAI } from "@google/genai";
import { Customer } from '../types';

export const generatePeerInsights = async (
  totalSales: number,
  transactionCount: number,
  topCustomers: Customer[]
): Promise<string> => {
  if (typeof GoogleGenAI === 'undefined') {
    console.error("GoogleGenAI library is not loaded.");
    return "Insights unavailable.";
  }

  // Use process.env.API_KEY as per guidelines. 
  // Instantiating inside the function ensures the latest key from state is used if shimmed.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Analyze the following business metrics for a retail/service business:
    - Total Sales Period: $${totalSales}
    - Transaction Count: ${transactionCount}
    - Top Customer Segments: ${topCustomers.map(c => c.segment).join(', ')}

    Please provide "Peer Insights":
    1. Compare these hypothetical metrics to industry standards for a mid-sized retail business.
    2. Give 3 specific, actionable bullet points on how to improve revenue based on high-value customer retention.
    3. Keep the tone professional, executive, and encouraging.
    4. Output plain text, formatted nicely.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate insights at this time.";
  }
};

export const generateMLReportAnalysis = async (jobs: any[]): Promise<string> => {
    if (typeof GoogleGenAI === 'undefined') return "Analysis unavailable.";

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const jobSummary = JSON.stringify(jobs);
    const prompt = `
        You are a DataOps engineer. Analyze these training jobs:
        ${jobSummary}

        Identify patterns in failures or high resource usage and suggest 2 optimization strategies for the ML infrastructure.
        Keep it brief (max 100 words).
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "No analysis available.";
    } catch (error) {
        console.error("Gemini API Error (ML):", error);
        return "Analysis failed.";
    }
};
