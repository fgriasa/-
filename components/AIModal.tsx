
import React, { useState } from 'react';
import { X, Sparkles, Loader2, Plus, Heart } from 'lucide-react';
import { generatePalette } from '../geminiService';
import { ColorInfo } from '../types';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddColor: (color: ColorInfo) => void;
  favorites: ColorInfo[];
}

export const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, onAddColor, favorites }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ColorInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const palette = await generatePalette(prompt);
      setResults(palette);
    } catch (err) {
      setError('生成失敗，請確認網路連線或稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (hex: string) => favorites.some(f => f.hex.toLowerCase() === hex.toLowerCase());

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-bold text-slate-800">AI 靈感調色盤</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">想生成什麼樣的主題？</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="例如：深夜的東京街頭、北歐森林的早晨..."
                className="flex-grow px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                disabled={loading}
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shrink-0"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                生成
              </button>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}

          {results.length > 0 && (
            <div className="space-y-4 animate-slide-up">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">生成結果</h3>
              <div className="grid grid-cols-1 gap-3">
                {results.map((color, idx) => (
                  <div key={`${color.hex}-${idx}`} className="flex items-center gap-4 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <div 
                      className="w-12 h-12 rounded-lg border border-slate-200 shadow-sm shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-slate-800 truncate">{color.name}</p>
                      <p className="text-xs font-mono text-slate-500 uppercase">{color.hex}</p>
                    </div>
                    <button
                      onClick={() => onAddColor(color)}
                      disabled={isFavorite(color.hex)}
                      className={`p-2 rounded-lg flex items-center gap-1 text-sm font-bold transition-all ${
                        isFavorite(color.hex) 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-slate-600 bg-slate-100 hover:bg-indigo-600 hover:text-white'
                      }`}
                    >
                      {isFavorite(color.hex) ? <Heart className="w-4 h-4 fill-current" /> : <Plus className="w-4 h-4" />}
                      {isFavorite(color.hex) ? '已收藏' : '收藏'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && results.length === 0 && !error && (
            <div className="py-12 text-center space-y-2">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-slate-200" />
              </div>
              <p className="text-slate-500">輸入關鍵字，讓 AI 為您的設計注入靈感</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
