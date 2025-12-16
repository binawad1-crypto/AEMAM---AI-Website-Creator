
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
      ? `You are a world-class Web Designer & Art Director. 
         Your goal is to design a BREATHTAKING, unique landing page concept for a "${topic}" business named "${name}".
         
         TASKS:
         1. **Visual Strategy:** Analyze the topic. 
            - If it's high-end (jewelry, law, real estate, consulting), use 'luxury'.
            - If it's tech/startup/app, use 'saas'.
            - If it's creative/fashion/art/gym, use 'bold'.
            - If it's lifestyle/blog/minimalist/writing, use 'minimal'.
         2. **Hero Section (The Masterpiece):** Write a headline that is short, punchy, and emotionally resonant. Not generic.
         3. **Imagery:** Describe the hero image in 'hero_image_prompt' with cinematic lighting, specific composition, and high resolution keywords (e.g., "8k, cinematic lighting, photorealistic, depth of field, elegant").
         4. **Content:** Populate all fields with professional, persuasive copy.

         Return JSON.`
      : `أنت مصمم ويب ومخرج فني عالمي.
         هدفك هو تصميم مفهوم صفحة هبوط مذهلة وفريدة من نوعها لنشاط "${topic}" باسم "${name}".

         المهام:
         1. **استراتيجية بصرية:** حلل النشاط.
            - إذا كان راقياً (مجوهرات، قانون، عقارات)، استخدم 'luxury'.
            - إذا كان تقنياً/شركة ناشئة، استخدم 'saas'.
            - إذا كان إبداعياً/أزياء/فن، استخدم 'bold'.
            - إذا كان أسلوب حياة/تدوين/بسيط، استخدم 'minimal'.
         2. **قسم الواجهة (التحفة الفنية):** اكتب عنواناً قصيراً، قوياً، ومؤثراً عاطفياً. تجنب العبارات العامة.
         3. **الصور:** صف صورة الواجهة في 'hero_image_prompt' (باللغة الإنجليزية) بإضاءة سينمائية وتكوين دقيق (مثال: "8k, cinematic lighting, photorealistic").
         4. **المحتوى:** املأ جميع الحقول بنصوص احترافية ومقنعة.

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
