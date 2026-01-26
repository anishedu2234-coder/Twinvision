
import React, { useState } from 'react';
import { ScanHistoryItem, LANGUAGES } from '../types';
import { generateSpeech, decodeBase64, decodeAudioData } from '../services/gemini';

interface HistoryProps {
  history: ScanHistoryItem[];
  onClear: () => void;
}

export const History: React.FC<HistoryProps> = ({ history, onClear }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const playAudio = async (text: string) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      if (audioCtx.state === 'suspended') await audioCtx.resume();
      const base64Audio = await generateSpeech(text);
      const audioData = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(audioData, audioCtx);
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start();
    } catch (err) {
      console.error("Playback error:", err);
    }
  };

  const handleClearRequest = () => {
    if ('vibrate' in navigator) navigator.vibrate(50);
    setShowConfirm(true);
  };

  const confirmClear = () => {
    if ('vibrate' in navigator) navigator.vibrate([50, 30, 50]);
    onClear();
    setShowConfirm(false);
  };

  const cancelClear = () => {
    if ('vibrate' in navigator) navigator.vibrate(20);
    setShowConfirm(false);
  };

  if (history.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-neutral-950 text-neutral-500">
        <div className="w-24 h-24 bg-neutral-900 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <span className="text-5xl">📜</span>
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter text-neutral-600">No History</h2>
        <p className="mt-2 text-sm max-w-[200px]">Your scanned scenes and documents will appear here.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-neutral-950 relative">
      {/* Confirmation Dialog Overlay */}
      {showConfirm && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-neutral-900 border-2 border-neutral-800 rounded-[32px] p-8 w-full max-w-sm shadow-[0_20px_60px_rgba(0,0,0,1)] text-center animate-in fade-in zoom-in duration-200">
            <div className="text-4xl mb-4">🗑️</div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Clear History?</h3>
            <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
              Are you sure you want to delete all saved scans? This action cannot be undone.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmClear}
                className="bg-red-500 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-sm shadow-lg shadow-red-500/20 active:scale-95 transition-transform"
              >
                Confirm Delete
              </button>
              <button 
                onClick={cancelClear}
                className="bg-neutral-800 text-neutral-300 font-black py-4 rounded-2xl uppercase tracking-widest text-sm active:scale-95 transition-transform"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="px-6 py-8 border-b border-neutral-900 flex justify-between items-center bg-neutral-950/80 backdrop-blur-xl sticky top-0 z-10 shadow-lg">
        <h2 className="text-3xl font-black text-yellow-400 uppercase tracking-tighter">History</h2>
        <button 
          onClick={handleClearRequest} 
          className="bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-red-500/20 active:bg-red-500 active:text-white transition-all"
        >
          Clear All
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {history.map((item) => (
          <div key={item.id} className="bg-neutral-900 rounded-[28px] overflow-hidden border border-neutral-800 shadow-xl active:scale-[0.98] transition-transform">
            <div className="flex">
              <div className="w-28 h-28 shrink-0 relative">
                <img src={item.image} className="w-full h-full object-cover" alt="Scan" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-wider">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className="flex gap-1.5">
                      <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 text-[9px] font-black rounded-md uppercase border border-neutral-700">
                        {item.mode}
                      </span>
                      <span className="px-2 py-0.5 bg-yellow-400 text-black text-[9px] font-black rounded-md uppercase">
                        {LANGUAGES[item.language].code}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-200 line-clamp-2 leading-snug font-medium">{item.description}</p>
                </div>
                <button 
                  onClick={() => { if ('vibrate' in navigator) navigator.vibrate(30); playAudio(item.description); }} 
                  className="mt-3 text-[10px] font-black uppercase tracking-widest text-yellow-400 flex items-center gap-2 bg-yellow-400/5 self-start px-3 py-1.5 rounded-lg border border-yellow-400/10 active:bg-yellow-400 active:text-black transition-all"
                >
                  <span className="text-xs">🔊</span> Speak Again
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="h-10" /> {/* Padding for the bottom of the list */}
      </div>
    </div>
  );
};
