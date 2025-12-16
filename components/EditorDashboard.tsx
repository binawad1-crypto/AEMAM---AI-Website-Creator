import React, { useState } from 'react';
import { SiteConfig, Language } from '../types';
import { PreviewFrame } from './PreviewFrame';
import { 
  Layout, Palette, ShoppingBag, BarChart3, Settings, 
  Monitor, Smartphone, ChevronLeft, ChevronRight, Globe, Plus, Upload, Type,
  Lock, RotateCw
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
  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';

  const menuItems = [
    { id: 'pages', icon: Layout, label: t.editorPages },
    { id: 'design', icon: Palette, label: t.editorDesign },
    { id: 'commerce', icon: ShoppingBag, label: t.editorCommerce },
    { id: 'analytics', icon: BarChart3, label: t.editorAnalytics },
    { id: 'settings', icon: Settings, label: t.editorSettings },
  ];

  return (
    <div className="flex h-screen bg-white dark:bg-neutral-900 overflow-hidden font-sans text-neutral-900 dark:text-white transition-colors">
       {/* Sidebar */}
       <aside className="w-20 lg:w-64 border-r border-gray-200 dark:border-neutral-800 flex flex-col bg-gray-50 dark:bg-neutral-950 flex-shrink-0 z-20 transition-all duration-300">
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
                 onClick={() => setActiveTab(item.id)}
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

       {/* Main Area */}
       <main className="flex-1 flex flex-col relative h-full">
          {/* Toolbar */}
          <header className="h-16 bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between px-4 z-10">
             <div className="flex items-center gap-2">
                 <button className="hidden md:flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 transition-opacity">
                    <Globe className="w-4 h-4" />
                    <span dir="ltr">https://{config.name ? config.name.toLowerCase().replace(/\s/g,'') : 'site'}.aemam.com</span>
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
                <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full text-sm font-bold hover:opacity-80 transition-opacity shadow-lg">
                   {t.editorPublish}
                </button>
             </div>
          </header>

          {/* Canvas Area */}
          <div className="flex-1 overflow-hidden bg-gray-100/50 dark:bg-neutral-900/50 relative flex justify-center p-4 lg:p-8">
             {/* Edit Tools Overlay (Left) */}
             <div className="absolute top-8 left-8 bottom-8 w-12 bg-white dark:bg-neutral-950 rounded-full shadow-xl flex flex-col items-center py-6 gap-6 z-20 border border-gray-200 dark:border-neutral-800 hidden xl:flex animate-fade-in">
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
                    : 'w-full max-w-[1400px] h-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-950'}
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
                         <span className="opacity-70 font-sans truncate">https://{config.name ? config.name.toLowerCase().replace(/\s/g,'') : 'site'}.aemam.com</span>
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
                       />
                    </div>
                </div>
             </div>
          </div>
       </main>
    </div>
  );
};