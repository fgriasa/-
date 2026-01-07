
import React from 'react';
import { ColorInfo } from '../types';
import { Trash2, Copy, X } from 'lucide-react';

interface SidebarProps {
  favorites: ColorInfo[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (hex: string) => void;
  onCopy: (text: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ favorites, isOpen, onClose, onRemove, onCopy }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={`fixed top-0 right-0 h-full w-80 bg-white border-l border-slate-200 z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 lg:static shadow-xl lg:shadow-none flex flex-col`}>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-800">我的收藏 ({favorites.length})</h2>
          </div>
          <button className="lg:hidden p-2 hover:bg-slate-100 rounded" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-4 space-y-3">
          {favorites.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 py-20">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                <Trash2 className="w-8 h-8 opacity-20" />
              </div>
              <p className="text-sm">尚未加入任何收藏</p>
            </div>
          ) : (
            favorites.map((color) => (
              <div key={color.hex} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg group hover:bg-slate-100 transition-colors">
                <div 
                  className="w-10 h-10 rounded-md border border-slate-200 flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate" title={color.name}>{color.name}</p>
                  <p className="text-xs font-mono text-slate-500 uppercase">{color.hex}</p>
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onCopy(color.hex)}
                    className="p-1.5 hover:bg-white rounded text-slate-400 hover:text-slate-600"
                    title="複製 Hex"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onRemove(color.hex)}
                    className="p-1.5 hover:bg-white rounded text-slate-400 hover:text-red-500"
                    title="移除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <p className="text-[10px] text-slate-400 text-center">
            收藏資料儲存於瀏覽器 localStorage
          </p>
        </div>
      </div>
    </>
  );
};
