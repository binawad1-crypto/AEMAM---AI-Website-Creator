import React, { useState, useEffect } from 'react';
import { SiteConfig, PALETTES, FONT_PAIRS } from '../types';
import { AlignLeft, Mail, Edit2, X, Save, Star, Users, HelpCircle, CreditCard, Newspaper, Send, CheckCircle, Zap, Facebook, Twitter, Instagram, Linkedin, Globe, Image as ImageIcon, ArrowRight, PlayCircle } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface PreviewFrameProps {
  config: SiteConfig;
  lang: 'en' | 'ar';
  editable?: boolean;
  onUpdate?: (key: string, value: string) => void;
  onEditImage?: (context: string) => void; 
}

interface EditableWrapperProps {
  children?: React.ReactNode;
  editable?: boolean;
  label: string;
  onClick?: () => void;
  className?: string;
}

// Wrapper for Text/Sections
const EditableWrapper = ({ children, editable, label, onClick, className = '' }: EditableWrapperProps) => {
  if (!editable) return <div className={className}>{children}</div>;
  return (
    <div 
      onClick={onClick}
      className={`group relative border-2 border-transparent hover:border-blue-500 transition-all duration-200 cursor-default ${className}`}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-30 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full cursor-pointer shadow-lg flex items-center gap-2 pointer-events-none whitespace-nowrap">
        <Edit2 className="w-3 h-3" />
        <span>{label}</span>
      </div>
      {children}
    </div>
  )
}

// Wrapper specifically for Images
const ImageEditableWrapper = ({ children, editable, context, onEdit }: { children?: React.ReactNode, editable?: boolean, context: string, onEdit?: (c: string) => void }) => {
   if (!editable || !onEdit) return <>{children}</>;
   
   return (
     <div className="relative group w-full h-full cursor-pointer overflow-hidden isolate" onClick={(e) => { e.stopPropagation(); onEdit(context); }}>
        {children}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-10">
           <div className="bg-white/90 backdrop-blur-md text-black px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-105">
              <ImageIcon className="w-4 h-4" />
              <span>Edit Image</span>
           </div>
        </div>
     </div>
   );
}

interface EditPanelProps {
  section: string;
  onClose: () => void;
  lang: 'en' | 'ar';
  inputs: { key: string, label: string, value: string, type?: 'text' | 'textarea' }[];
  onUpdate: (key: string, value: string) => void;
}

