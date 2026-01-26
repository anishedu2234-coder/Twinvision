
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { describeScene, generateSpeech, decodeBase64, decodeAudioData } from '../services/gemini';
import { ScanHistoryItem, Language, ScanMode } from '../types';

type PermissionState = 'prompting' | 'granted' | 'denied';

interface ScannerProps {
  onScanComplete: (item: Omit<ScanHistoryItem, 'language' | 'mode'>, mode: ScanMode) => void;
  language: Language;
}

export const Scanner: React.FC<ScannerProps> = ({ onScanComplete, language }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastDescription, setLastDescription] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [permissionState, setPermissionState] = useState<PermissionState>('prompting');
  const [scanMode, setScanMode] = useState<ScanMode>(ScanMode.GENERAL);
  const audioContextRef = useRef<AudioContext | null>(null);

  const vibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const requestCameraPermission = useCallback(async () => {
    setErrorMessage(null);
    setPermissionState('prompting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setPermissionState('granted');
    } catch (err: any) {
      setPermissionState('denied');
      setErrorMessage("Camera access is required for vision.");
      vibrate(200);
    }
  }, []);

  useEffect(() => {
    requestCameraPermission();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, [requestCameraPermission]);

  const playDescription = async (text: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const audioCtx = audioContextRef.current;
      if (audioCtx.state === 'suspended') await audioCtx.resume();

      const base64Audio = await generateSpeech(text);
      const audioData = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(audioData, audioCtx);
      
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start();
    } catch (err) {
      console.error("Speech playback error:", err);
    }
  };

  const handleScan = useCallback(async () => {
    if (isProcessing || permissionState !== 'granted' || !videoRef.current || !canvasRef.current || !isVideoReady) {
      if (permissionState === 'denied') {
        vibrate(200);
        requestCameraPermission();
      }
      return;
    }

    vibrate(50); // Immediate feedback for touch
    setIsProcessing(true);
    setErrorMessage(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const scale = Math.min(1, 768 / Math.max(video.videoWidth, video.videoHeight));
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;

    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const fullDataUrl = canvas.toDataURL('image/jpeg', 0.6);
      const base64Image = fullDataUrl.split(',')[1];

      try {
        const description = await describeScene(base64Image, language, scanMode);
        setLastDescription(description);
        
        onScanComplete({
          id: Date.now().toString(),
          timestamp: Date.now(),
          image: fullDataUrl,
          description,
        }, scanMode);
        
        vibrate([100, 50, 100]); // Double-buzz success pattern
        await playDescription(description);
      } catch (err: any) {
        setErrorMessage(err.message || "An unexpected error occurred.");
        vibrate(200);
      } finally {
        setIsProcessing(false);
      }
    }
  }, [isProcessing, isVideoReady, onScanComplete, permissionState, language, scanMode, requestCameraPermission]);

  const toggleMode = () => {
    const newMode = scanMode === ScanMode.GENERAL ? ScanMode.DOCUMENT : ScanMode.GENERAL;
    setScanMode(newMode);
    vibrate(50); // Feedback for mode change
    const announcement = newMode === ScanMode.GENERAL ? "Switched to Scene Mode" : "Switched to Document Mode";
    playDescription(announcement);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950 overflow-hidden relative">
      <canvas ref={canvasRef} className="hidden" />

      {/* Floating Segment Control */}
      <div className="absolute top-6 left-0 right-0 z-20 flex justify-center px-6">
        <button 
          onClick={toggleMode}
          className="bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-2xl p-1.5 flex w-full max-w-sm shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
          aria-label={`Mode: ${scanMode}. Tap to toggle.`}
        >
          <div className={`flex-1 py-3 text-[11px] font-black rounded-xl transition-all duration-300 tracking-widest ${scanMode === ScanMode.GENERAL ? 'bg-yellow-400 text-black shadow-lg' : 'text-neutral-500'}`}>SCENE</div>
          <div className={`flex-1 py-3 text-[11px] font-black rounded-xl transition-all duration-300 tracking-widest ${scanMode === ScanMode.DOCUMENT ? 'bg-yellow-400 text-black shadow-lg' : 'text-neutral-500'}`}>DOCUMENT</div>
        </button>
      </div>

      <button
        onClick={handleScan}
        disabled={isProcessing}
        className={`flex-1 flex flex-col items-center justify-center transition-all duration-300 relative ${
          isProcessing ? 'bg-neutral-900' : 'bg-neutral-950 active:scale-95'
        }`}
      >
        <div className="w-[85%] aspect-[3/4] rounded-[40px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-4 border-neutral-800 bg-black relative">
          <video
            ref={videoRef}
            autoPlay playsInline muted
            onLoadedMetadata={() => setIsVideoReady(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${permissionState === 'granted' ? 'opacity-100' : 'opacity-0'}`}
          />
          
          {permissionState === 'denied' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-red-900/20 backdrop-blur-md">
              <span className="text-4xl mb-4">🚫</span>
              <p className="text-white font-bold text-lg">Camera access is blocked</p>
              <p className="text-neutral-400 text-sm mt-2">Tap here to retry permission</p>
            </div>
          )}

          {isProcessing && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-md">
              <div className="w-20 h-20 border-8 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-yellow-400 font-black uppercase tracking-[0.3em] text-xs animate-pulse">Analyzing</p>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center px-8">
          <h1 className="text-yellow-400 text-4xl font-black uppercase tracking-tighter leading-none shadow-yellow-400/20 drop-shadow-lg">
            {isProcessing ? 'Analyzing...' : scanMode === ScanMode.DOCUMENT ? 'Read Text' : 'Tap To Scan'}
          </h1>
          {errorMessage && <p className="mt-2 text-red-400 font-bold text-sm uppercase">{errorMessage}</p>}
        </div>
      </button>

      {/* Description Panel */}
      <div className="bg-neutral-900 p-8 min-h-[160px] border-t border-neutral-800 shadow-[0_-20px_40px_rgba(0,0,0,0.3)] flex flex-col justify-center">
        <h2 className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
          Assistant Response
        </h2>
        <p className="text-xl text-white font-medium leading-snug">
          {lastDescription || 'Tap the screen to analyze your surroundings...'}
        </p>
      </div>
    </div>
  );
};
