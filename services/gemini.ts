
import { GoogleGenAI, Modality } from "@google/genai";
import { Language, LANGUAGES, ScanMode } from '../types';

/**
 * Robust content generation using Vercel's injected environment variables.
 */
export const describeScene = async (base64Image: string, language: Language, mode: ScanMode): Promise<string> => {
  // Always initialize with fresh key to prevent stale context in some serverless environments
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "").trim();
    const langName = LANGUAGES[language].name;

    let prompt = "";
    if (mode === ScanMode.DOCUMENT) {
      prompt = `You are an expert OCR assistant for a blind person. 
      Read and transcribe ALL text in this image. 
      If it's a product label, emphasize the name and key details. 
      Respond ONLY in ${langName}.`;
    } else {
      prompt = `Act as eyes for a blind person. Focus on safety and immediate surroundings. 
      Mention obstacles, hazards, people nearby, and the overall context. 
      Speak directly to the user. Respond ONLY in ${langName}. Do not mention you are an AI.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        role: 'user',
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
          { text: prompt },
        ],
      }],
    });
    
    return response.text || "I couldn't identify the scene. Please try again.";
  } catch (error: any) {
    console.error("Vercel AI Service Error:", error);
    throw new Error("Analysis failed. Please check your network.");
  }
};

export const generateSpeech = async (text: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("Audio generation failed.");
    return base64Audio;
  } catch (error) {
    console.error("Vercel TTS Service Error:", error);
    throw new Error("Speech failed.");
  }
};

export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
