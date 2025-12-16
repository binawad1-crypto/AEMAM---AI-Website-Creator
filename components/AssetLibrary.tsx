import React, { useState, useEffect } from 'react';
import { Search, Image, Sparkles, Shapes, ArrowRight, ArrowLeft, Loader2, Check } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language, SiteConfig } from '../types';

interface AssetLibraryProps {
  lang: Language;
  config: SiteConfig;
  onSelectImage: (imageUrl: string, target?: string) => void;
  onSelectIcon: (iconName: string) => void;
  activeContext?: string | null; // The section/image currently being edited (e.g., 'hero')
}

// Curated high-quality categories for Unsplash Source
const STOCK_CATEGORIES = [
  { id: 'business', label: 'Business' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'nature', label: 'Nature' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'food', label: 'Food & Drink' },
  { id: 'technology', label: 'Tech' },
  { id: 'abstract', label: 'Abstract' },
];

const ICONS_LIST = [
  'Zap', 'Star', 'CheckCircle', 'ShieldCheck', 'Globe', 'Smartphone', 
  'Mail', 'Phone', 'MapPin', 'Calendar', 'Clock', 'User', 'Users', 
  'Briefcase', 'ShoppingBag', 'CreditCard', 'BarChart', 'PieChart',
  'Camera', 'Video', 'Music', 'Headphones', 'Coffee', 'Sun', 'Moon'
];

