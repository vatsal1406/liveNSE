import Groq from "groq-sdk";
import "dotenv/config";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const summarizeAnnouncementGroq = async (rawText) => {
    try {
        if (!rawText || rawText.trim().length === 0) {
            return {
                headline: "",
                company: "",
                summary: "",
            };
        }

        // Prevent extremely large documents
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

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            temperature: 0.2,
            response_format: {
                type: "json_object",
            },
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const result = JSON.parse(
            completion.choices[0].message.content
        );

        return result;
    } catch (error) {
        console.error("Groq Error:", error);

        return {
            headline: "",
            company: "",
            summary: rawText.substring(0, 1000),
        };
    }
};