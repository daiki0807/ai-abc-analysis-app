
import { GoogleGenAI } from "@google/genai";
import { Student, ABCAnalysisData } from '../types';
import { getPrompt } from '../constants';

const getAIFeedback = async (
  student: Pick<Student, 'name' | 'grade'>,
  analysisData: ABCAnalysisData
): Promise<string> => {
  if (!process.env.API_KEY) {
    const errorMessage = "Gemini APIキーが設定されていません。";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const prompt = getPrompt(student, analysisData);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.6,
        topP: 1,
        topK: 32,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error("APIキーが無効です。正しいAPIキーが設定されているか確認してください。");
        }
        throw new Error(`AIからのフィードバック取得中にエラーが発生しました: ${error.message}`);
    }
    throw new Error("AIからのフィードバック取得中に不明なエラーが発生しました。");
  }
};

export { getAIFeedback };
