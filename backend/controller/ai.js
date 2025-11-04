const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { spawn } = require("child_process");

const generateFFmpeg = async (prompt, fileNames) => {
    try {
        const { GoogleGenAI, Type } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `You are generating FFmpeg arguments as a JSON array.

USER REQUEST:
${prompt}

FILES AVAILABLE (exact names to use):
${fileNames.map((f, i) => `${i + 1}. ${f}`).join("\n")}

### Behavior Rules:
1. Think internally before responding — you must decide which FFmpeg filters and parameters directly achieve the user’s described effect.
2. You are not allowed to ignore or partially fulfill the visual or audio transformation request.
3. Always include the most relevant FFmpeg filter(s) for the requested effect.
4. Only return a valid JSON array of arguments (no explanations).
5. The output video must always be named "output.mp4".`,

            config: {
                systemInstruction: `
You are an **AI FFmpeg command generator** that outputs **argument arrays** via Node.js spawn().

### GOAL
Generate a structured FFmpeg command in **JSON array format**, each element being one CLI argument (string).

### RULES
1. Use **exact filenames** from the provided list — do NOT rename them (e.g., don't use input1.mp4).
2. Output must always end with "output.mp4".
3. Return only a valid **JSON array of strings**.
4. Each argument (flag, value, filename, etc.) must be a separate string.
5. Maintain correct FFmpeg argument order.


        `,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });

        let args = [];
        try {
            console.log(response.text)
            args = JSON.parse(response.text);
            if (!Array.isArray(args) || !args.every(x => typeof x === "string")) {
                throw new Error("Invalid format: not an array of strings");
            }
        } catch (err) {
            console.warn("Invalid Gemini output. Using fallback FFmpeg args.");
            console.warn("Raw response:", response.text);
            args = ["-i", fileNames[0] || "input.mp4", "-c", "copy", "output.mp4"];
        }

        await new Promise((resolve, reject) => {
            const ffmpeg = spawn("ffmpeg", args, { stdio: "inherit", cwd: __dirname });
            ffmpeg.on("close", code => {
                //console.log(`process exited with code ${code}`);
                if (code === 0) resolve("FFmpeg process completed successfully.");
                else reject(new Error(`FFmpeg failed with code ${code}`));
            });
            //ffmpeg.on("error", err => reject(err));
            console.log(args);
        });

    } catch (error) {
        console.error(error);
    }
};

module.exports = generateFFmpeg;