export const AssetLibrary: React.FC<AssetLibraryProps> = ({ lang, config, onSelectImage, onSelectIcon, activeContext }) => {
  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';
  
  const [activeTab, setActiveTab] = useState<'photos' | 'icons' | 'ai'>('photos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // If a user clicks an image in the preview, we can auto-fill the search with the topic or context
  useEffect(() => {
    if (activeContext) {
      // Clear previous search/selection
      setSelectedAsset(null);
      
      // Heuristic: If context is 'hero', maybe don't search 'hero', but search the site topic
      // If context is 'team', search 'team'
      // This is a subtle UX enhancement.
      if (['hero', 'bg'].includes(activeContext)) {
          // Keep search empty to show categories, or search topic
          // setSearchQuery(config.topic);
      } else if (!searchQuery) {
          // If context is specific like 'coffee', we might want to search it? 
          // For now, let's just reset tabs to photos if it's an image context
          setActiveTab('photos');
      }
    }
  }, [activeContext]);

  // Generate image using Pollinations (Client-side AI)
  const handleGenerateAI = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    
    // Simulate processing time for UX
    setTimeout(() => {
      const visualStyle = config.content?.['_visual_style'] || 'modern minimalist';
      const prompt = `${visualStyle} ${aiPrompt}`;
      const encoded = encodeURIComponent(prompt);
      const url = `https://image.pollinations.ai/prompt/${encoded}?width=800&height=600&nologo=true&seed=${Math.random()}`;
      setGeneratedImage(url);
      setSelectedAsset(url);
      setIsGenerating(false);
    }, 1500);
  };

  const handleApplyAsset = (target?: string) => {
    // If we have an active context (user clicked an image in preview), use that target
    const finalTarget = activeContext || target;

    if (activeTab === 'icons' && selectedAsset) {
        onSelectIcon(selectedAsset);
    } else if (selectedAsset && finalTarget) {
        onSelectImage(selectedAsset, finalTarget);
    }
    // Reset selection after apply
    setSelectedAsset(null);
  };

  // Immediate apply if context is active
  const handleAssetClick = (asset: string) => {
    if (activeContext) {
        // If in "Edit Mode", apply immediately
        if (activeTab === 'icons') {
             onSelectIcon(asset);
        } else {
             onSelectImage(asset, activeContext);
        }
    } else {
        // Normal mode: select first, then ask where to apply
        setSelectedAsset(asset);
    }
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-neutral-900 overflow-hidden">
       {/* Library Header */}
       <div className="p-4 border-b border-gray-200 dark:border-neutral-800">
          {activeContext && (
             <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold border border-blue-100 dark:border-blue-900/30 flex items-center gap-2 animate-fade-in">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                {lang === 'en' ? `Editing: ${activeContext}` : `تعديل: ${activeContext}`}
             </div>
          )}

          <div className="relative mb-4">
             <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
             <input 
               type="text" 
               placeholder={t.libSearch}
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className={`w-full p-2 bg-gray-100 dark:bg-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white ${isRTL ? 'pr-9' : 'pl-9'}`}
             />
          </div>
          
          <div className="flex gap-1 bg-gray-100 dark:bg-neutral-800 p-1 rounded-lg">
             {[
               { id: 'photos', label: t.libPhotos, icon: Image },
               { id: 'icons', label: t.libIcons, icon: Shapes },
               { id: 'ai', label: t.libAI, icon: Sparkles },
             ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => { setActiveTab(tab.id as any); setSelectedAsset(null); }}
                 className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all
                   ${activeTab === tab.id 
                     ? 'bg-white dark:bg-neutral-700 shadow-sm text-black dark:text-white' 
                     : 'text-gray-500 hover:text-black dark:hover:text-white'}
                 `}
               >
                 <tab.icon className="w-3 h-3" />
                 <span className="hidden sm:inline">{tab.label}</span>
               </button>
             ))}
          </div>
       </div>

       {/* Library Content */}
       <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-neutral-800">
          
          {/* 1. STOCK PHOTOS */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
               {!searchQuery && (
                 <div>
                   <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">{lang === 'en' ? 'Categories' : 'التصنيفات'}</h4>
                   <div className="flex flex-wrap gap-2">
                      {STOCK_CATEGORIES.map(cat => (
                        <button 
                          key={cat.id}
                          onClick={() => setSearchQuery(cat.id)}
                          className="px-3 py-1 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-full text-xs hover:border-black dark:hover:border-white transition-colors"
                        >
                          {cat.label}
                        </button>
                      ))}
                   </div>
                 </div>
               )}

               <div className="grid grid-cols-2 gap-2">
                  {/* Mocking a list of images based on query or default */}
                  {Array.from({ length: 12 }).map((_, i) => {
                     const keyword = searchQuery || config.topic || 'business';
                     // Using a direct image service for reliability:
                     const reliableUrl = `https://picsum.photos/seed/${keyword}${i}/400/400`;
                     
                     return (
                       <div 
                         key={i} 
                         onClick={() => handleAssetClick(reliableUrl)}
                         className={`aspect-square rounded-lg overflow-hidden cursor-pointer relative group border-2 transition-all ${selectedAsset === reliableUrl ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2' : 'border-transparent'}`}
                       >
                          <img src={reliableUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Stock" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          {activeContext && (
                             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">Apply</span>
                             </div>
                          )}
                       </div>
                     )
                  })}
               </div>
            </div>
          )}

          {/* 2. ICONS */}
          {activeTab === 'icons' && (
            <div className="grid grid-cols-4 gap-4">
               {ICONS_LIST.filter(icon => icon.toLowerCase().includes(searchQuery.toLowerCase())).map(icon => (
                 <div 
                   key={icon}
                   onClick={() => handleAssetClick(icon)}
                   className={`aspect-square flex flex-col items-center justify-center gap-2 rounded-xl bg-gray-50 dark:bg-neutral-800 border-2 cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-neutral-700
                     ${selectedAsset === icon ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}
                   `}
                 >
                    {/* Simplified: In a real app we'd map string to component */}
                    <div className="font-bold text-xs">{icon}</div>
                 </div>
               ))}
            </div>
          )}

          {/* 3. AI STUDIO */}
          {activeTab === 'ai' && (
             <div className="space-y-6">
                <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
                   <h3 className="font-bold mb-2 flex items-center gap-2 text-indigo-500">
                     <Sparkles className="w-4 h-4" /> 
                     {t.libAI}
                   </h3>
                   <textarea 
                     value={aiPrompt}
                     onChange={(e) => setAiPrompt(e.target.value)}
                     placeholder={t.libPromptPlaceholder}
                     className="w-full p-3 rounded-lg bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-sm min-h-[100px] focus:ring-2 focus:ring-indigo-500 outline-none mb-3"
                   />
                   <button 
                     onClick={handleGenerateAI}
                     disabled={isGenerating || !aiPrompt}
                     className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                   >
                     {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : t.libGenerate}
                   </button>
                </div>

                {generatedImage && (
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Result</div>
                    <div 
                      onClick={() => handleAssetClick(generatedImage)}
                      className={`rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selectedAsset === generatedImage ? 'border-indigo-500' : 'border-transparent'}`}
                    >
                       <img src={generatedImage} className="w-full h-auto" alt="Generated" />
                    </div>
                  </div>
                )}
             </div>
          )}
       </div>

       {/* Selection Footer (Action Bar) - ONLY SHOW IF NOT IN DIRECT EDIT MODE */}
       {selectedAsset && !activeContext && (
         <div className="p-4 border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 animate-slide-up">
            <div className="text-xs font-bold uppercase mb-2 opacity-60">{t.libApplyTo}</div>
            <div className="grid grid-cols-2 gap-2">
               {activeTab !== 'icons' ? (
                 <>
                   <button onClick={() => handleApplyAsset('hero')} className="py-2 px-3 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded text-xs font-medium text-left truncate">{t.libSectionHero}</button>
                   <button onClick={() => handleApplyAsset('about')} className="py-2 px-3 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded text-xs font-medium text-left truncate">{t.libSectionAbout}</button>
                   <button onClick={() => handleApplyAsset('bg')} className="py-2 px-3 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded text-xs font-medium text-left truncate">Background</button>
                   <button onClick={() => handleApplyAsset('gallery')} className="py-2 px-3 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded text-xs font-medium text-left truncate">Gallery Item</button>
                 </>
               ) : (
                 <>
                   <button onClick={() => handleApplyAsset('feature1')} className="py-2 px-3 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded text-xs font-medium text-left truncate">{t.libSectionFeature} 1</button>
                   <button onClick={() => handleApplyAsset('feature2')} className="py-2 px-3 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded text-xs font-medium text-left truncate">{t.libSectionFeature} 2</button>
                 </>
               )}
            </div>
         </div>
       )}
    </div>
  );
};
