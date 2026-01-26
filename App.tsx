
import React, { useState, useEffect } from 'react';
import { Scanner } from './components/Scanner';
import { History } from './components/History';
import { AppTab, ScanHistoryItem, Language, LANGUAGES, ScanMode } from './types';

/**
 * Robust Error Screen for missing environment variables on Vercel.
 */
const ApiKeyError: React.FC = () => (
  <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-neutral-900 text-white p-10 items-center justify-center text-center">
    <div className="bg-yellow-400 text-black rounded-full w-20 h-20 flex items-center justify-center mb-8 shadow-2xl">
      <span className="text-5xl">!</span>
    </div>
    <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Setup Required</h1>
    <p className="text-neutral-400 text-lg leading-relaxed mb-8">
      The <span className="text-yellow-400 font-bold">API_KEY</span> is missing. 
    </p>
    <div className="bg-black/50 p-6 rounded-2xl border border-neutral-800 text-left text-sm font-mono text-neutral-300">
      1. Go to Vercel Project Settings<br/>
      2. Add <strong>API_KEY</strong> variable<br/>
      3. Redeploy your app
    </div>
    <a 
      href="https://ai.google.dev/" 
      target="_blank" 
      rel="noopener noreferrer"
      className="mt-8 text-yellow-400 underline font-bold uppercase tracking-widest text-xs"
    >
      Get a Gemini API Key
    </a>
  </div>
);

const App: React.FC = () => {
  // Guard for Vercel deployment
  if (!process.env.API_KEY) {
    return <ApiKeyError />;
  }

  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.SCAN);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [language, setLanguage] = useState<Language>('en-US');

  useEffect(() => {
    const savedHistory = localStorage.getItem('vision_assist_history');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) {}
    }
    const savedLanguage = localStorage.getItem('vision_assist_language');
    if (savedLanguage === 'en-US' || savedLanguage === 'hi-IN') setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    localStorage.setItem('vision_assist_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('vision_assist_language', language);
  }, [language]);

  const addScanToHistory = (item: Omit<ScanHistoryItem, 'language' | 'mode'>, mode: ScanMode) => {
    const newScan: ScanHistoryItem = { 
      ...item, 
      language,
      mode 
    };
    setHistory(prev => [newScan, ...prev].slice(0, 50));
  };

  const toggleLanguage = () => {
    if ('vibrate' in navigator) navigator.vibrate(50);
    setLanguage(prev => (prev === 'en-US' ? 'hi-IN' : 'en-US'));
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-black shadow-2xl relative overflow-hidden font-sans select-none">
      <main className="flex-1 relative overflow-hidden">
        {currentTab === AppTab.SCAN ? (
          <Scanner onScanComplete={addScanToHistory} language={language} />
        ) : (
          <History history={history} onClear={() => setHistory([])} />
        )}
      </main>

      {/* Flutter-style Bottom Navigation */}
      <nav className="flex h-24 bg-neutral-900 border-t border-neutral-800 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <button 
          onClick={() => { if ('vibrate' in navigator) navigator.vibrate(20); setCurrentTab(AppTab.SCAN); }} 
          className={`flex-1 flex flex-col items-center justify-center transition-all ${currentTab === AppTab.SCAN ? 'text-yellow-400 scale-110' : 'text-neutral-500'}`}
        >
          <span className="text-3xl mb-1">📷</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Scan</span>
        </button>
        <button 
          onClick={() => { if ('vibrate' in navigator) navigator.vibrate(20); setCurrentTab(AppTab.HISTORY); }} 
          className={`flex-1 flex flex-col items-center justify-center transition-all ${currentTab === AppTab.HISTORY ? 'text-yellow-400 scale-110' : 'text-neutral-500'}`}
        >
          <span className="text-3xl mb-1">📜</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">History</span>
        </button>
        <button 
          onClick={toggleLanguage} 
          className="flex-1 flex flex-col items-center justify-center text-neutral-400"
        >
          <span className="text-xl font-black mb-1 leading-none border-2 border-neutral-700 px-2 py-0.5 rounded-md">{LANGUAGES[language].code}</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Lang</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
