
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Palette, Menu, Sparkles, Filter } from 'lucide-react';
import { ColorInfo, ToastMessage, ToastType } from './types';
import { WEB_COLORS, STORAGE_KEY } from './constants';
import { isValidHex, copyToClipboardFallback } from './utils';
import { ColorCard } from './components/ColorCard';
import { Sidebar } from './components/Sidebar';
import { AIModal } from './components/AIModal';
import { Toast } from './components/Toast';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<ColorInfo[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse favorites');
      }
    }
  }, []);

  // Sync favorites to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addToast = useCallback((message: string, type: ToastType = ToastType.INFO) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleCopy = useCallback((text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => addToast(`已複製: ${text}`, ToastType.SUCCESS))
        .catch(() => {
          if (copyToClipboardFallback(text)) addToast(`已複製: ${text}`, ToastType.SUCCESS);
        });
    } else {
      if (copyToClipboardFallback(text)) addToast(`已複製: ${text}`, ToastType.SUCCESS);
    }
  }, [addToast]);

  const toggleFavorite = useCallback((color: ColorInfo) => {
    setFavorites(prev => {
      const isFav = prev.some(f => f.hex.toLowerCase() === color.hex.toLowerCase());
      if (isFav) {
        addToast(`已從收藏移除: ${color.name}`, ToastType.INFO);
        return prev.filter(f => f.hex.toLowerCase() !== color.hex.toLowerCase());
      } else {
        addToast(`已加入收藏: ${color.name}`, ToastType.SUCCESS);
        return [...prev, color];
      }
    });
  }, [addToast]);

  const filteredColors = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase().trim();
    
    // Check if it's a valid hex input
    let results = WEB_COLORS.filter(c => 
      c.name.toLowerCase().includes(lowerSearch) || 
      c.hex.toLowerCase().includes(lowerSearch)
    );

    // If it's a valid hex not in standard list, show a custom card
    if (lowerSearch.startsWith('#') && isValidHex(lowerSearch)) {
      const exists = results.some(r => r.hex.toLowerCase() === lowerSearch);
      if (!exists) {
        results = [{ name: '自定義 Hex', hex: lowerSearch.toUpperCase() }, ...results];
      }
    } else if (lowerSearch.length === 6 && isValidHex('#' + lowerSearch)) {
        const hex = '#' + lowerSearch;
        const exists = results.some(r => r.hex.toLowerCase() === hex.toLowerCase());
        if (!exists) {
            results = [{ name: '自定義 Hex', hex: hex.toUpperCase() }, ...results];
        }
    }

    return results;
  }, [searchTerm]);

  const isFav = (hex: string) => favorites.some(f => f.hex.toLowerCase() === hex.toLowerCase());

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <div className="flex-grow flex flex-col h-full min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 shrink-0 shadow-sm z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Palette className="w-6 h-6" />
              </div>
              <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight hidden sm:block">
                色彩編碼<span className="text-indigo-600">搜尋神器</span>
                <span className="ml-1 text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded uppercase align-top">AI 版</span>
              </h1>
            </div>

            <div className="flex-grow max-w-xl relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜尋顏色名稱或 Hex (如 #FF5733)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm md:text-base bg-slate-50 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsAIModalOpen(true)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="hidden md:inline">AI 靈感</span>
              </button>
              <button 
                className="lg:hidden p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 relative"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full animate-pulse">
                    {favorites.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-grow overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {searchTerm === '' && (
              <div className="mb-8 p-6 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <h2 className="text-2xl font-bold">歡迎來到色彩實驗室</h2>
                  <p className="text-indigo-100 max-w-lg">
                    點擊色塊即可複製 Hex Code，或輸入任何您想尋找的色彩代碼或名稱。利用 AI 生成功能快速獲取專業的視覺配色靈感。
                  </p>
                </div>
                <div className="absolute right-[-20px] top-[-20px] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute left-[-40px] bottom-[-40px] w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl"></div>
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {searchTerm ? `搜尋結果 (${filteredColors.length})` : '熱門顏色推薦'}
              </h2>
            </div>

            {filteredColors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                {filteredColors.map((color) => (
                  <ColorCard 
                    key={color.hex} 
                    color={color} 
                    isFavorite={isFav(color.hex)}
                    onToggleFavorite={toggleFavorite}
                    onCopy={handleCopy}
                  />
                ))}
              </div>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-slate-400 space-y-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 opacity-20" />
                </div>
                <div className="text-center">
                  <p className="font-bold">查無搜尋結果</p>
                  <p className="text-sm">試試看輸入其他名稱，或是輸入正確的 #Hex 代碼</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <Sidebar 
        favorites={favorites} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onRemove={(hex) => toggleFavorite(favorites.find(f => f.hex === hex)!)}
        onCopy={handleCopy}
      />

      <AIModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)}
        onAddColor={toggleFavorite}
        favorites={favorites}
      />

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default App;
