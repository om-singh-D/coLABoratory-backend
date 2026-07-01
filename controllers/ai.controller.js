import * as aiService from '../services/ai.service.js';

export const getResult = async (req, res) => {
    try {
        const { prompt, promt } = req.query; 
        const actualPrompt = prompt || promt;
        
        if (!actualPrompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        const result = await aiService.generateResult(actualPrompt);
        res.status(200).json({ result });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ message: "Failed to get AI result", error: error.message });
    }
}
