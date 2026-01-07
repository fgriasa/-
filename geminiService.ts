
import { GoogleGenAI, Type } from "@google/genai";
import { ColorInfo } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generatePalette(prompt: string): Promise<ColorInfo[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `根據以下主題生成一個包含 5 個顏色的專業調色盤：${prompt}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: "顏色在該主題中的描述性名稱 (繁體中文)",
              },
              hex: {
                type: Type.STRING,
                description: "顏色的 Hex 代碼，格式如 #RRGGBB",
              },
            },
            required: ["name", "hex"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as ColorInfo[];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
