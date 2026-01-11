
import React from 'react';
import { TileData } from '../types';

interface TileCardProps {
  tile: TileData;
  selected: boolean;
  onSelect: (tile: TileData) => void;
}

const TileCard: React.FC<TileCardProps> = ({ tile, selected, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(tile)}
      className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border bg-[#0f172a] ${
        selected ? 'border-[#701a1a] ring-2 ring-[#701a1a]/50 scale-[1.02] shadow-2xl' : 'border-white/5 hover:border-[#701a1a]/50 hover:-translate-y-1'
      }`}
    >
      <div className="aspect-square w-full relative overflow-hidden bg-black/20">
        <img 
          src={tile.tile_image_url} 
          alt={tile.name} 
          className={`w-full h-full object-cover transition-transform duration-700 ${selected ? 'scale-110' : 'group-hover:scale-110'}`}
        />
        
        {selected && (
          <div className="absolute top-2 right-2 bg-[#701a1a] text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg z-20 animate-in zoom-in duration-300">
            <i className="fas fa-check text-[10px]"></i>
          </div>
        )}
      </div>

      <div className="p-2 space-y-1">
        <h3 className="text-[9px] font-black uppercase truncate text-white leading-tight">{tile.name}</h3>
        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between items-center text-[7px] font-bold text-slate-500 uppercase">
            <span>Kích thước:</span>
            <span className="text-slate-300">{tile.tile_size}</span>
          </div>
          <div className="flex justify-between items-center text-[7px] font-bold text-slate-500 uppercase">
            <span>Bề mặt:</span>
            <span className="text-slate-300">{tile.tile_surface}</span>
          </div>
          <div className="mt-1 pt-1 border-t border-white/5 flex justify-between items-center">
            <span className="text-[6px] text-[#701a1a] font-black italic">{tile.tile_id}</span>
            <span className="text-[6px] text-slate-600 font-bold uppercase">{tile.brand}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TileCard;
