import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSiteDescription = async (
  topic: string, 
  name: string, 
  lang: Language
): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key provided for Gemini.");
    return lang === 'en' 
      ? `Welcome to ${name}, the premier destination for ${topic}.`
      : `مرحباً بك في ${name}، الوجهة الأولى لـ ${topic}.`;
  }

  try {
    const prompt = lang === 'en' 
      ? `Write a short, sophisticated, catchy 2-sentence mission statement for a website named "${name}" about "${topic}". Do not include quotes.`
      : `اكتب وصفاً قصيراً وجذاباً واحترافياً من جملتين لموقع ويب يسمى "${name}" يدور حول "${topic}". لا تضع علامات تنصيص.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return lang === 'en' 
      ? `Welcome to ${name}, defining excellence in ${topic}.`
      : `مرحباً بك في ${name}، حيث نحدد التميز في مجال ${topic}.`;
  }
};

export const generateSiteNameSuggestion = async (topic: string, lang: Language): Promise<string> => {
   if (!process.env.API_KEY) return lang === 'en' ? 'AEMAM Concepts' : 'أفكار زمام';

   try {
     const prompt = lang === 'en'
      ? `Generate a single, modern, one or two word brand name for a ${topic} business. Output ONLY the name.`
      : `اقترح اسماً واحداً عصرياً ومميزاً لعلامة تجارية في مجال ${topic}. اكتب الاسم فقط بدون أي كلمات إضافية.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text?.trim() || (lang === 'en' ? 'Untitled Site' : 'موقع جديد');
   } catch (error) {
     return lang === 'en' ? 'Untitled Site' : 'موقع جديد';
   }
}

export const predictTopics = async (query: string, lang: Language): Promise<string[]> => {
  if (!process.env.API_KEY || !query) return [];

  try {
    const prompt = lang === 'en'
      ? `List 6 specific, relevant, and modern website niches or business types related to "${query}". Return ONLY a raw JSON array of strings (e.g. ["Niche 1", "Niche 2"]). No markdown.`
      : `اقترح 6 تخصصات دقيقة وحديثة لمواقع ويب متعلقة بـ "${query}". أرجع فقط مصفوفة JSON نصية (مثل ["تخصص 1", "تخصص 2"]). بدون ماركداون.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    
    const text = response.text?.trim() || "[]";
    // Clean up if markdown code blocks exist (though responseMimeType usually handles it)
    const jsonStr = text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error(error);
    return [];
  }
};