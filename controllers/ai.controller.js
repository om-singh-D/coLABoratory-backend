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

export const getAgentResult = async (req, res) => {
    try {
        const { prompt, fileTree } = req.body;
        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        const agentContext = `
You are an expert software engineer agent. 
You are given a prompt and the current file tree of a project.
Your task is to follow the instructions in the prompt and modify the files accordingly.

Here is the current file tree (JSON format):
${JSON.stringify(fileTree, null, 2)}

User Prompt: ${prompt}

IMPORTANT: You MUST return ONLY a valid JSON object representing the UPDATED file tree. 
Do not wrap it in markdown backticks. Do not include any explanations. Just the JSON object.
Format it identically to the input file tree: { "path/to/file.js": { "file": { "contents": "..." } } }
`;

        const result = await aiService.generateResult(agentContext);
        
        let parsedTree = {};
        try {
            // Attempt to strip out any potential markdown blocks if the AI disobeys
            let cleanResult = result.trim();
            if (cleanResult.startsWith('\`\`\`json')) {
                cleanResult = cleanResult.substring(7, cleanResult.length - 3).trim();
            } else if (cleanResult.startsWith('\`\`\`')) {
                cleanResult = cleanResult.substring(3, cleanResult.length - 3).trim();
            }
            parsedTree = JSON.parse(cleanResult);
        } catch(parseErr) {
            console.error("Failed to parse AI output as JSON:", result);
            return res.status(500).json({ message: "AI returned invalid JSON", result });
        }

        res.status(200).json({ fileTree: parsedTree });
    } catch (error) {
        console.error("Agent Error:", error);
        res.status(500).json({ message: "Failed to run agent", error: error.message });
    }
}
