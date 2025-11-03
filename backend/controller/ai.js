const path = require("path");
const filterBuilder = require("./filterBuilder");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
async function main() {
    const { GoogleGenAI, Type } = await import("@google/genai");

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // call model
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "hello",
        config: {

            systemInstruction: `
You are an AI command generator for an FFmpeg wrapper that uses a predefined JavaScript object called filterBuilder.

### Context
Each filter in filterBuilder returns an object with:
            {
                type: "video" | "audio" | "complex",
                cmd: "<ffmpeg command>",
                extraInputs?: ["<optional input paths>"]
            }

These filters are then composed into ffmpeg arguments using buildFilters().

### Available Filters(from filterBuilder)
🎞️ VIDEO FILTERS
        - resizeFilter(width, height): Resize the video.
- changeAspectRatioFilter(width, height): Change the video’s aspect ratio.
- adjustSaturationFilter(saturation = 1.5, gamma = 1.0): Adjust color saturation and gamma.
- adjustHueFilter(hue = 0.5, saturation = 1.0): Adjust hue and saturation.
- drawTextFilter(text, font, size = 48, color = "white"): Draw static text at the bottom center.
- animateTextFilter(text, font, size = 48, color = "white"): Animate text moving upward over time.
- burnSrtFilter(srtFile): Burn subtitles from an SRT file.
- burnSrtStyledFilter(srtFile, fontSize = 30, color = "&H00FFFF&"): Burn SRT subtitles with custom styling.
- burnAssFilter(assFile): Burn subtitles from an ASS file.
- stabilizeFilter(): Stabilize video.
- trimFilter(start, end): Trim video from start to end time.

🔊 AUDIO FILTERS
        - increaseVolumeFilter(factor = 2.0): Increase audio volume.
- decreaseVolumeFilter(factor = 0.5): Decrease audio volume.
- audioTrimFilter(start, end): Trim audio from start to end time.

🧩 COMPLEX FILTERS(multi - input)
        - overlayImageFilter(overlayPath, x = 0, y = 0): Overlay an image at(x, y).
- mergeTopBottomFilter(bottomPath): Stack another video below the current one vertically.
- crossfadeFilter(video2Path, duration = 1, offset = 4): Apply crossfade transition between two videos.

### Task
Given a natural - language user request, output an ** ordered list ** of filters to apply based on intent.

If the request does not clearly match any available filter, return this exact fallback JSON:
    [
        { "command": "no command found", "args": ["unrecognized or unsupported request"] }
    ]

### Output Format(STRICT)
Return ONLY a valid JSON array.  
Each element must follow this format:
    {
        "command": "<filterNameFromAbove>",
            "args": [<ordered arguments> ]
}

                ### Example
                [
                {"command": "resizeFilter", "args": [1280, 720] },
                {"command": "adjustSaturationFilter", "args": [1.5, 1.0] },
                {"command": "audioTrimFilter", "args": [0, 10] }
                ]

                ### Rules
                1. Use only filters listed above — no new or inferred ones.
                2. Match argument order exactly as defined.
                3. Use correct data types: numbers for numeric args, strings for text or paths.
                4. Output must be a single valid JSON array — no markdown or explanation.
                5. If none of the filters match the request, return:
                [
                {"command": "no command found", "args": ["unrecognized or unsupported request"] }
                ]
                6. Maintain logical ordering of filters based on user intent (e.g., trim → filter → overlay).
                `,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        command: {
                            type: Type.STRING,
                        },
                        args: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.NUMBER
                            }
                        }
                    }
                }
            }
        }
    });

    console.log(response.text);
}

main().catch(console.error);
