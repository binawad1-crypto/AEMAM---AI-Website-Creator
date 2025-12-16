import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ArrowRight, ArrowLeft, Search, Check, Moon, Sun, Globe, 
  LayoutTemplate, Type, Palette as PaletteIcon, Monitor, Menu, X, Sparkles, Loader2,
  Zap, ShoppingBag, BarChart, Code2, Globe2, ShieldCheck, PlayCircle
} from 'lucide-react';
import { 
  WizardStep, Language, Theme, SiteConfig, 
  PALETTES, FONT_PAIRS 
} from './types';
import { TRANSLATIONS } from './constants';
import { generateSiteDescription, generateSiteNameSuggestion, predictTopics } from './services/geminiService';
import { PreviewFrame } from './components/PreviewFrame';
import { EditorDashboard } from './components/EditorDashboard';

const TEMPLATE_PREVIEWS = [
  { id: 'portfolio', image: 'https://images.unsplash.com/photo-1481480746207-e90860196723?q=80&w=800&auto=format&fit=crop' },
  { id: 'store', image: 'https://images.unsplash.com/photo-1472851294608-4155f2118c03?q=80&w=800&auto=format&fit=crop' },
  { id: 'business', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop' },
  { id: 'restaurant', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop' },
  { id: 'blog', image: 'https://images.unsplash.com/photo-1499750310159-5254f4122cba?q=80&w=800&auto=format&fit=crop' },
  { id: 'event', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop' },
];

const LOGOS = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Tesla_logo.png/1200px-Tesla_logo.png"
];

const App: React.FC = () => {
  // Global State
  const [step, setStep] = useState<WizardStep>(WizardStep.LANDING);
  const [lang, setLang] = useState<Language>('ar');
  const [theme, setTheme] = useState<Theme>('light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Data State
  const [config, setConfig] = useState<SiteConfig>({
    topic: '',
    goals: [],
    name: '',
    structure: ['hero', 'features', 'about', 'services', 'contact'],
    palette: 'minimal',
    fontPair: 'modern',
    description: '',
    content: {}
  });

  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Topic Prediction State
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helpers
  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';
  
  // Update HTML direction and Theme
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Topic Prediction Effect
  useEffect(() => {
    // Clear timeout if user is still typing
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchTerm.length > 2) {
      setIsPredicting(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const suggestions = await predictTopics(searchTerm, lang);
          setSuggestedTopics(suggestions);
        } catch (e) {
          console.error(e);
        } finally {
          setIsPredicting(false);
        }
      }, 600); // 600ms debounce
    } else {
      setSuggestedTopics([]);
      setIsPredicting(false);
    }
  }, [searchTerm, lang]);

  // Actions
  const handleNext = async () => {
    if (step === WizardStep.DASHBOARD) return;
    
    // Trigger AI description generation when moving to Structure or Palette
    if (step === WizardStep.NAME && !config.description) {
      setIsLoadingAI(true);
      const desc = await generateSiteDescription(config.topic, config.name, lang);
      setConfig(prev => ({ ...prev, description: desc }));
      setIsLoadingAI(false);
    }
    
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step > WizardStep.TOPIC) setStep(prev => prev - 1);
    else if (step === WizardStep.TOPIC) setStep(WizardStep.LANDING);
  };

  const generateName = async () => {
    if (!config.topic) return;
    setIsLoadingAI(true);
    const suggestion = await generateSiteNameSuggestion(config.topic, lang);
    setConfig(prev => ({ ...prev, name: suggestion }));
    setIsLoadingAI(false);
  };

  const toggleStructure = (section: string) => {
    setConfig(prev => {
      const exists = prev.structure.includes(section);
      return {
        ...prev,
        structure: exists 
          ? prev.structure.filter(s => s !== section)
          : [...prev.structure, section]
      };
    });
  };

  const handleContentUpdate = (key: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [key]: value
      }
    }));
  };

  // --- RENDERERS ---

  // 1. Landing Page Header (Complex Menu)
  const renderLandingHeader = () => (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-lg z-50 flex items-center justify-between px-6 md:px-12 transition-colors border-b border-gray-100 dark:border-neutral-800">
       <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black shadow-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tighter uppercase">{lang === 'en' ? 'AEMAM' : 'زمام'}</span>
       </div>

       {/* Desktop Menu */}
       <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
         <a href="#features" className="hover:text-black dark:hover:text-white transition-colors">{t.menuFeatures}</a>
         <a href="#templates" className="hover:text-black dark:hover:text-white transition-colors">{t.menuTemplates}</a>
         <a href="#howitworks" className="hover:text-black dark:hover:text-white transition-colors">How it Works</a>
         <a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t.menuPricing}</a>
       </div>

       <div className="hidden md:flex items-center gap-4">
          <button className="text-sm font-bold hover:opacity-70">{t.menuLogin}</button>
          <button 
             onClick={() => setStep(WizardStep.TOPIC)}
             className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-transform"
          >
             {t.landingCTA}
          </button>
          <div className="w-px h-6 bg-gray-200 dark:bg-neutral-800 mx-2"></div>
          <button onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')} className="font-bold text-lg hover:opacity-70">{isRTL ? 'En' : 'ع'}</button>
          <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} className="hover:opacity-70">
             {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
       </div>

       {/* Mobile Menu Toggle */}
       <div className="md:hidden flex items-center gap-4">
          <button onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')} className="font-bold">{isRTL ? 'EN' : 'عربي'}</button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
             {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
       </div>

       {/* Mobile Dropdown */}
       {isMobileMenuOpen && (
         <div className="absolute top-20 left-0 right-0 bg-white dark:bg-neutral-900 border-b border-gray-100 dark:border-neutral-800 p-6 flex flex-col gap-6 shadow-2xl animate-fade-in md:hidden h-screen">
            <a href="#features" className="text-lg font-medium">{t.menuFeatures}</a>
            <a href="#templates" className="text-lg font-medium">{t.menuTemplates}</a>
            <a href="#" className="text-lg font-medium">{t.menuPricing}</a>
            <hr className="dark:border-neutral-800"/>
            <button className="text-left text-lg font-medium">{t.menuLogin}</button>
            <button 
              onClick={() => {
                setStep(WizardStep.TOPIC);
                setIsMobileMenuOpen(false);
              }}
              className="bg-black dark:bg-white text-white dark:text-black py-4 rounded-lg font-bold text-center"
            >
              {t.landingCTA}
            </button>
            <div className="flex justify-between items-center pt-4">
              <span className="text-sm opacity-60">{t.toggleTheme}</span>
              <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>
         </div>
       )}
    </header>
  );

  // 2. Wizard Header (Minimal)
  const renderWizardHeader = () => (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-neutral-900 z-50 flex items-center justify-between px-6 border-b border-gray-100 dark:border-neutral-800 transition-colors">
       <div className="flex items-center gap-4">
         <div className="text-xl font-bold tracking-tighter flex items-center gap-2 cursor-pointer opacity-80 hover:opacity-100" onClick={() => setStep(WizardStep.LANDING)}>
            <div className="w-6 h-6 bg-neutral-900 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black">
              <span className="text-xs font-bold">A</span>
            </div>
            <span>{lang === 'en' ? 'AEMAM' : 'زمام'}</span>
         </div>
       </div>

       <div className="flex items-center gap-4">
          <button onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-xs font-bold uppercase flex items-center gap-1">
             <Globe className="w-4 h-4" /> {t.toggleLang}
          </button>
          <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
             {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
       </div>
    </header>
  );

  // Simplified Navigation for Split Screen
  const renderNavigation = () => {
    if (step === WizardStep.LANDING || step === WizardStep.DASHBOARD) return null;
    return null; // We will integrate navigation into the sidebar directly for the split screen view
  };

  // STEP 0: LANDING PAGE
  const renderLandingPage = () => (
    <div className="min-h-screen pt-20 flex flex-col relative overflow-x-hidden selection:bg-purple-200 selection:text-black">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50 -z-10 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-50 dark:bg-purple-900/10 rounded-full blur-3xl opacity-50 -z-10 -translate-x-1/3 translate-y-1/3"></div>

      {/* HERO SECTION */}
      <section className="flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-6 py-12 lg:py-24 items-center gap-12 lg:gap-24 min-h-[90vh]">
         {/* Text Content */}
         <div className="flex-1 space-y-8 animate-fade-in text-center lg:text-left rtl:lg:text-right z-10">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-medium leading-[1.1] tracking-tight">
               {t.landingTitle}
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
               {t.landingSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
               <button 
                  onClick={() => setStep(WizardStep.TOPIC)}
                  className="px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center justify-center gap-2 group"
               >
                  {t.landingCTA}
                  {isRTL ? <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
               </button>
               <button className="px-10 py-5 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-black dark:text-white rounded-full font-bold text-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors flex items-center gap-2">
                 <PlayCircle className="w-5 h-5" />
                 {t.previewButton}
               </button>
            </div>
         </div>

         {/* Hero Visual */}
         <div className="flex-1 w-full max-w-xl lg:max-w-none relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
             {/* Abstract UI composition */}
             <div className="relative aspect-square md:aspect-[4/3] rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden p-4 group perspective-1000">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <div className="w-full h-full bg-gray-50 dark:bg-neutral-950 rounded-lg overflow-hidden relative transform group-hover:rotate-1 transition-transform duration-700 ease-out">
                   {/* Fake header */}
                   <div className="h-12 border-b border-gray-200 dark:border-neutral-800 flex items-center px-4 gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                   </div>
                   {/* Fake Content */}
                   <div className="p-8 space-y-6 opacity-80 group-hover:scale-[1.02] transition-transform duration-700">
                      <div className="h-8 w-2/3 bg-gray-200 dark:bg-neutral-800 rounded mb-4 animate-pulse"></div>
                      <div className="h-4 w-full bg-gray-200 dark:bg-neutral-800 rounded"></div>
                      <div className="h-4 w-5/6 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                      <div className="grid grid-cols-2 gap-4 pt-8">
                         <div className="aspect-video bg-blue-100 dark:bg-blue-900/20 rounded"></div>
                         <div className="aspect-video bg-purple-100 dark:bg-purple-900/20 rounded"></div>
                      </div>
                   </div>
                </div>
                
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-bold text-xs rotate-12 shadow-xl z-10 border-4 border-white dark:border-neutral-900">
                   AI POWERED
                </div>
             </div>
         </div>
      </section>

      {/* TRUSTED BY */}
      <section className="py-12 border-y border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8">{t.trustedBy}</p>
           <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100">
              {LOGOS.map((logo, i) => (
                <img key={i} src={logo} className="h-6 md:h-8 object-contain mix-blend-multiply dark:mix-blend-screen" alt="Partner Logo" />
              ))}
           </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 md:py-32 px-6" id="howitworks">
         <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
               <h2 className="text-4xl md:text-5xl font-bold">{t.howItWorksTitle}</h2>
               <p className="text-xl text-gray-500">Create without limits, design without code.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
               {/* Connecting Line (Desktop) */}
               <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-200 dark:bg-neutral-800 -z-10"></div>

               {[1, 2, 3].map((stepNum) => (
                 <div key={stepNum} className="flex flex-col items-center text-center group">
                    <div className="w-24 h-24 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 flex items-center justify-center text-3xl font-bold mb-8 shadow-sm group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                       {stepNum}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{t[`step${stepNum}Title` as keyof typeof t]}</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs">{t[`step${stepNum}Desc` as keyof typeof t]}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 md:py-32 px-6 bg-black text-white dark:bg-white dark:text-black" id="features">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-6">
               <div className="max-w-2xl">
                  <h2 className="text-4xl md:text-6xl font-bold mb-6">{t.featuresTitle}</h2>
                  <p className="text-xl opacity-70">{t.featuresSubtitle}</p>
               </div>
               <button className="px-8 py-4 border border-white/20 dark:border-black/20 rounded-full font-bold hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all">
                  View All Features
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { icon: Sparkles, title: t.feature1Title, desc: t.feature1Desc },
                 { icon: ShoppingBag, title: t.feature2Title, desc: t.feature2Desc },
                 { icon: Globe2, title: t.feature3Title, desc: t.feature3Desc },
                 { icon: Zap, title: t.feature4Title, desc: t.feature4Desc }
               ].map((feat, i) => (
                 <div key={i} className="p-8 rounded-2xl bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 hover:bg-white/10 dark:hover:bg-black/10 transition-colors">
                    <feat.icon className="w-10 h-10 mb-6 opacity-80" />
                    <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                    <p className="opacity-60 text-sm leading-relaxed">{feat.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>
      
      {/* TEMPLATES SECTION */}
      <section className="py-24 md:py-32 px-6 bg-gray-50/50 dark:bg-neutral-900/50 border-t border-gray-100 dark:border-neutral-800" id="templates">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{t.landingTemplatesTitle}</h2>
             <p className="text-xl text-gray-500 max-w-2xl mx-auto">{t.landingTemplatesSubtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {TEMPLATE_PREVIEWS.map((tpl, i) => (
                <div 
                  key={tpl.id} 
                  className="group cursor-pointer"
                >
                   <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 dark:bg-neutral-800 mb-6 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                      <img src={tpl.image} alt={t.templateNames[tpl.id as keyof typeof t.templateNames]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter saturate-0 group-hover:saturate-100" />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                         <button 
                           onClick={() => setStep(WizardStep.TOPIC)}
                           className="bg-white text-black px-8 py-4 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:scale-105 shadow-xl"
                         >
                           {t.useTemplate}
                         </button>
                      </div>
                   </div>
                   <h3 className="text-xl font-bold">{t.templateNames[tpl.id as keyof typeof t.templateNames]}</h3>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-24 px-6 border-y border-gray-100 dark:border-neutral-800">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left rtl:md:text-right">
            <div className="flex-1">
               <h2 className="text-3xl font-bold mb-4">{t.statsTitle}</h2>
               <p className="text-gray-500">Trusted by over 10,000 creators worldwide to build their online presence.</p>
            </div>
            <div className="flex-1 flex justify-around w-full">
               {[
                 { val: '1M+', label: t.stat1 },
                 { val: '99.9%', label: t.stat2 },
                 { val: '24/7', label: t.stat3 },
               ].map((stat, i) => (
                 <div key={i}>
                    <div className="text-4xl md:text-5xl font-bold mb-2">{stat.val}</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-400">{stat.label}</div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6 text-center">
         <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight">{t.finalCtaTitle}</h2>
            <p className="text-xl text-gray-500">{t.finalCtaSubtitle}</p>
            <button 
               onClick={() => setStep(WizardStep.TOPIC)}
               className="px-12 py-6 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl"
            >
               {t.landingCTA}
            </button>
         </div>
      </section>

      {/* LANDING FOOTER */}
      <footer className="bg-gray-50 dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 pt-24 pb-12 px-6">
         <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
            <div className="col-span-2 md:col-span-1 space-y-6">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-bold">A</div>
                  <span className="text-xl font-bold">{lang === 'en' ? 'AEMAM' : 'زمام'}</span>
               </div>
               <p className="text-gray-500 text-sm">The future of website creation is here. Powered by AI, designed by you.</p>
            </div>
            
            <div>
               <h4 className="font-bold mb-6">{t.footerProduct}</h4>
               <ul className="space-y-4 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Templates</a></li>
                  <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Pricing</a></li>
               </ul>
            </div>

            <div>
               <h4 className="font-bold mb-6">{t.footerCompany}</h4>
               <ul className="space-y-4 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Blog</a></li>
               </ul>
            </div>

            <div>
               <h4 className="font-bold mb-6">{t.footerResources}</h4>
               <ul className="space-y-4 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Community</a></li>
                  <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Contact</a></li>
               </ul>
            </div>
         </div>

         <div className="max-w-7xl mx-auto pt-8 border-t border-gray-200 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <div>{t.footerCopyright}</div>
            <div className="flex gap-6">
               <a href="#" className="hover:text-black dark:hover:text-white">Privacy</a>
               <a href="#" className="hover:text-black dark:hover:text-white">Terms</a>
               <a href="#" className="hover:text-black dark:hover:text-white">Cookies</a>
            </div>
         </div>
      </footer>
    </div>
  );

  // STEP 1: TOPIC (Smart)
  const renderTopicSelection = () => (
    <div className="max-w-4xl mx-auto pt-32 px-6 animate-fade-in pb-40">
       <div className="text-sm uppercase tracking-widest text-gray-500 mb-2">{t.step} 1 {t.of} 3</div>
       <h1 className="text-4xl md:text-6xl font-bold mb-6">{t.topicTitle}</h1>
       <p className="text-xl text-gray-500 mb-12 max-w-xl">{t.topicSubtitle}</p>
       
       <div className="relative mb-8 group">
         <div className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 flex items-center justify-center transition-all ${isPredicting ? 'animate-spin text-black dark:text-white' : ''} ${isRTL ? 'right-6' : 'left-6'}`}>
            {isPredicting ? <Loader2 className="w-6 h-6" /> : <Search className="w-6 h-6" />}
         </div>
         <input 
           type="text" 
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           placeholder={t.searchPlaceholder}
           className={`w-full p-6 text-2xl font-medium border-2 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm focus:shadow-xl focus:border-black dark:focus:border-white outline-none transition-all ${isRTL ? 'pr-16' : 'pl-16'} ${isRTL ? 'text-right' : 'text-left'} border-gray-100 dark:border-neutral-700`}
           autoFocus
         />
       </div>

       {/* Content Area: Either Popular or Suggested */}
       <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider opacity-60">
              {searchTerm.length > 2 && suggestedTopics.length > 0 ? t.suggestedTopics : t.popularTopics}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
             {/* 1. If searching, show the "Use Custom" option first */}
             {searchTerm.length > 0 && (
                <button 
                  onClick={() => setConfig({ ...config, topic: searchTerm })}
                  className={`p-6 text-left rounded-xl border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black flex justify-between items-center group shadow-lg transform scale-[1.02]`}
                >
                   <div>
                      <div className="text-xs opacity-70 uppercase mb-1">{t.useCustomTopic}</div>
                      <span className="text-lg font-bold">"{searchTerm}"</span>
                   </div>
                   <ArrowLeft className={`w-5 h-5 ${isRTL ? '' : 'rotate-180'}`} />
                </button>
             )}

             {/* 2. Show Suggestions (if searching) OR Popular Topics (if empty) */}
             {(searchTerm.length > 2 && suggestedTopics.length > 0 ? suggestedTopics : t.topicsList).map((topic, idx) => (
               <button 
                 key={topic + idx}
                 onClick={() => setConfig({ ...config, topic })}
                 className={`p-6 text-left rounded-xl border hover:border-black dark:hover:border-white transition-all flex justify-between items-center group
                    ${config.topic === topic 
                      ? 'border-black bg-gray-50 dark:border-white dark:bg-neutral-800 ring-1 ring-black dark:ring-white' 
                      : 'border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'}
                 `}
                 style={{ animationDelay: `${idx * 0.05}s` }}
               >
                  <span className="text-lg font-medium">{topic}</span>
                  {config.topic === topic && <Check className="w-5 h-5" />}
               </button>
             ))}
             
             {/* 3. Empty State for Search */}
             {searchTerm.length > 2 && suggestedTopics.length === 0 && !isPredicting && (
                <div className="col-span-full py-8 text-center text-gray-400 italic">
                   {isRTL ? 'لا توجد اقتراحات إضافية، يمكنك استخدام ما كتبته.' : 'No specific suggestions found, feel free to use your custom topic.'}
                </div>
             )}
          </div>
       </div>
    </div>
  );

  // STEP 2: GOALS
  const renderGoalSelection = () => (
    <div className="max-w-4xl mx-auto pt-32 px-6 animate-fade-in pb-32">
       <div className="text-sm uppercase tracking-widest text-gray-500 mb-2">{t.step} 2 {t.of} 3</div>
       <h1 className="text-4xl md:text-6xl font-bold mb-6">{t.goalsTitle}</h1>
       <p className="text-xl text-gray-500 mb-12 max-w-xl">{t.goalsSubtitle}</p>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {t.goalsList.map((goal) => {
            const isSelected = config.goals.includes(goal);
            return (
              <button 
                key={goal}
                onClick={() => setConfig(prev => ({
                  ...prev,
                  goals: isSelected ? prev.goals.filter(g => g !== goal) : [...prev.goals, goal]
                }))}
                className={`p-6 border rounded-lg text-left transition-all duration-200 flex items-start gap-4 group
                  ${isSelected 
                    ? 'border-black bg-gray-50 dark:border-white dark:bg-neutral-800 shadow-md' 
                    : 'border-gray-200 dark:border-neutral-700 hover:border-gray-400'}
                `}
              >
                 <div className={`w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 transition-colors
                    ${isSelected ? 'bg-black border-black dark:bg-white dark:border-white text-white dark:text-black' : 'border-gray-300'}
                 `}>
                    {isSelected && <Check className="w-4 h-4" />}
                 </div>
                 <span className="text-lg">{goal}</span>
              </button>
            )
          })}
       </div>
    </div>
  );

  // STEP 3 - 5: PROFESSIONAL SPLIT SCREEN BUILDER (SQUARESPACE STYLE)
  const renderSplitScreen = (
     title: string, 
     subtitle: string, 
     controlPanel: React.ReactNode
  ) => (
    <div className="flex h-screen pt-16 overflow-hidden bg-gray-50 dark:bg-neutral-900">
       {/* Left: Preview (Canvas) - 75% Width */}
       <div className="hidden lg:flex flex-col w-[75%] h-full bg-[#e4e4e4] dark:bg-[#1a1a1a] p-8 overflow-hidden items-center justify-center relative shadow-inner">
          <div className="absolute top-6 left-6 text-sm font-bold text-gray-500 uppercase tracking-widest opacity-50">
             {config.name || (lang === 'en' ? 'Untitled Site' : 'موقع جديد')}
          </div>
          
          {/* Enhanced Browser Frame - Floating Center */}
          <div className="w-full h-full max-w-[1400px] max-h-[90vh] bg-white dark:bg-neutral-950 shadow-2xl overflow-hidden flex flex-col transform transition-transform duration-500">
             {/* Content */}
             <div className="flex-1 relative overflow-hidden scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-neutral-800">
                <PreviewFrame config={config} lang={lang} />
             </div>
          </div>
       </div>

       {/* Right: Controls (Sidebar) - 25% Width */}
       <div className="w-full lg:w-[25%] h-full flex flex-col bg-white dark:bg-neutral-900 border-l border-gray-200 dark:border-neutral-800 shadow-xl z-20">
          <div className="flex-1 overflow-y-auto p-8">
             <div className="animate-fade-in space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-3">{title}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">{subtitle}</p>
                </div>
                
                <div className="py-4">
                  {controlPanel}
                </div>
             </div>
          </div>

          {/* Fixed Footer Navigation inside Sidebar */}
          <div className="p-6 border-t border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky bottom-0">
             <div className="flex items-center justify-between gap-4">
                 <button 
                   onClick={handleBack}
                   className="px-6 py-3 rounded-md text-sm font-medium border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                 >
                   {t.back}
                 </button>
                 <button 
                   onClick={handleNext} 
                   disabled={isLoadingAI}
                   className="flex-1 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-md text-sm font-bold tracking-wide flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg"
                 >
                   {isLoadingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : (step === WizardStep.FONTS ? t.finish : t.next)}
                 </button>
             </div>
          </div>
       </div>
    </div>
  );

  // Individual Step Renderers for Split Screen
  
  const renderNameStep = () => renderSplitScreen(
     t.nameTitle, 
     t.nameSubtitle,
     <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2 uppercase tracking-wide opacity-70">Title</label>
          <input 
            type="text" 
            value={config.name}
            onChange={(e) => setConfig({ ...config, name: e.target.value })}
            placeholder={t.namePlaceholder}
            className="w-full p-4 text-xl border-b-2 border-gray-200 dark:border-neutral-700 focus:border-black dark:focus:border-white outline-none bg-transparent transition-colors"
          />
        </div>
        <button 
          onClick={generateName}
          disabled={isLoadingAI}
          className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 hover:underline disabled:opacity-50"
        >
          {isLoadingAI ? <div className="animate-spin w-4 h-4 border-2 border-current rounded-full border-t-transparent"></div> : <span className="text-lg">✨</span>}
          {t.generateAI}
        </button>
     </div>
  );

  // Updated Structure Step to match the list style checkbox design
  const renderStructureStep = () => renderSplitScreen(
    t.structureTitle,
    t.structureSubtitle,
    <div className="space-y-4">
       {Object.entries(t.sections).map(([key, label]) => {
         const isSelected = config.structure.includes(key);
         return (
           <label 
             key={key}
             className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-neutral-800 group"
           >
              <div className="flex items-center gap-4">
                 {/* Visual Checkbox */}
                 <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 
                    ${isSelected 
                        ? 'bg-black border-black dark:bg-white dark:border-white text-white dark:text-black' 
                        : 'border-gray-300 dark:border-neutral-600 group-hover:border-gray-400'
                    }`}
                 >
                    {isSelected && <Check className="w-4 h-4" strokeWidth={3} />}
                 </div>
                 <span className="font-medium text-lg">{label}</span>
              </div>
              
              {/* Actual Input hidden */}
              <input 
                 type="checkbox" 
                 className="hidden" 
                 checked={isSelected}
                 onChange={() => toggleStructure(key)}
              />
           </label>
         )
       })}
    </div>
  );

  const renderPaletteStep = () => renderSplitScreen(
    t.paletteTitle,
    t.paletteSubtitle,
    <div className="grid grid-cols-1 gap-4">
      {PALETTES.map(palette => (
        <button
          key={palette.id}
          onClick={() => setConfig({ ...config, palette: palette.id })}
          className={`group p-2 rounded-lg border transition-all hover:shadow-lg
            ${config.palette === palette.id ? 'border-black dark:border-white ring-1 ring-black dark:ring-white' : 'border-transparent hover:border-gray-200'}
          `}
        >
           <div className="flex items-center gap-4">
              <div className="flex rounded-md overflow-hidden h-16 w-full shadow-sm">
                {palette.colors.map((c, i) => (
                  <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }}></div>
                ))}
              </div>
           </div>
           <div className="mt-2 text-xs font-bold uppercase tracking-wider text-left px-1 opacity-70 group-hover:opacity-100">{palette.name}</div>
        </button>
      ))}
    </div>
  );

  const renderFontStep = () => renderSplitScreen(
    t.fontTitle,
    t.fontSubtitle,
    <div className="grid grid-cols-1 gap-4">
      {FONT_PAIRS.map(font => (
        <button
          key={font.id}
          onClick={() => setConfig({ ...config, fontPair: font.id })}
          className={`p-6 rounded-lg border text-left transition-all
            ${config.fontPair === font.id ? 'border-black bg-gray-50 dark:border-white dark:bg-neutral-800' : 'border-gray-200 dark:border-neutral-700 hover:border-gray-400'}
          `}
        >
           <div className={`text-3xl mb-1 ${font.heading}`}>Ag</div>
           <div className={`text-sm opacity-60 ${font.body}`}>The quick brown fox jumps over the lazy dog.</div>
           <div className="mt-4 text-xs font-bold uppercase tracking-wider opacity-40">{font.name}</div>
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen font-sans selection:bg-yellow-200 selection:text-black">
      {step === WizardStep.LANDING ? renderLandingHeader() : step !== WizardStep.DASHBOARD && renderWizardHeader()}
      
      <main>
        {step === WizardStep.LANDING && renderLandingPage()}
        {step === WizardStep.TOPIC && renderTopicSelection()}
        {step === WizardStep.GOALS && renderGoalSelection()}
        {step === WizardStep.NAME && renderNameStep()}
        {step === WizardStep.STRUCTURE && renderStructureStep()}
        {step === WizardStep.PALETTE && renderPaletteStep()}
        {step === WizardStep.FONTS && renderFontStep()}
        {step === WizardStep.DASHBOARD && (
          <EditorDashboard 
            config={config} 
            lang={lang} 
            onUpdateConfig={handleContentUpdate}
          />
        )}
      </main>

      {renderNavigation()}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);