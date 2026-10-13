import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import { summarizeAnnouncementGroq } from "./groq.service.js";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const summarizeAnnouncement = async (rawText) => {
    try {
        if (!rawText || rawText.trim().length === 0) {
            return "";
        }

        // Prevent sending extremely large documents
        const text = rawText.slice(0, 50000);

        const prompt = `
You are a senior Indian stock market analyst.

Analyze the following NSE corporate announcement.

Return ONLY valid JSON.

The JSON must have exactly this structure:

{
  "headline": "A short news headline (maximum 18 words).",
  "summary": "A professional investor-focused summary."
}

Rules:
- Headline should be concise, factual, and suitable for the homepage.
- Summary should follow the previous instructions.
- Do not include Markdown.
- Do not include any explanation outside the JSON.
- Never invent information.

Announcement:

${text}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const result = JSON.parse(response.text);

        return {
            headline: result.headline,
            summary: result.summary,
        };
    } catch (error) {
        console.error("Gemini Error:", error);

        console.log("Switching to Groq...");

        return await summarizeAnnouncementGroq(rawText);
    }
};