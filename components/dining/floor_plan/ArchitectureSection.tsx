import React from 'react';
import { FloorItemType } from '../../../types';

interface ArchitectureSectionProps {
  businessType: string;
  onDragStart: (e: React.DragEvent, type: FloorItemType) => void;
}

export const ArchitectureSection: React.FC<ArchitectureSectionProps> = ({ businessType, onDragStart }) => {
  const isDining = ['Restaurant', 'Fine Dining', 'Fast Food', 'Buffet', 'Coffee Shop', 'Café', 'Bakery', 'Bar', 'Pub', 'Lounge', 'Brewery', 'Winery', 'Ice Cream Shop', 'Dessert Shop', 'Bubble Tea Shop'].includes(businessType);
  const isRetail = ['Retail Store', 'Supermarket', 'Grocery', 'Pharmacy', 'Jewelry Store', 'Electronics Store', 'Fashion Boutique'].includes(businessType);
  const isService = ['Salon', 'Spa', 'Barbershop', 'Clinic', 'Dental Office', 'Pet Grooming', 'Coworking Space', 'Hotel Front Desk', 'Airport Lounge'].includes(businessType);
  const isEntertainment = ['Nightclub', 'Karaoke Bar', 'Hookah Lounge', 'Gaming Lounge', 'Casino', 'Event Hall', 'Cinema'].includes(businessType);

  return (
    <>
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Architecture</h4>
        <div className="grid grid-cols-2 gap-3">
          <div 
            draggable
            onDragStart={(e) => onDragStart(e, 'DECOR_WALL')}
            className="bg-slate-50 border border-slate-200 rounded-lg p-3 cursor-grab hover:border-indigo-400 flex flex-col items-center gap-2"
          >
            <div className="w-12 h-2 bg-slate-800 rounded-full" />
            <span className="text-[10px] font-bold text-slate-600 text-center">Wall</span>
          </div>
          {(isDining || isEntertainment) && (
            <div 
              draggable
              onDragStart={(e) => onDragStart(e, 'FURNITURE_BAR')}
              className="bg-slate-50 border border-slate-200 rounded-lg p-3 cursor-grab hover:border-indigo-400 flex flex-col items-center gap-2"
            >
              <div className="w-12 h-6 bg-slate-300 rounded-sm" />
              <span className="text-[10px] font-bold text-slate-600 text-center">Bar</span>
            </div>
          )}
          {(isRetail || isService) && (
            <div 
              draggable
              onDragStart={(e) => onDragStart(e, 'FURNITURE_SHELF')}
              className="bg-slate-50 border border-slate-200 rounded-lg p-3 cursor-grab hover:border-indigo-400 flex flex-col items-center gap-2"
            >
              <div className="w-12 h-4 bg-amber-200 rounded-sm" />
              <span className="text-[10px] font-bold text-slate-600 text-center">Shelf</span>
            </div>
          )}
          <div 
            draggable
            onDragStart={(e) => onDragStart(e, 'FURNITURE_COUNTER')}
            className="bg-slate-50 border border-slate-200 rounded-lg p-3 cursor-grab hover:border-indigo-400 flex flex-col items-center gap-2"
          >
            <div className="w-12 h-6 bg-slate-200 rounded-sm" />
            <span className="text-[10px] font-bold text-slate-600 text-center">Counter</span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Decoration</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { type: 'PLANT_MONSTERA', label: 'Plant' },
            { type: 'DECOR_PIANO', label: 'Piano' },
            { type: 'DECOR_RUG_RECT', label: 'Rug' },
          ].map(item => (
            <div 
              key={item.type}
              draggable
              onDragStart={(e) => onDragStart(e, item.type as FloorItemType)}
              className="bg-slate-50 border border-slate-200 rounded-lg p-3 cursor-grab hover:border-emerald-400 flex flex-col items-center gap-2"
            >
              <div className={`w-8 h-8 ${item.type.includes('PLANT') ? 'bg-emerald-100 border-emerald-400' : 'bg-slate-100 border-slate-400'} border-2 rounded-full`} />
              <span className="text-[10px] font-bold text-slate-600 text-center">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
