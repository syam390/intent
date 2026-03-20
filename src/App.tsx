import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2, Sparkles, MessageSquare, History, Settings, User } from 'lucide-react';
import { VoiceRecorder } from './components/VoiceRecorder';
import { ImageUpload } from './components/ImageUpload';
import { ResultDisplay } from './components/ResultDisplay';
import { analyzeIntent, IntentResult } from './services/gemini';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<IntentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (input: string | { data: string; mimeType: string } | { audio: { data: string; mimeType: string } }) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysisResult = await analyzeIntent(input);
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleAnalyze(inputText);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">IntentBridge</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button 
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="View history"
            >
              <History className="w-5 h-5" />
            </button>
            <button 
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div 
              className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-300"
              role="img"
              aria-label="User profile"
            >
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Understand <span className="text-indigo-600">Intent</span> Instantly
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Analyze text, voice, or images to uncover structured insights, risk levels, and recommended actions using advanced AI.
          </p>
        </motion.div>

        {/* Input Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-2"
        >
          <form onSubmit={handleTextSubmit} className="relative">
            <textarea
              id="intent-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your intent, record voice, or upload an image..."
              className="w-full min-h-[140px] p-6 text-lg bg-transparent border-none focus:ring-0 resize-none placeholder:text-slate-400"
              disabled={isAnalyzing}
              aria-label="Input for intent analysis"
            />
            
            <div className="flex items-center justify-between p-4 border-t border-slate-50 bg-slate-50/50 rounded-b-[22px]">
              <div className="flex items-center gap-3">
                <VoiceRecorder 
                  onAudioReady={(audio) => handleAnalyze({ audio })} 
                  disabled={isAnalyzing}
                />
                <ImageUpload 
                  onImageReady={(image) => handleAnalyze(image)} 
                  disabled={isAnalyzing}
                />
              </div>
              
              <button
                type="submit"
                disabled={isAnalyzing || !inputText.trim()}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 active:scale-95"
                aria-label={isAnalyzing ? "Analyzing input" : "Analyze intent"}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Analyze</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full max-w-2xl mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium flex items-center gap-2"
              role="alert"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State Skeleton */}
        {isAnalyzing && !result && (
          <div className="w-full max-w-2xl mt-12 space-y-6 animate-pulse">
            <div className="h-32 bg-slate-200 rounded-2xl" />
            <div className="grid grid-cols-2 gap-6">
              <div className="h-24 bg-slate-200 rounded-2xl" />
              <div className="h-24 bg-slate-200 rounded-2xl" />
            </div>
            <div className="h-40 bg-slate-200 rounded-2xl" />
          </div>
        )}

        {/* Results */}
        {result && !isAnalyzing && (
          <ResultDisplay result={result} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-slate-200 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-medium">
          <MessageSquare className="w-4 h-4" />
          <span>Powered by Gemini AI</span>
          <span className="mx-2 text-slate-300">•</span>
          <span>IntentBridge v1.0</span>
        </div>
      </footer>
    </div>
  );
}