const EditPanel: React.FC<EditPanelProps> = ({ section, onClose, lang, inputs, onUpdate }) => {
  const isRTL = lang === 'ar';
  return (
    <div className={`fixed top-0 bottom-0 w-80 bg-white dark:bg-neutral-900 border-x border-gray-200 dark:border-neutral-800 shadow-2xl z-50 p-6 flex flex-col transition-transform duration-300 ${isRTL ? 'left-0' : 'right-0'}`}>
       <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold uppercase tracking-wider">{section}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full"><X className="w-5 h-5" /></button>
       </div>
       
       <div className="flex-1 overflow-y-auto space-y-6">
          {inputs.map((input) => (
            <div key={input.key}>
              <label className="block text-xs font-bold uppercase tracking-wide opacity-60 mb-2">{input.label}</label>
              {input.type === 'textarea' ? (
                <textarea 
                  value={input.value}
                  onChange={(e) => onUpdate(input.key, e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm min-h-[100px] focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ) : (
                <input 
                  type="text"
                  value={input.value}
                  onChange={(e) => onUpdate(input.key, e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              )}
            </div>
          ))}
       </div>

       <div className="pt-6 border-t border-gray-200 dark:border-neutral-800">
          <button onClick={onClose} className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-bold text-sm flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            {lang === 'en' ? 'Done' : 'تم'}
          </button>
       </div>
    </div>
  );
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ config, lang, editable, onUpdate, onEditImage }) => {
  const palette = PALETTES.find(p => p.id === config.palette) || PALETTES[0];
  const fonts = FONT_PAIRS.find(f => f.id === config.fontPair) || FONT_PAIRS[0];
  const t = TRANSLATIONS[lang];

  const [bg, surface, text, accent] = palette.colors;
  const isRTL = lang === 'ar';
  
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (config.customFont) {
      const linkId = 'custom-google-font';
      let link = document.getElementById(linkId) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      const fontName = config.customFont.replace(/\s+/g, '+');
      link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@300;400;500;700;800&display=swap`;
    }
  }, [config.customFont]);

  const getContent = (key: string, fallback: string) => config.content?.[key] || fallback;
  
  const getImage = (context: string) => {
    const overrideKey = `_image_override_${context}`;
    const specificOverrides: Record<string, string> = {
        'hero': '_hero_image_override',
        'team office': '_about_image_override',
    };
    const finalKey = specificOverrides[context] || overrideKey;
    if (config.content?.[finalKey]) return config.content[finalKey];

    const visualStyle = config.content?.['_visual_style'] || config.topic || 'minimalist abstract';
    let prompt = `${visualStyle} ${context}`;
    if (context === 'hero' && config.content?.['_hero_image_prompt']) {
        prompt = config.content['_hero_image_prompt'];
    }
    const encoded = encodeURIComponent(prompt);
    // Increase resolution for hero images specifically
    const width = context === 'hero' ? 1600 : 800;
    const height = context === 'hero' ? 1200 : 600;
    
    return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true&seed=${config.name.length + context.length}`;
  }

  const getInputsForSection = () => {
     switch(activeSection) {
      case 'header': return [{ key: 'nav_title', label: 'Site Title', value: getContent('nav_title', config.name) }];
      case 'hero': return [
        { key: 'hero_title', label: 'Headline', value: getContent('hero_title', 'Headline'), type: 'textarea' as const },
        { key: 'hero_subtitle', label: 'Subheadline', value: getContent('hero_subtitle', 'Subtitle'), type: 'textarea' as const },
        { key: 'hero_cta', label: 'Button Text', value: getContent('hero_cta', 'Action') }
      ];
      case 'features': return [
        { key: 'features_title', label: 'Section Title', value: getContent('features_title', lang === 'en' ? 'Core Features' : 'أهم المميزات') },
        { key: 'feature_1_title', label: 'Feature 1', value: getContent('feature_1_title', lang === 'en' ? 'Fast Performance' : 'أداء سريع') },
        { key: 'feature_2_title', label: 'Feature 2', value: getContent('feature_2_title', lang === 'en' ? 'Secure' : 'آمن تماماً') },
        { key: 'feature_3_title', label: 'Feature 3', value: getContent('feature_3_title', lang === 'en' ? 'Support' : 'دعم فني') },
      ];
      case 'about': return [
        { key: 'about_title', label: 'Title', value: getContent('about_title', lang === 'en' ? 'About Us' : 'من نحن') },
        { key: 'about_desc', label: 'Description', value: getContent('about_desc', lang === 'en' ? 'We are a dedicated team committed to delivering excellence.' : 'نحن فريق متفاني ملتزم بتقديم التميز.'), type: 'textarea' as const }
      ];
      case 'services': return [
        { key: 'services_title', label: 'Section Title', value: getContent('services_title', lang === 'en' ? 'Our Expertise' : 'خبراتنا') },
        { key: 'service_1_title', label: 'Service 1 Title', value: getContent('service_1_title', lang === 'en' ? 'Service 1' : 'خدمة 1') },
        { key: 'service_1_desc', label: 'Service 1 Desc', value: getContent('service_1_desc', lang === 'en' ? 'Lorem ipsum dolor sit amet.' : 'لوريم إيبسوم دولار سيت أميت.'), type: 'textarea' as const },
      ];
      case 'testimonials': return [
        { key: 'testimonials_title', label: 'Title', value: getContent('testimonials_title', lang === 'en' ? 'Testimonials' : 'آراء العملاء') },
        { key: 'testimonial_1_text', label: 'Review 1', value: getContent('testimonial_1_text', lang === 'en' ? 'Amazing service! Highly recommended.' : 'خدمة مذهلة! أنصح بها بشدة.'), type: 'textarea' as const },
      ];
      case 'team': return [
        { key: 'team_title', label: 'Title', value: getContent('team_title', lang === 'en' ? 'Our Team' : 'فريق العمل') },
      ];
      case 'pricing': return [
        { key: 'pricing_title', label: 'Title', value: getContent('pricing_title', lang === 'en' ? 'Pricing Plans' : 'باقات الأسعار') },
        { key: 'price_1', label: 'Basic Price', value: getContent('price_1', '$29') },
      ];
      case 'faq': return [
        { key: 'faq_title', label: 'Title', value: getContent('faq_title', lang === 'en' ? 'FAQ' : 'الأسئلة الشائعة') },
      ];
      case 'blog': return [
        { key: 'blog_title', label: 'Title', value: getContent('blog_title', lang === 'en' ? 'Latest News' : 'آخر الأخبار') },
      ];
      case 'newsletter': return [
         { key: 'newsletter_title', label: 'Title', value: getContent('newsletter_title', lang === 'en' ? 'Subscribe' : 'اشترك معنا') },
      ];
      case 'contact': return [
        { key: 'contact_title', label: 'Title', value: getContent('contact_title', lang === 'en' ? 'Let\'s Work Together' : 'دعنا نعمل معاً') },
        { key: 'contact_btn', label: 'Button Text', value: getContent('contact_btn', lang === 'en' ? 'Submit' : 'إرسال') }
      ];
      case 'footer': return [
        { key: 'footer_desc', label: 'Company Description', value: getContent('footer_desc', lang === 'en' ? 'Building the future of digital experiences.' : 'نبني مستقبل التجارب الرقمية.'), type: 'textarea' as const },
        { key: 'footer_text', label: 'Copyright Text', value: getContent('footer_text', `© 2024 ${config.name || 'Zemam'}. ${lang === 'en' ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}`) },
        { key: 'social_twitter', label: 'Twitter URL', value: getContent('social_twitter', '#') },
        { key: 'social_instagram', label: 'Instagram URL', value: getContent('social_instagram', '#') },
        { key: 'social_linkedin', label: 'LinkedIn URL', value: getContent('social_linkedin', '#') },
      ];
      default: return [];
    }
  }

  const activeFontStyle = config.customFont 
    ? { fontFamily: `"${config.customFont}", sans-serif` } 
    : undefined;

  const headingClass = config.customFont ? '' : fonts.heading;
  const bodyClass = config.customFont ? '' : fonts.body;

  // --- DYNAMIC LAYOUT ENGINE ---
  // Default to 'saas' (standard modern) if no AI preference
  const layoutStyle = config.content?.['_layout_style'] || 'saas'; 

  // 1. LUXURY LAYOUT (High-end, Centered, Serif often, Dark/Gold vibes)
  const renderLuxuryHero = () => (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 overflow-hidden">
       <div className="absolute inset-0 z-0">
          <ImageEditableWrapper editable={editable} context="hero" onEdit={onEditImage}>
             <img src={getImage('hero')} className="w-full h-full object-cover opacity-100 transition-transform duration-[20s] hover:scale-110" alt="Hero" />
          </ImageEditableWrapper>
          <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>
       </div>
       <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8 text-white">
          <div className="inline-block border-t border-b border-white/30 py-2 px-8 mb-4">
             <span className="text-sm font-medium tracking-[0.3em] uppercase">{config.topic || 'Exclusive'}</span>
          </div>
          <h1 className={`text-5xl md:text-7xl lg:text-8xl font-serif leading-tight ${headingClass}`}>
             {getContent('hero_title', config.description ? config.description.split('.')[0] : 'Elegant Design')}
          </h1>
          <p className={`text-lg md:text-xl opacity-90 leading-relaxed max-w-2xl mx-auto font-light ${bodyClass}`}>
             {getContent('hero_subtitle', config.description || 'Experience the pinnacle of quality.')}
          </p>
          <div className="pt-8">
             <button 
               className="px-10 py-4 bg-white text-black text-sm font-bold tracking-widest uppercase hover:bg-opacity-90 transition-all duration-300 transform hover:-translate-y-1"
             >
                {getContent('hero_cta', 'Discover More')}
             </button>
          </div>
       </div>
    </section>
  );

  // 2. SAAS / TECH LAYOUT (Modern, Left Aligned, Glassmorphism, Floating UI)
  const renderSaasHero = () => (
    <section className="relative px-6 py-20 md:py-32 overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-neutral-900 dark:to-neutral-950" style={{ backgroundColor: bg }}>
       {/* Abstract Background Shapes */}
       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
       <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
       
       <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                New Launch
             </div>
             <h1 className={`text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] ${headingClass}`}>
               {getContent('hero_title', 'Build Faster.')}
             </h1>
             <p className="text-lg md:text-xl opacity-70 leading-relaxed max-w-lg">
               {getContent('hero_subtitle', 'The all-in-one platform for your digital needs.')}
             </p>
             <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  className="px-8 py-4 rounded-xl font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: text, color: bg }}
                >
                   {getContent('hero_cta', 'Get Started')}
                   {isRTL ? <ArrowRight className="w-4 h-4 rotate-180" /> : <ArrowRight className="w-4 h-4" />}
                </button>
                <button className="px-8 py-4 rounded-xl font-bold text-sm border-2 border-current hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 opacity-80">
                   <PlayCircle className="w-4 h-4" />
                   Demo Video
                </button>
             </div>
             <div className="pt-6 border-t border-gray-200 dark:border-neutral-800 opacity-60">
                <p className="text-xs font-bold uppercase tracking-wide mb-3">Trusted by teams at</p>
                <div className="flex gap-4 grayscale opacity-70">
                   {/* Fake Logos */}
                   <div className="h-6 w-20 bg-current rounded opacity-20"></div>
                   <div className="h-6 w-20 bg-current rounded opacity-20"></div>
                   <div className="h-6 w-20 bg-current rounded opacity-20"></div>
                </div>
             </div>
          </div>
          <div className="relative lg:h-[600px] w-full">
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-3xl rotate-2 opacity-10 blur-xl transform scale-95"></div>
             <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
                <div className="absolute top-4 left-4 right-4 flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-400"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                   <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="h-full w-full pt-12">
                   <ImageEditableWrapper editable={editable} context="hero" onEdit={onEditImage}>
                      <img src={getImage('hero')} className="w-full h-full object-cover" alt="Dashboard" />
                   </ImageEditableWrapper>
                </div>
             </div>
             {/* Floating Badge */}
             <div className="absolute -bottom-6 -left-6 p-4 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-gray-100 dark:border-neutral-700 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                      <Zap className="w-5 h-5 fill-current" />
                   </div>
                   <div>
                      <div className="text-xs font-bold opacity-60">Efficiency</div>
                      <div className="font-bold">+125%</div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </section>
  );

  // 3. BOLD / CREATIVE LAYOUT (Huge Text, Brutalist hints, High Contrast)
  const renderBoldHero = () => (
    <section className="relative px-6 py-24 border-b-4 border-black dark:border-white" style={{ backgroundColor: accent }}>
       <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 items-end">
             <div className="lg:col-span-8 space-y-6">
                <h1 className={`text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.9] text-white`}>
                   {getContent('hero_title', 'Make It Bold.')}
                </h1>
                <div className="w-32 h-4 bg-white mb-8"></div>
             </div>
             <div className="lg:col-span-4 text-white pb-4">
                <p className="text-xl md:text-2xl font-bold leading-tight mb-8">
                   {getContent('hero_subtitle', 'We disrupt the ordinary with designs that scream attention.')}
                </p>
                <button className="w-full py-6 bg-white text-black text-xl font-black uppercase tracking-widest hover:bg-black hover:text-white border-4 border-white transition-colors">
                   {getContent('hero_cta', 'Start Now')}
                </button>
             </div>
          </div>
          <div className="mt-12 w-full h-[400px] md:h-[600px] border-4 border-white relative overflow-hidden group">
             <ImageEditableWrapper editable={editable} context="hero" onEdit={onEditImage}>
                <img src={getImage('hero')} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Bold Hero" />
             </ImageEditableWrapper>
             <div className="absolute top-4 left-4 bg-black text-white px-4 py-1 font-mono text-sm uppercase font-bold pointer-events-none">
               Figure 01.
             </div>
          </div>
       </div>
    </section>
  );

  // 4. MINIMAL LAYOUT (Clean, Photography Focused, Simple Typography)
  const renderMinimalHero = () => (
    <section className="pt-32 pb-20 px-6">
       <div className="max-w-6xl mx-auto text-center space-y-8 mb-20">
          <h1 className={`text-5xl md:text-6xl font-medium tracking-tight ${headingClass}`}>
             {getContent('hero_title', 'Simplicity is key.')}
          </h1>
          <p className="text-lg opacity-60 max-w-xl mx-auto leading-relaxed">
             {getContent('hero_subtitle', 'Focusing on what truly matters in design and life.')}
          </p>
          <button className="text-sm font-bold border-b-2 border-current pb-1 hover:opacity-50 transition-opacity">
             {getContent('hero_cta', 'Explore Collection')}
          </button>
       </div>
       <div className="max-w-7xl mx-auto px-4">
          <div className="aspect-[16/9] md:aspect-[21/9] bg-gray-100 overflow-hidden relative">
             <ImageEditableWrapper editable={editable} context="hero" onEdit={onEditImage}>
                <img src={getImage('hero')} className="w-full h-full object-cover" alt="Minimal" />
             </ImageEditableWrapper>
          </div>
       </div>
    </section>
  );

  // Select the Hero based on layoutStyle
  const renderHero = () => {
     switch (layoutStyle) {
        case 'luxury': return renderLuxuryHero();
        case 'bold': return renderBoldHero();
        case 'minimal': return renderMinimalHero();
        case 'saas': default: return renderSaasHero();
     }
  }

  // --- STANDARD SECTIONS (Reused across layouts but styled with palette) ---
  // Note: We're keeping these consistent for now to ensure robustness, 
  // but in a full app, we'd have variants for these too.

  return (
    <div 
      className={`w-full h-full overflow-y-auto bg-white transition-colors duration-500 ease-in-out ${bodyClass} ${editable ? 'select-none' : ''}`}
      style={{ backgroundColor: bg, color: text, direction: isRTL ? 'rtl' : 'ltr', ...activeFontStyle }}
    >
      {activeSection && editable && onUpdate && (
        <EditPanel 
          section={activeSection} 
          onClose={() => setActiveSection(null)} 
          lang={lang} 
          inputs={getInputsForSection()}
          onUpdate={onUpdate}
        />
      )}

      {/* Navigation Stub - Adapts to Luxury Dark Mode if needed */}
      <EditableWrapper 
        editable={editable} 
        label={lang === 'en' ? 'Edit Header' : 'تعديل الرأس'}
        onClick={() => setActiveSection('header')}
      >
        <nav className={`p-6 flex justify-between items-center sticky top-0 z-40 backdrop-blur-md transition-colors ${layoutStyle === 'luxury' ? 'bg-black/20 text-white' : 'bg-opacity-90'}`} style={layoutStyle !== 'luxury' ? { backgroundColor: bg } : {}}>
          <div className={`text-xl font-bold tracking-tight ${headingClass}`}>{getContent('nav_title', config.name || (lang === 'en' ? 'Site Title' : 'عنوان الموقع'))}</div>
          <div className="hidden md:flex gap-6 text-sm font-medium opacity-70">
            <span>{lang === 'en' ? 'Work' : 'أعمالنا'}</span>
            <span>{lang === 'en' ? 'About' : 'من نحن'}</span>
            <span>{lang === 'en' ? 'Contact' : 'اتصل بنا'}</span>
          </div>
        </nav>
      </EditableWrapper>

      {/* DYNAMIC HERO SECTION */}
      <EditableWrapper 
        editable={editable} 
        label={lang === 'en' ? 'Edit Hero' : 'تعديل الواجهة'}
        onClick={() => setActiveSection('hero')}
        className="w-full"
      >
         {renderHero()}
      </EditableWrapper>

      {/* Features Section */}
      {config.structure.includes('features') && (
        <EditableWrapper 
          editable={editable} 
          label={lang === 'en' ? 'Edit Features' : 'تعديل المميزات'}
          onClick={() => setActiveSection('features')}
        >
          <section className="py-24 px-6" style={{ backgroundColor: surface }}>
            <div className="max-w-6xl mx-auto">
               <div className="text-center mb-16">
                 <h2 className={`text-3xl font-bold mb-4 ${headingClass}`}>{getContent('features_title', lang === 'en' ? 'Core Features' : 'أهم المميزات')}</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="flex flex-col items-center text-center p-6 transition-transform hover:-translate-y-2 duration-300">
                      <div className="w-14 h-14 rounded-2xl bg-current opacity-10 flex items-center justify-center mb-6">
                        {i === 1 ? <Zap className="w-6 h-6" /> : i === 2 ? <CheckCircle className="w-6 h-6" /> : <Star className="w-6 h-6" />}
                      </div>
                      <h3 className="text-xl font-bold mb-3">{getContent(`feature_${i}_title`, lang === 'en' ? `Feature ${i}` : `ميزة ${i}`)}</h3>
                      <p className="opacity-60 text-sm leading-relaxed">{getContent(`feature_${i}_desc`, lang === 'en' ? 'Details about this amazing feature go here.' : 'تفاصيل حول هذه الميزة الرائعة تذهب هنا.')}</p>
                   </div>
                 ))}
               </div>
            </div>
          </section>
        </EditableWrapper>
      )}

      {/* About Section */}
      {config.structure.includes('about') && (
        <EditableWrapper 
          editable={editable} 
          label={lang === 'en' ? 'Edit About' : 'تعديل من نحن'}
          onClick={() => setActiveSection('about')}
        >
          <section className="py-24 px-6 overflow-hidden">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
               <div className="flex-1 space-y-8 relative z-10">
                 <h2 className={`text-4xl md:text-5xl font-bold leading-tight ${headingClass}`}>{getContent('about_title', lang === 'en' ? 'About Us' : 'من نحن')}</h2>
                 <p className="text-lg opacity-70 leading-relaxed font-light">
                   {getContent('about_desc', lang === 'en' ? 'We are a dedicated team committed to delivering excellence. Our journey began with a simple idea and has grown into a passion for creating value.' : 'نحن فريق متفاني ملتزم بتقديم التميز. بدأت رحلتنا بفكرة بسيطة ونمت لتصبح شغفاً لخلق القيمة.')}
                 </p>
                 <button className="text-sm font-bold border-b border-current pb-1">{lang === 'en' ? 'Learn More' : 'اقرأ المزيد'}</button>
               </div>
               <div className="flex-1 w-full relative">
                  <div className="absolute inset-0 bg-current opacity-5 transform translate-x-4 translate-y-4 rounded-2xl"></div>
                  <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden relative shadow-xl">
                    <ImageEditableWrapper editable={editable} context="team office" onEdit={onEditImage}>
                        <img src={getImage('team office')} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="About" />
                    </ImageEditableWrapper>
                  </div>
               </div>
            </div>
          </section>
        </EditableWrapper>
      )}

      {/* Services Section */}
      {config.structure.includes('services') && (
        <EditableWrapper 
          editable={editable} 
          label={lang === 'en' ? 'Edit Services' : 'تعديل الخدمات'}
          onClick={() => setActiveSection('services')}
        >
          <section className="py-24 px-6" style={{ backgroundColor: surface }}>
            <div className="max-w-6xl mx-auto">
               <h2 className={`text-3xl font-bold mb-16 ${headingClass}`}>{getContent('services_title', lang === 'en' ? 'Our Expertise' : 'خبراتنا')}</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="group p-8 border border-opacity-10 border-current rounded-xl hover:border-opacity-100 hover:shadow-xl transition-all bg-white dark:bg-neutral-800/50">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-white/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <AlignLeft className="w-6 h-6 opacity-70" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{getContent(`service_${i}_title`, lang === 'en' ? `Service ${i}` : `خدمة ${i}`)}</h3>
                      <p className="opacity-60 text-sm leading-relaxed">
                        {getContent(`service_${i}_desc`, lang === 'en' ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' : 'لوريم إيبسوم دولار سيت أميت ، كونشيكتيتور أدايباكسينج إليت.')}
                      </p>
                    </div>
                  ))}
               </div>
            </div>
          </section>
        </EditableWrapper>
      )}

      {/* Gallery Section */}
      {config.structure.includes('gallery') && (
        <EditableWrapper editable={editable} label={lang === 'en' ? 'Edit Gallery' : 'تعديل المعرض'}>
          <section className="py-24 px-6">
             <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`bg-gray-100 overflow-hidden relative group rounded-lg ${i === 1 ? 'col-span-2 row-span-2' : ''}`}>
                     <ImageEditableWrapper editable={editable} context={`gallery item ${i}`} onEdit={onEditImage}>
                        <img src={getImage(`gallery item ${i}`)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Gallery" />
                     </ImageEditableWrapper>
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </div>
                ))}
             </div>
          </section>
        </EditableWrapper>
      )}

      {/* Contact Section */}
      {config.structure.includes('contact') && (
        <EditableWrapper 
          editable={editable} 
          label={lang === 'en' ? 'Edit Contact' : 'تعديل التواصل'}
          onClick={() => setActiveSection('contact')}
        >
          <section className="py-24 px-6 flex justify-center text-center relative overflow-hidden" style={{ backgroundColor: accent, color: '#fff' }}>
             {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                 <div className="absolute top-[-50%] left-[-20%] w-[500px] h-[500px] bg-white rounded-full blur-[100px]"></div>
            </div>
            
            <div className="max-w-xl space-y-8 relative z-10">
               <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                 <Mail className="w-8 h-8" />
               </div>
               <h2 className={`text-4xl md:text-5xl font-bold ${headingClass}`}>{getContent('contact_title', lang === 'en' ? 'Let\'s Work Together' : 'دعنا نعمل معاً')}</h2>
               <form className="space-y-4 text-left pt-4" dir={isRTL ? 'rtl' : 'ltr'}>
                  <div className="grid grid-cols-2 gap-4">
                     <input type="text" placeholder={lang === 'en' ? 'Name' : 'الاسم'} className="w-full p-4 bg-white/10 border border-white/20 rounded-xl placeholder-white/60 focus:outline-none focus:bg-white/20 transition-colors backdrop-blur-sm" />
                     <input type="text" placeholder={lang === 'en' ? 'Phone' : 'الجوال'} className="w-full p-4 bg-white/10 border border-white/20 rounded-xl placeholder-white/60 focus:outline-none focus:bg-white/20 transition-colors backdrop-blur-sm" />
                  </div>
                  <input type="email" placeholder={lang === 'en' ? 'Email Address' : 'البريد الإلكتروني'} className="w-full p-4 bg-white/10 border border-white/20 rounded-xl placeholder-white/60 focus:outline-none focus:bg-white/20 transition-colors backdrop-blur-sm" />
                  <textarea placeholder={lang === 'en' ? 'Message' : 'الرسالة'} rows={4} className="w-full p-4 bg-white/10 border border-white/20 rounded-xl placeholder-white/60 focus:outline-none focus:bg-white/20 transition-colors backdrop-blur-sm resize-none"></textarea>
                  <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-wider rounded-xl hover:bg-opacity-90 transition-all shadow-lg transform hover:-translate-y-1">{getContent('contact_btn', lang === 'en' ? 'Submit' : 'إرسال')}</button>
               </form>
            </div>
          </section>
        </EditableWrapper>
      )}

      {/* Footer */}
      <EditableWrapper 
        editable={editable} 
        label={lang === 'en' ? 'Edit Footer' : 'تعديل التذييل'}
        onClick={() => setActiveSection('footer')}
      >
        <footer className="pt-24 pb-12 px-6 border-t border-current border-opacity-10" style={{ backgroundColor: surface }}>
           <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              <div className="space-y-6">
                 <div className={`text-2xl font-bold tracking-tight ${headingClass}`}>{getContent('nav_title', config.name || (lang === 'en' ? 'Site Title' : 'عنوان الموقع'))}</div>
                 <p className="opacity-60 text-sm leading-relaxed max-w-xs">
                   {getContent('footer_desc', lang === 'en' ? 'Building the future of digital experiences.' : 'نبني مستقبل التجارب الرقمية.')}
                 </p>
                 <div className="flex gap-4 pt-2">
                    <a href={getContent('social_twitter', '#')} className="opacity-50 hover:opacity-100 transition-opacity p-2 bg-current bg-opacity-5 rounded-full"><Twitter className="w-4 h-4" /></a>
                    <a href={getContent('social_instagram', '#')} className="opacity-50 hover:opacity-100 transition-opacity p-2 bg-current bg-opacity-5 rounded-full"><Instagram className="w-4 h-4" /></a>
                    <a href={getContent('social_linkedin', '#')} className="opacity-50 hover:opacity-100 transition-opacity p-2 bg-current bg-opacity-5 rounded-full"><Linkedin className="w-4 h-4" /></a>
                 </div>
              </div>

              <div>
                 <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">{t.footerQuickLinks}</h4>
                 <ul className="space-y-4 opacity-70 text-sm font-medium">
                    <li><a href="#" className="hover:text-blue-500 transition-colors">{lang === 'en' ? 'Home' : 'الرئيسية'}</a></li>
                    <li><a href="#" className="hover:text-blue-500 transition-colors">{lang === 'en' ? 'About' : 'من نحن'}</a></li>
                    <li><a href="#" className="hover:text-blue-500 transition-colors">{lang === 'en' ? 'Services' : 'خدماتنا'}</a></li>
                    <li><a href="#" className="hover:text-blue-500 transition-colors">{lang === 'en' ? 'Contact' : 'اتصل بنا'}</a></li>
                 </ul>
              </div>

              <div>
                 <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">{t.footerLegal}</h4>
                 <ul className="space-y-4 opacity-70 text-sm font-medium">
                    <li><a href="#" className="hover:text-blue-500 transition-colors">{t.footerPrivacy}</a></li>
                    <li><a href="#" className="hover:text-blue-500 transition-colors">{t.footerTerms}</a></li>
                    <li><a href="#" className="hover:text-blue-500 transition-colors">{lang === 'en' ? 'Cookie Policy' : 'سياسة الكوكيز'}</a></li>
                 </ul>
              </div>

              <div>
                 <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">{t.footerFollowUs}</h4>
                 <div className="space-y-4 opacity-70 text-sm">
                    <div className="flex items-center gap-3"><Globe className="w-4 h-4" /> Global Support</div>
                    <div className="flex items-center gap-3"><Mail className="w-4 h-4" /> contact@example.com</div>
                 </div>
              </div>
           </div>

           <div className="max-w-6xl mx-auto pt-8 border-t border-current border-opacity-10 text-center opacity-40 text-xs font-medium">
             {getContent('footer_text', `© 2024 ${config.name || 'Zemam'}. ${lang === 'en' ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}`)}
           </div>
        </footer>
      </EditableWrapper>
    </div>
  );
};
