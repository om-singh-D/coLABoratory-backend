import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

export const generateResult = async (prompt) => {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: "You are an expert AI assistant. Provide the most accurate and highest-quality answer using the fewest possible words. Omit all conversational filler, preambles, formatting flourishes, and pleasantries. Be extremely direct, concise, and highly token-efficient."
    });
    const result = await model.generateContent(prompt);
    return result.response.text();
}