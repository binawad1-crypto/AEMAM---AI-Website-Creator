import React, { useState } from 'react';
import { SiteConfig, PALETTES, FONT_PAIRS } from '../types';
import { AlignLeft, Mail, Edit2, X, Save, Star, Users, HelpCircle, CreditCard, Newspaper, Send, CheckCircle, Zap, Facebook, Twitter, Instagram, Linkedin, Globe } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface PreviewFrameProps {
  config: SiteConfig;
  lang: 'en' | 'ar';
  editable?: boolean;
  onUpdate?: (key: string, value: string) => void;
}

interface EditableWrapperProps {
  children?: React.ReactNode;
  editable?: boolean;
  label: string;
  onClick?: () => void;
}

const EditableWrapper = ({ children, editable, label, onClick }: EditableWrapperProps) => {
  if (!editable) return <>{children}</>;
  return (
    <div 
      onClick={onClick}
      className="group relative border-2 border-transparent hover:border-blue-500 transition-all duration-200 cursor-default"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-30 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full cursor-pointer shadow-lg flex items-center gap-2 pointer-events-none">
        <Edit2 className="w-3 h-3" />
        <span>{label}</span>
      </div>
      {children}
    </div>
  )
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

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ config, lang, editable, onUpdate }) => {
  const palette = PALETTES.find(p => p.id === config.palette) || PALETTES[0];
  const fonts = FONT_PAIRS.find(f => f.id === config.fontPair) || FONT_PAIRS[0];
  const t = TRANSLATIONS[lang];

  const [bg, surface, text, accent] = palette.colors;
  const isRTL = lang === 'ar';
  
  // State for active edit section
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Content Helpers (Get value from config.content or fallback)
  const getContent = (key: string, fallback: string) => {
    return config.content?.[key] || fallback;
  }

  // Define inputs for the modal based on active section
  const getInputsForSection = () => {
    switch(activeSection) {
      case 'header': return [
        { key: 'nav_title', label: 'Site Title', value: getContent('nav_title', config.name || (lang === 'en' ? 'Site Title' : 'عنوان الموقع')) }
      ];
      case 'hero': return [
        { key: 'hero_title', label: 'Headline', value: getContent('hero_title', config.description ? config.description.split('.')[0] : (lang === 'en' ? 'Timeless Elegance in Design' : 'أناقة خالدة في التصميم')), type: 'textarea' as const },
        { key: 'hero_subtitle', label: 'Subheadline', value: getContent('hero_subtitle', config.description || (lang === 'en' ? `We create experiences that matter. Tailored for ${config.topic || 'you'}.` : `نصنع تجارب ذات قيمة. مصممة خصيصاً لـ ${config.topic || 'أجلك'}.`)), type: 'textarea' as const },
        { key: 'hero_cta', label: 'Button Text', value: getContent('hero_cta', lang === 'en' ? 'Get Started' : 'ابدأ الآن') }
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

  return (
    <div 
      className={`w-full h-full overflow-y-auto bg-white transition-colors duration-500 ease-in-out ${fonts.body} ${editable ? 'select-none' : ''}`}
      style={{ backgroundColor: bg, color: text, direction: isRTL ? 'rtl' : 'ltr' }}
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

      {/* Navigation Stub */}
      <EditableWrapper 
        editable={editable} 
        label={lang === 'en' ? 'Edit Header' : 'تعديل الرأس'}
        onClick={() => setActiveSection('header')}
      >
        <nav className="p-6 flex justify-between items-center sticky top-0 z-10 bg-opacity-90 backdrop-blur-sm" style={{ backgroundColor: bg }}>
          <div className={`text-xl font-bold tracking-tight ${fonts.heading}`}>{getContent('nav_title', config.name || (lang === 'en' ? 'Site Title' : 'عنوان الموقع'))}</div>
          <div className="hidden md:flex gap-6 text-sm font-medium opacity-70">
            <span>{lang === 'en' ? 'Work' : 'أعمالنا'}</span>
            <span>{lang === 'en' ? 'About' : 'من نحن'}</span>
            <span>{lang === 'en' ? 'Contact' : 'اتصل بنا'}</span>
          </div>
        </nav>
      </EditableWrapper>

      {/* Hero Section */}
      <EditableWrapper 
        editable={editable} 
        label={lang === 'en' ? 'Edit Hero' : 'تعديل الواجهة'}
        onClick={() => setActiveSection('hero')}
      >
        <section className="px-6 py-20 md:py-32 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className={`text-5xl md:text-7xl font-bold leading-tight ${fonts.heading}`}>
              {getContent('hero_title', config.description ? config.description.split('.')[0] : (lang === 'en' ? 'Timeless Elegance in Design' : 'أناقة خالدة في التصميم'))}
            </h1>
            <p className="text-lg opacity-80 leading-relaxed max-w-md">
              {getContent('hero_subtitle', config.description || (lang === 'en' 
                ? `We create experiences that matter. Tailored for ${config.topic || 'you'}.` 
                : `نصنع تجارب ذات قيمة. مصممة خصيصاً لـ ${config.topic || 'أجلك'}.`))}
            </p>
            <button 
              className="px-8 py-3 rounded-full text-sm font-bold tracking-wide transition-transform hover:scale-105"
              style={{ backgroundColor: text, color: bg }}
            >
              {getContent('hero_cta', lang === 'en' ? 'Get Started' : 'ابدأ الآن')}
            </button>
          </div>
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-gray-200">
             <img 
              src={`https://picsum.photos/800/1000?random=${config.topic.length}`} 
              alt="Hero" 
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
            />
          </div>
        </section>
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
                 <h2 className={`text-3xl font-bold mb-4 ${fonts.heading}`}>{getContent('features_title', lang === 'en' ? 'Core Features' : 'أهم المميزات')}</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="flex flex-col items-center text-center p-6">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                        {i === 1 ? <Zap className="w-6 h-6" /> : i === 2 ? <CheckCircle className="w-6 h-6" /> : <Star className="w-6 h-6" />}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{getContent(`feature_${i}_title`, lang === 'en' ? `Feature ${i}` : `ميزة ${i}`)}</h3>
                      <p className="opacity-60 text-sm">{getContent(`feature_${i}_desc`, lang === 'en' ? 'Details about this amazing feature go here.' : 'تفاصيل حول هذه الميزة الرائعة تذهب هنا.')}</p>
                   </div>
                 ))}
               </div>
            </div>
          </section>
        </EditableWrapper>
      )}

      {/* About Section (New) */}
      {config.structure.includes('about') && (
        <EditableWrapper 
          editable={editable} 
          label={lang === 'en' ? 'Edit About' : 'تعديل من نحن'}
          onClick={() => setActiveSection('about')}
        >
          <section className="py-24 px-6">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
               <div className="flex-1 space-y-6">
                 <h2 className={`text-4xl font-bold ${fonts.heading}`}>{getContent('about_title', lang === 'en' ? 'About Us' : 'من نحن')}</h2>
                 <p className="text-lg opacity-70 leading-relaxed">
                   {getContent('about_desc', lang === 'en' ? 'We are a dedicated team committed to delivering excellence. Our journey began with a simple idea and has grown into a passion for creating value.' : 'نحن فريق متفاني ملتزم بتقديم التميز. بدأت رحلتنا بفكرة بسيطة ونمت لتصبح شغفاً لخلق القيمة.')}
                 </p>
               </div>
               <div className="flex-1 w-full aspect-video bg-gray-100 rounded-xl overflow-hidden">
                 <img src={`https://picsum.photos/600/400?random=${config.topic.length + 1}`} className="w-full h-full object-cover" alt="About" />
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
               <h2 className={`text-3xl font-bold mb-12 ${fonts.heading}`}>{getContent('services_title', lang === 'en' ? 'Our Expertise' : 'خبراتنا')}</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-8 border border-opacity-10 border-current rounded-sm hover:border-opacity-50 transition-colors bg-white dark:bg-neutral-800/50">
                      <AlignLeft className="w-8 h-8 mb-4 opacity-70" />
                      <h3 className="text-xl font-bold mb-2">{getContent(`service_${i}_title`, lang === 'en' ? `Service ${i}` : `خدمة ${i}`)}</h3>
                      <p className="opacity-60 text-sm">
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
             <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`aspect-square bg-gray-100 overflow-hidden ${i === 1 ? 'col-span-2 row-span-2' : ''}`}>
                     <img src={`https://picsum.photos/600/600?random=${i + 10}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Gallery" />
                  </div>
                ))}
             </div>
          </section>
        </EditableWrapper>
      )}

      {/* Team Section */}
      {config.structure.includes('team') && (
        <EditableWrapper 
          editable={editable} 
          label={lang === 'en' ? 'Edit Team' : 'تعديل الفريق'}
          onClick={() => setActiveSection('team')}
        >
          <section className="py-24 px-6" style={{ backgroundColor: surface }}>
            <div className="max-w-6xl mx-auto text-center">
               <h2 className={`text-3xl font-bold mb-16 ${fonts.heading}`}>{getContent('team_title', lang === 'en' ? 'Meet the Team' : 'فريق العمل')}</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex flex-col items-center group">
                       <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-200 grayscale group-hover:grayscale-0 transition-all">
                          <img src={`https://i.pravatar.cc/300?img=${i + 10}`} alt="Team" className="w-full h-full object-cover" />
                       </div>
                       <h3 className="font-bold">Member {i}</h3>
                       <p className="text-sm opacity-60">Role Title</p>
                    </div>
                  ))}
               </div>
            </div>
          </section>
        </EditableWrapper>
      )}

      {/* Testimonials Section */}
      {config.structure.includes('testimonials') && (
        <EditableWrapper 
          editable={editable} 
          label={lang === 'en' ? 'Edit Testimonials' : 'تعديل الآراء'}
          onClick={() => setActiveSection('testimonials')}
        >
          <section className="py-24 px-6">
            <div className="max-w-4xl mx-auto text-center">
               <h2 className={`text-3xl font-bold mb-16 ${fonts.heading}`}>{getContent('testimonials_title', lang === 'en' ? 'Client Stories' : 'قصص العملاء')}</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {[1, 2].map(i => (
                   <div key={i} className="p-8 bg-gray-50 dark:bg-neutral-800 rounded-2xl relative">
                      <div className="absolute top-0 left-8 -translate-y-1/2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        <Star className="w-5 h-5 fill-current" />
                      </div>
                      <p className="text-lg italic mb-6 opacity-80">
                        "{getContent(`testimonial_${i}_text`, lang === 'en' ? 'Simply amazing service. The team went above and beyond our expectations.' : 'خدمة مذهلة ببساطة. لقد تجاوز الفريق توقعاتنا.')}"
                      </p>
                      <div className="font-bold text-sm">Client Name {i}</div>
                   </div>
                 ))}
               </div>
            </div>
          </section>
        </EditableWrapper>
      )}

      {/* Pricing Section */}
      {config.structure.includes('pricing') && (
        <EditableWrapper 
          editable={editable} 
          label={lang === 'en' ? 'Edit Pricing' : 'تعديل الأسعار'}
          onClick={() => setActiveSection('pricing')}
        >
           <section className="py-24 px-6" style={{ backgroundColor: surface }}>
             <div className="max-w-5xl mx-auto">
               <h2 className={`text-3xl font-bold mb-16 text-center ${fonts.heading}`}>{getContent('pricing_title', lang === 'en' ? 'Pricing Plans' : 'باقات الأسعار')}</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {['Basic', 'Pro', 'Enterprise'].map((plan, i) => (
                   <div key={plan} className={`p-8 rounded-xl border ${i === 1 ? 'border-blue-500 ring-1 ring-blue-500 relative' : 'border-gray-200 dark:border-neutral-700'} flex flex-col`}>
                      {i === 1 && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>}
                      <h3 className="text-lg font-bold mb-2">{plan}</h3>
                      <div className="text-3xl font-bold mb-6">{getContent(`price_${i+1}`, i === 0 ? '$29' : i === 1 ? '$59' : '$99')} <span className="text-sm font-normal opacity-50">/mo</span></div>
                      <ul className="space-y-3 mb-8 flex-1">
                        {[1,2,3].map(f => (
                          <li key={f} className="flex items-center gap-2 text-sm opacity-70"><CheckCircle className="w-4 h-4 text-green-500" /> Feature {f}</li>
                        ))}
                      </ul>
                      <button className={`w-full py-3 rounded-lg font-bold text-sm ${i === 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-neutral-800'}`}>Select Plan</button>
                   </div>
                 ))}
               </div>
             </div>
           </section>
        </EditableWrapper>
      )}

      {/* FAQ Section */}
      {config.structure.includes('faq') && (
        <EditableWrapper 
          editable={editable} 
          label={lang === 'en' ? 'Edit FAQ' : 'تعديل الأسئلة'}
          onClick={() => setActiveSection('faq')}
        >
          <section className="py-24 px-6">
             <div className="max-w-3xl mx-auto">
                <h2 className={`text-3xl font-bold mb-12 text-center ${fonts.heading}`}>{getContent('faq_title', lang === 'en' ? 'Frequently Asked Questions' : 'الأسئلة الشائعة')}</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="border border-gray-200 dark:border-neutral-800 rounded-lg p-6">
                       <h3 className="font-bold text-lg mb-2">{lang === 'en' ? 'Question Number ' + i + '?' : 'السؤال رقم ' + i + '؟'}</h3>
                       <p className="opacity-60">{lang === 'en' ? 'Answer to this question goes here. It provides helpful information.' : 'إجابة هذا السؤال تذهب هنا. إنها توفر معلومات مفيدة.'}</p>
                    </div>
                  ))}
                </div>
             </div>
          </section>
        </EditableWrapper>
      )}

      {/* Blog Section */}
      {config.structure.includes('blog') && (
        <EditableWrapper 
          editable={editable} 
          label={lang === 'en' ? 'Edit Blog' : 'تعديل المدونة'}
          onClick={() => setActiveSection('blog')}
        >
           <section className="py-24 px-6" style={{ backgroundColor: surface }}>
              <div className="max-w-6xl mx-auto">
                 <div className="flex items-center justify-between mb-12">
                   <h2 className={`text-3xl font-bold ${fonts.heading}`}>{getContent('blog_title', lang === 'en' ? 'Latest News' : 'آخر الأخبار')}</h2>
                   <button className="text-sm font-bold border-b border-current pb-1">View All</button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="group cursor-pointer">
                         <div className="aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden mb-4">
                           <img src={`https://picsum.photos/600/400?random=${i + 20}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Blog" />
                         </div>
                         <div className="text-xs font-bold opacity-50 mb-2 uppercase">Category</div>
                         <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">Article Title {i}</h3>
                         <p className="text-sm opacity-60">Short excerpt describing the article content goes here...</p>
                      </div>
                    ))}
                 </div>
              </div>
           </section>
        </EditableWrapper>
      )}

      {/* Newsletter Section */}
      {config.structure.includes('newsletter') && (
        <EditableWrapper 
          editable={editable} 
          label={lang === 'en' ? 'Edit Newsletter' : 'تعديل النشرة'}
          onClick={() => setActiveSection('newsletter')}
        >
          <section className="py-24 px-6 bg-black text-white dark:bg-white dark:text-black">
             <div className="max-w-xl mx-auto text-center space-y-6">
                <Send className="w-12 h-12 mx-auto opacity-50" />
                <h2 className={`text-3xl font-bold ${fonts.heading}`}>{getContent('newsletter_title', lang === 'en' ? 'Stay Updated' : 'ابقى على اطلاع')}</h2>
                <p className="opacity-70">{lang === 'en' ? 'Join our newsletter to receive the latest updates and offers.' : 'انضم إلى نشرتنا البريدية لتلقي آخر التحديثات والعروض.'}</p>
                <div className="flex gap-2">
                   <input type="email" placeholder="email@example.com" className="flex-1 p-3 rounded-md bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none dark:text-black dark:border-black/20" />
                   <button className="px-6 py-3 bg-white text-black font-bold rounded-md dark:bg-black dark:text-white">{lang === 'en' ? 'Join' : 'اشتراك'}</button>
                </div>
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
          <section className="py-24 px-6 flex justify-center text-center" style={{ backgroundColor: accent, color: '#fff' }}>
            <div className="max-w-xl space-y-6">
               <Mail className="w-12 h-12 mx-auto" />
               <h2 className={`text-4xl font-bold ${fonts.heading}`}>{getContent('contact_title', lang === 'en' ? 'Let\'s Work Together' : 'دعنا نعمل معاً')}</h2>
               <form className="space-y-4 text-left" dir={isRTL ? 'rtl' : 'ltr'}>
                  <input type="email" placeholder={lang === 'en' ? 'Email Address' : 'البريد الإلكتروني'} className="w-full p-4 bg-white/10 border border-white/20 rounded-md placeholder-white/60 focus:outline-none focus:bg-white/20" />
                  <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-wider rounded-md">{getContent('contact_btn', lang === 'en' ? 'Submit' : 'إرسال')}</button>
               </form>
            </div>
          </section>
        </EditableWrapper>
      )}

      {/* Footer (Enhanced) */}
      <EditableWrapper 
        editable={editable} 
        label={lang === 'en' ? 'Edit Footer' : 'تعديل التذييل'}
        onClick={() => setActiveSection('footer')}
      >
        <footer className="pt-24 pb-12 px-6 border-t border-current border-opacity-10" style={{ backgroundColor: surface }}>
           <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              {/* Col 1: Brand */}
              <div className="space-y-4">
                 <div className={`text-xl font-bold tracking-tight ${fonts.heading}`}>{getContent('nav_title', config.name || (lang === 'en' ? 'Site Title' : 'عنوان الموقع'))}</div>
                 <p className="opacity-60 text-sm leading-relaxed max-w-xs">
                   {getContent('footer_desc', lang === 'en' ? 'Building the future of digital experiences.' : 'نبني مستقبل التجارب الرقمية.')}
                 </p>
                 <div className="flex gap-4 pt-2">
                    <a href={getContent('social_twitter', '#')} className="opacity-50 hover:opacity-100 transition-opacity"><Twitter className="w-5 h-5" /></a>
                    <a href={getContent('social_instagram', '#')} className="opacity-50 hover:opacity-100 transition-opacity"><Instagram className="w-5 h-5" /></a>
                    <a href={getContent('social_linkedin', '#')} className="opacity-50 hover:opacity-100 transition-opacity"><Linkedin className="w-5 h-5" /></a>
                 </div>
              </div>

              {/* Col 2: Quick Links */}
              <div>
                 <h4 className="font-bold mb-6">{t.footerQuickLinks}</h4>
                 <ul className="space-y-3 opacity-70 text-sm">
                    <li><a href="#" className="hover:underline">{lang === 'en' ? 'Home' : 'الرئيسية'}</a></li>
                    <li><a href="#" className="hover:underline">{lang === 'en' ? 'About' : 'من نحن'}</a></li>
                    <li><a href="#" className="hover:underline">{lang === 'en' ? 'Services' : 'خدماتنا'}</a></li>
                    <li><a href="#" className="hover:underline">{lang === 'en' ? 'Contact' : 'اتصل بنا'}</a></li>
                 </ul>
              </div>

              {/* Col 3: Legal */}
              <div>
                 <h4 className="font-bold mb-6">{t.footerLegal}</h4>
                 <ul className="space-y-3 opacity-70 text-sm">
                    <li><a href="#" className="hover:underline">{t.footerPrivacy}</a></li>
                    <li><a href="#" className="hover:underline">{t.footerTerms}</a></li>
                    <li><a href="#" className="hover:underline">{lang === 'en' ? 'Cookie Policy' : 'سياسة الكوكيز'}</a></li>
                 </ul>
              </div>

              {/* Col 4: Newsletter or Info */}
              <div>
                 <h4 className="font-bold mb-6">{t.footerFollowUs}</h4>
                 <div className="space-y-3 opacity-70 text-sm">
                    <div className="flex items-center gap-2"><Globe className="w-4 h-4" /> Global Support</div>
                    <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> contact@example.com</div>
                 </div>
              </div>
           </div>

           <div className="max-w-6xl mx-auto pt-8 border-t border-current border-opacity-10 text-center opacity-40 text-xs">
             {getContent('footer_text', `© 2024 ${config.name || 'Zemam'}. ${lang === 'en' ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}`)}
           </div>
        </footer>
      </EditableWrapper>
    </div>
  );
};