import React, { useState } from 'react';
import { SiteConfig, Language } from '../types';
import { PreviewFrame } from './PreviewFrame';
import { AssetLibrary } from './AssetLibrary';
import { 
  Layout, Palette, ShoppingBag, BarChart3, Settings, 
  Monitor, Smartphone, ChevronLeft, ChevronRight, Globe, Plus, Upload, Type,
  Lock, RotateCw, Image as ImageIcon, Rocket, X, Check, ExternalLink, PartyPopper
} from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface EditorDashboardProps {
  config: SiteConfig;
  lang: Language;
  onUpdateConfig: (key: string, value: string) => void;
}

export const EditorDashboard: React.FC<EditorDashboardProps> = ({ config, lang, onUpdateConfig }) => {
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState('pages');
  const [editingImageContext, setEditingImageContext] = useState<string | null>(null);

  // Publishing State
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [publishData, setPublishData] = useState({
    seoTitle: config.name || '',
    seoDesc: config.description || '',
    slug: (config.name || 'mysite').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  });

  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';

  const menuItems = [
    { id: 'pages', icon: Layout, label: t.editorPages },
    { id: 'design', icon: Palette, label: t.editorDesign },
    { id: 'library', icon: ImageIcon, label: t.editorLibrary },
    { id: 'commerce', icon: ShoppingBag, label: t.editorCommerce },
    { id: 'analytics', icon: BarChart3, label: t.editorAnalytics },
    { id: 'settings', icon: Settings, label: t.editorSettings },
  ];

  const handleEditImageRequest = (context: string) => {
    setEditingImageContext(context);
    setActiveTab('library');
  };

  const handleSelectImage = (url: string, target?: string) => {
    const effectiveTarget = target || editingImageContext;
    if (!effectiveTarget) return;
    
    const keyMap: Record<string, string> = {
        'hero': '_hero_image_override',
        'about': '_about_image_override',
    };
    
    const configKey = keyMap[effectiveTarget] || `_image_override_${effectiveTarget}`;
    onUpdateConfig(configKey, url);

    if (editingImageContext) {
        setEditingImageContext(null);
    }
  };

  const handleSelectIcon = (iconName: string) => {
     console.log('Icon selected:', iconName);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    // Simulate network delay for publishing
    setTimeout(() => {
      setIsPublishing(false);
      setIsPublished(true);
    }, 2500);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-neutral-900 overflow-hidden font-sans text-neutral-900 dark:text-white transition-colors relative">
       
       {/* PUBLISH MODAL OVERLAY */}
       {showPublishModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className={`bg-white dark:bg-neutral-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-neutral-800 transform transition-all ${isPublished ? 'scale-105' : 'scale-100'}`}>
               
               {/* Modal Header */}
               <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-neutral-800">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    {isPublished ? <PartyPopper className="w-6 h-6 text-yellow-500 animate-bounce" /> : <Rocket className="w-5 h-5 text-blue-600" />}
                    {isPublished ? t.pubSuccessTitle : t.pubModalTitle}
                  </h2>
                  <button onClick={() => { setShowPublishModal(false); setIsPublished(false); }} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
               </div>

               {/* Modal Content */}
               <div className="p-6">
                 {!isPublished ? (
                   <div className="space-y-4">
                      <p className="text-sm text-gray-500 mb-6">{t.pubModalSubtitle}</p>
                      
                      {/* SEO Title Input */}
                      <div>
                         <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t.pubSeoTitle}</label>
                         <input 
                           type="text" 
                           value={publishData.seoTitle}
                           onChange={(e) => setPublishData({...publishData, seoTitle: e.target.value})}
                           className="w-full p-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                         />
                      </div>

                      {/* Meta Description Input */}
                      <div>
                         <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t.pubSeoDesc}</label>
                         <textarea 
                           value={publishData.seoDesc}
                           onChange={(e) => setPublishData({...publishData, seoDesc: e.target.value})}
                           className="w-full p-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm min-h-[80px] focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                         />
                      </div>

                      {/* Slug Input */}
                      <div>
                         <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t.pubSlug}</label>
                         <div className="flex items-center bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                            <div className="px-3 py-3 text-sm text-gray-400 border-r border-gray-200 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-900 select-none">
                              aemam.com/
                            </div>
                            <input 
                              type="text" 
                              value={publishData.slug}
                              onChange={(e) => setPublishData({...publishData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                              className="flex-1 p-3 bg-transparent text-sm focus:outline-none font-medium"
                            />
                         </div>
                      </div>
                   </div>
                 ) : (
                   <div className="text-center py-6">
                      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                         <Check className="w-10 h-10 text-green-600 dark:text-green-400" strokeWidth={3} />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto leading-relaxed">
                        {t.pubSuccessDesc}
                      </p>
                      <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 flex items-center justify-between mb-2">
                         <span className="text-sm font-bold text-blue-600 truncate max-w-[200px] dir-ltr">
                           https://aemam.com/{publishData.slug}
                         </span>
                         <button className="text-xs font-bold uppercase text-gray-400 hover:text-black dark:hover:text-white">Copy</button>
                      </div>
                   </div>
                 )}
               </div>

               {/* Modal Footer */}
               <div className="p-6 border-t border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 flex justify-end gap-3">
                  {!isPublished ? (
                    <>
                      <button 
                        onClick={() => setShowPublishModal(false)}
                        className="px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors"
                      >
                        {t.back}
                      </button>
                      <button 
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="bg-black dark:bg-white text-white dark:text-black px-8 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50 shadow-lg transition-all"
                      >
                        {isPublishing ? (
                          <>
                             <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                             {t.pubLaunching}
                          </>
                        ) : (
                          <>
                             <Rocket className="w-4 h-4" />
                             {t.pubLaunch}
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => { setShowPublishModal(false); setIsPublished(false); }}
                        className="px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors"
                      >
                        {t.pubBackToEditor}
                      </button>
                      <button 
                        onClick={() => window.open(`https://${publishData.slug}.aemam.com`, '_blank')}
                        className="bg-green-600 text-white px-8 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-green-700 shadow-lg transition-all"
                      >
                         {t.pubVisitLink}
                         <ExternalLink className="w-4 h-4" />
                      </button>
                    </>
                  )}
               </div>
            </div>
         </div>
       )}

       {/* Sidebar - Flows naturally: Left in LTR, Right in RTL */}
       <aside className="w-20 lg:w-64 ltr:border-r rtl:border-l border-gray-200 dark:border-neutral-800 flex flex-col bg-gray-50 dark:bg-neutral-950 flex-shrink-0 z-20 transition-all duration-300">
          <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-200 dark:border-neutral-800">
             <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center font-bold">
               A
             </div>
             <span className="hidden lg:block mx-3 font-bold truncate">{config.name || (lang === 'en' ? 'AEMAM' : 'زمام')}</span>
          </div>
          
          <nav className="flex-1 py-6 space-y-1 px-2 lg:px-4">
             {menuItems.map(item => (
               <button 
                 key={item.id}
                 onClick={() => { setActiveTab(item.id); setEditingImageContext(null); }}
                 className={`w-full flex items-center p-3 rounded-lg transition-all group relative
                    ${activeTab === item.id 
                      ? 'bg-white dark:bg-neutral-900 shadow-sm text-black dark:text-white' 
                      : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-neutral-900'}
                 `}
               >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="hidden lg:block mx-3 font-medium text-sm">{item.label}</span>
                  {activeTab === item.id && (
                    <div className={`absolute top-1/2 -translate-y-1/2 w-1 h-8 bg-black dark:bg-white rounded-full ${isRTL ? '-left-1' : '-right-1'}`}></div>
                  )}
               </button>
             ))}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-neutral-800">
             <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-900 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 ring-2 ring-white dark:ring-black"></div>
                <div className="hidden lg:block">
                   <div className="text-xs font-bold">Admin User</div>
                   <div className="text-[10px] opacity-60">Pro Plan</div>
                </div>
             </div>
          </div>
       </aside>

       {/* Secondary Sidebar (Library/Tools) - Only visible when Library is active */}
       {activeTab === 'library' && (
         <aside className="w-80 bg-white dark:bg-neutral-900 ltr:border-r rtl:border-l border-gray-200 dark:border-neutral-800 flex flex-col z-10 animate-fade-in">
            <AssetLibrary 
              lang={lang} 
              config={config} 
              onSelectImage={handleSelectImage}
              onSelectIcon={handleSelectIcon}
              activeContext={editingImageContext} 
            />
         </aside>
       )}

       {/* Main Area */}
       <main className="flex-1 flex flex-col relative h-full">
          {/* Toolbar */}
          <header className="h-16 bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between px-4 z-10">
             <div className="flex items-center gap-2">
                 <button className="hidden md:flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 transition-opacity">
                    <Globe className="w-4 h-4" />
                    <span dir="ltr">https://{publishData.slug || 'site'}.aemam.com</span>
                 </button>
             </div>

             <div className="flex items-center bg-gray-100 dark:bg-neutral-900 rounded-lg p-1 gap-1">
                <button 
                  onClick={() => setView('desktop')}
                  className={`p-2 rounded-md transition-all ${view === 'desktop' ? 'bg-white dark:bg-neutral-800 shadow-sm text-black dark:text-white' : 'text-gray-400'}`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setView('mobile')}
                  className={`p-2 rounded-md transition-all ${view === 'mobile' ? 'bg-white dark:bg-neutral-800 shadow-sm text-black dark:text-white' : 'text-gray-400'}`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
             </div>

             <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                   {t.saved}
                </span>
                <button 
                  onClick={() => setShowPublishModal(true)}
                  className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full text-sm font-bold hover:opacity-80 transition-opacity shadow-lg flex items-center gap-2"
                >
                   {t.editorPublish}
                </button>
             </div>
          </header>

          {/* Canvas Area */}
          <div className="flex-1 overflow-hidden bg-gray-100/50 dark:bg-neutral-900/50 relative flex justify-center p-2 lg:p-4">
             
             {/* Edit Tools Overlay */}
             <div className={`absolute top-6 bottom-6 w-12 bg-white dark:bg-neutral-950 rounded-full shadow-xl flex flex-col items-center py-6 gap-6 z-20 border border-gray-200 dark:border-neutral-800 hidden xl:flex animate-fade-in ${isRTL ? 'left-6' : 'right-6'}`}>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full tooltip" title="Add Block"><Plus className="w-5 h-5" /></button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full"><Type className="w-5 h-5" /></button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full"><Upload className="w-5 h-5" /></button>
                <div className="flex-1"></div>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full"><Settings className="w-5 h-5" /></button>
             </div>

             {/* Browser / Phone Container */}
             <div 
               className={`
                  transition-all duration-500 ease-in-out shadow-2xl relative flex flex-col
                  ${view === 'mobile' 
                    ? 'w-[375px] h-[95%] rounded-[3rem] border-[8px] border-neutral-900 bg-neutral-900' 
                    : 'w-full h-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-950'}
               `}
             >
                {/* Desktop Browser Bar */}
                {view === 'desktop' && (
                  <div className="h-10 bg-gray-50 dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 flex items-center px-4 gap-4 flex-shrink-0 rounded-t-xl select-none">
                      <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400/80 hover:bg-red-400 transition-colors"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400/80 hover:bg-yellow-400 transition-colors"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400/80 hover:bg-green-400 transition-colors"></div>
                      </div>
                      <div className="flex gap-2 text-gray-400 dark:text-neutral-600">
                          <ChevronLeft className="w-4 h-4" />
                          <ChevronRight className="w-4 h-4" />
                          <RotateCw className="w-3 h-3" />
                      </div>
                      <div className="flex-1 bg-white dark:bg-neutral-950 h-7 rounded-md border border-gray-200 dark:border-neutral-800 flex items-center px-3 text-xs text-gray-500 dark:text-gray-400 gap-2 mx-2">
                         <Lock className="w-3 h-3 opacity-50" />
                         <span className="opacity-70 font-sans truncate">https://{publishData.slug || 'site'}.aemam.com</span>
                      </div>
                  </div>
                )}
                
                {/* Mobile Notch */}
                {view === 'mobile' && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-neutral-900 rounded-b-2xl z-50 pointer-events-none"></div>
                )}
                
                <div className={`flex-1 overflow-hidden relative ${view === 'mobile' ? 'rounded-[2.5rem] bg-white' : 'bg-white'}`}>
                    <div className={`w-full h-full overflow-y-auto ${view === 'mobile' ? 'scrollbar-hide' : 'scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-700'}`}>
                       <PreviewFrame 
                          config={config} 
                          lang={lang} 
                          editable={true} 
                          onUpdate={onUpdateConfig}
                          onEditImage={handleEditImageRequest} 
                       />
                    </div>
                </div>
             </div>
          </div>
       </main>
    </div>
  );
};