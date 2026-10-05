import React from 'react';
import { Roastery, Drink } from '../../types/coffee';
import { X, Clock, MapPin, Navigation, Heart, Coffee, ShieldCheck } from 'lucide-react';

interface RoasteryDetailModalProps {
  roastery: Roastery;
  drinks: Drink[];
  onClose: () => void;
  onSelectDrink: (drink: Drink) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const RoasteryDetailModal: React.FC<RoasteryDetailModalProps> = ({
  roastery,
  drinks,
  onClose,
  onSelectDrink,
  isFavorite,
  onToggleFavorite,
}) => {
  // Filter drinks belonging to or recommended by this roastery
  const roasteryDrinks = drinks.filter(
    (d) => d.roasteryId === roastery.id || d.roasteryId === 'atelier-sol'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-xs p-0 md:p-4">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#FAF7F2] rounded-t-[32px] md:rounded-[32px] max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl z-10 flex flex-col">
        {/* Top Floating Controls */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EBE3D8]">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#EFE8DF] hover:bg-[#E5DDD2] transition-colors flex items-center justify-center text-[#2C2825]"
            aria-label="Close roastery details"
          >
            <X className="w-4 h-4" />
          </button>

          <span className="font-display font-bold text-sm text-[#2C2825] truncate max-w-[200px]">
            {roastery.name}
          </span>

          <button
            onClick={() => onToggleFavorite(roastery.id)}
            className={`w-8 h-8 rounded-full transition-colors flex items-center justify-center ${
              isFavorite ? 'bg-[#FBE8E2] text-[#B8573A]' : 'bg-[#EFE8DF] text-[#7A7067] hover:text-[#2C2825]'
            }`}
            aria-label="Save to favorite roasteries"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Hero Image */}
        <div className="relative h-52 w-full bg-[#E5DDD4] shrink-0">
          <img
            src={roastery.heroImage}
            alt={roastery.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="font-display text-2xl font-bold">{roastery.name}</h2>
            <p className="text-xs text-white/90 mt-0.5">{roastery.tagline}</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-white rounded-2xl border border-[#EDE4D8] text-center">
            <div>
              <span className="text-[10px] font-semibold uppercase text-[#8D7F73] block">Wait Time</span>
              <span className="font-display text-sm font-bold text-[#2C2825]">~{roastery.currentWaitMins} mins</span>
            </div>
            <div className="border-x border-[#EDE4D8]">
              <span className="text-[10px] font-semibold uppercase text-[#8D7F73] block">Distance</span>
              <span className="font-display text-sm font-bold text-[#2C2825]">{roastery.distanceMiles} mi ({roastery.walkingMinutes}m)</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase text-[#8D7F73] block">Rating</span>
              <span className="font-display text-sm font-bold text-[#8D6B57]">★ {roastery.rating}</span>
            </div>
          </div>

          {/* Roastery Philosophy & Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7E74] mb-1.5">
              The Roastery Story
            </h3>
            <p className="text-xs text-[#52473D] leading-relaxed">
              {roastery.description}
            </p>
          </div>

          {/* Baristas on shift & Specialty */}
          <div className="bg-[#F5EFE7] rounded-2xl p-3.5 border border-[#E8DFC9] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#7A6D61] font-medium">Head Roaster & Baristas</span>
              <span className="font-semibold text-[#2C2825]">{roastery.baristas.join(' & ')}</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E8DEC9]">
              <span className="text-[#7A6D61] font-medium">Roast Style</span>
              <span className="font-semibold text-[#8D6B57]">{roastery.roastFocus}</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E8DEC9]">
              <span className="text-[#7A6D61] font-medium">Brew Station Focus</span>
              <span className="font-semibold text-[#2C2825]">{roastery.specialtyOrigin}</span>
            </div>
          </div>

          {/* Roastery Brews Menu */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base font-bold text-[#2C2825]">
                Order Ahead From This Bar
              </h3>
              <span className="text-xs text-[#8A7E74]">Pre-order & skip queue</span>
            </div>

            <div className="space-y-2.5">
              {roasteryDrinks.map((drink) => (
                <div
                  key={drink.id}
                  onClick={() => onSelectDrink(drink)}
                  className="bg-white rounded-xl p-3 border border-[#ECE4DA] hover:border-[#DACFBF] shadow-xs cursor-pointer transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#EFE9E0] shrink-0">
                    <img
                      src={drink.image}
                      alt={drink.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-xs font-bold text-[#2C2825] truncate">
                      {drink.name}
                    </h4>
                    <p className="text-[11px] text-[#7A7067] line-clamp-1">
                      {drink.description}
                    </p>
                    <span className="text-xs font-bold text-[#2C2825] font-mono tabular-nums mt-0.5 block">
                      ${drink.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#FAF5EE] group-hover:bg-[#2C2825] text-[#2C2825] group-hover:text-[#FAF7F2] transition-colors flex items-center justify-center text-sm font-semibold">
                    +
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Directions button */}
          <div className="pt-2 border-t border-[#EDE4D8] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#63574D]">
              <MapPin className="w-4 h-4 text-[#8D6B57]" />
              <span className="truncate max-w-[220px]">{roastery.address}</span>
            </div>
            <button
              onClick={() => {
                alert(`Navigating to ${roastery.name} (${roastery.address}). Follow map path ~${roastery.walkingMinutes} min.`);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#EFE8DF] hover:bg-[#E5DDD2] text-[#2C2825] text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Navigation className="w-3 h-3" />
              <span>Directions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
