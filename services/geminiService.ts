
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Existing Functions...
export const generateSiteDescription = async (
  topic: string, 
  name: string, 
  lang: Language
): Promise<string> => {
  if (!process.env.API_KEY) {
    return lang === 'en' 
      ? `Welcome to ${name}, the premier destination for ${topic}.`
      : `مرحباً بك في ${name}، الوجهة الأولى لـ ${topic}.`;
  }

  try {
    const prompt = lang === 'en' 
      ? `Write a short, sophisticated, catchy 2-sentence mission statement for a website named "${name}" about "${topic}".`
      : `اكتب وصفاً قصيراً وجذاباً واحترافياً من جملتين لموقع ويب يسمى "${name}" يدور حول "${topic}".`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "";
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
      ? `List 6 specific, relevant, and modern website niches or business types related to "${query}". Return ONLY a raw JSON array of strings.`
      : `اقترح 6 تخصصات دقيقة وحديثة لمواقع ويب متعلقة بـ "${query}". أرجع فقط مصفوفة JSON نصية.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    
    const text = response.text?.trim() || "[]";
    const jsonStr = text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    return [];
  }
};

// --- NEW SMART GENERATION FUNCTION ---
export interface GeneratedSiteContent {
  hero_title: string;
  hero_subtitle: string;
  hero_cta: string;
  about_title: string;
  about_desc: string;
  features_title: string;
  feature_1_title: string;
  feature_1_desc: string;
  feature_2_title: string;
  feature_2_desc: string;
  feature_3_title: string;
  feature_3_desc: string;
  image_style_keyword: string; 
  hero_image_prompt: string;
  layout_style: 'luxury' | 'saas' | 'bold' | 'minimal'; // New field for Art Direction
}

export const generateTailoredContent = async (topic: string, name: string, lang: Language): Promise<GeneratedSiteContent | null> => {
  if (!process.env.API_KEY) return null;

  try {
    const prompt = lang === 'en' 
      ? `You are an award-winning Art Director and Copywriter. Create a complete website concept for "${topic}" named "${name}".
         
         TASKS:
         1. **Analyze Vibe:** Determine if this business needs a 'luxury' (high-end, serif), 'saas' (tech, gradients), 'bold' (creative, big text), or 'minimal' (clean, photography) look.
         2. **Write Content:** Create catchy headlines (Hero) and professional descriptions.
         3. **Art Direction:** 
            - 'layout_style': Choose one of ['luxury', 'saas', 'bold', 'minimal'].
            - 'image_style_keyword': A phrase describing the visual aesthetic (e.g., "Dark moody lighting with gold accents").
            - 'hero_image_prompt': A descriptive prompt for a high-quality hero image.
         
         Return JSON.`
      : `أنت مخرج فني وكاتب إبداعي حائز على جوائز. قم بإنشاء مفهوم موقع ويب متكامل لـ "${topic}" باسم "${name}".

         المهام:
         1. **تحليل النمط (Vibe):** حدد ما إذا كان هذا النشاط يحتاج إلى نمط 'luxury' (فخم، راقي)، 'saas' (تقني، شركات ناشئة)، 'bold' (إبداعي، جريء)، أو 'minimal' (بسيط، يركز على الصور).
         2. **كتابة المحتوى:** اكتب عناوين جذابة (للواجهة) وأوصاف احترافية باللغة العربية.
         3. **الإخراج الفني:**
            - 'layout_style': اختر واحداً من ['luxury', 'saas', 'bold', 'minimal'].
            - 'image_style_keyword': (بالانجليزية) عبارة تصف الطابع البصري.
            - 'hero_image_prompt': (بالانجليزية) وصف دقيق لصورة الواجهة.

         أرجع النتيجة بصيغة JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hero_title: { type: Type.STRING },
            hero_subtitle: { type: Type.STRING },
            hero_cta: { type: Type.STRING },
            about_title: { type: Type.STRING },
            about_desc: { type: Type.STRING },
            features_title: { type: Type.STRING },
            feature_1_title: { type: Type.STRING },
            feature_1_desc: { type: Type.STRING },
            feature_2_title: { type: Type.STRING },
            feature_2_desc: { type: Type.STRING },
            feature_3_title: { type: Type.STRING },
            feature_3_desc: { type: Type.STRING },
            image_style_keyword: { type: Type.STRING },
            hero_image_prompt: { type: Type.STRING },
            layout_style: { type: Type.STRING, enum: ['luxury', 'saas', 'bold', 'minimal'] }
          },
          required: ['hero_title', 'hero_subtitle', 'layout_style', 'hero_image_prompt']
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedSiteContent;
    }
    return null;
  } catch (error) {
    console.error("Smart Content Generation Failed:", error);
    return null;
  }
}
