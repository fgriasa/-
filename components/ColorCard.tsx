
import React from 'react';
import { Copy, Heart } from 'lucide-react';
import { ColorInfo } from '../types';
import { getBrightness, hexToRgb, hexToHsl } from '../utils';

interface ColorCardProps {
  color: ColorInfo;
  isFavorite: boolean;
  onToggleFavorite: (color: ColorInfo) => void;
  onCopy: (text: string) => void;
}

export const ColorCard: React.FC<ColorCardProps> = ({ color, isFavorite, onToggleFavorite, onCopy }) => {
  const brightness = getBrightness(color.hex);
  const isDark = brightness < 128;
  const textColor = isDark ? 'text-white' : 'text-slate-800';

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all">
      <div 
        className="h-32 w-full flex items-end justify-end p-2 cursor-pointer relative"
        style={{ backgroundColor: color.hex }}
        onClick={() => onCopy(color.hex)}
      >
        <button 
          className={`p-2 rounded-full transition-colors ${isFavorite ? 'bg-white text-red-500' : 'bg-white/20 text-white hover:bg-white hover:text-red-500'}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(color);
          }}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        <div className={`absolute bottom-2 left-3 ${textColor} font-mono font-medium drop-shadow-sm pointer-events-none`}>
          {color.hex.toUpperCase()}
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 truncate" title={color.name}>{color.name}</h3>
          <button 
            onClick={() => onCopy(color.hex)}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-1">
          <div 
            className="flex justify-between items-center text-xs group/item cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors"
            onClick={() => onCopy(hexToRgb(color.hex))}
          >
            <span className="text-slate-400 font-medium">RGB</span>
            <span className="text-slate-600 font-mono">{hexToRgb(color.hex)}</span>
          </div>
          <div 
            className="flex justify-between items-center text-xs group/item cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors"
            onClick={() => onCopy(hexToHsl(color.hex))}
          >
            <span className="text-slate-400 font-medium">HSL</span>
            <span className="text-slate-600 font-mono">{hexToHsl(color.hex)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
