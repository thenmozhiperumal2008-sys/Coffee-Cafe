import React, { useState } from 'react';
import { Roastery } from '../../types/coffee';
import { Clock, MapPin, Sparkles, Coffee, Navigation } from 'lucide-react';

interface RoasteriesViewProps {
  roasteries: Roastery[];
  onSelectRoastery: (roastery: Roastery) => void;
  searchQuery: string;
}

const ROAST_FILTERS = ['All Roasts', 'Light Scandinavian', 'Anaerobic', 'Honey Process', 'Decaf Friendly'];

export const RoasteriesView: React.FC<RoasteriesViewProps> = ({
  roasteries,
  onSelectRoastery,
  searchQuery,
}) => {
  const [activeRoastFilter, setActiveRoastFilter] = useState('All Roasts');

  const filteredRoasteries = roasteries.filter((r) => {
    const matchesSearch =
      searchQuery === '' ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.roastFocus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.specialtyOrigin.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeRoastFilter === 'All Roasts' ||
      (activeRoastFilter === 'Light Scandinavian' && r.roastFocus.includes('Scandinavian')) ||
      (activeRoastFilter === 'Anaerobic' && r.roastFocus.includes('Anaerobic')) ||
      (activeRoastFilter === 'Honey Process' && r.roastFocus.includes('Honey')) ||
      (activeRoastFilter === 'Decaf Friendly' && r.features.some(f => f.toLowerCase().includes('decaf') || r.roastFocus.toLowerCase().includes('swiss')));

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4 pt-3 px-4">
      {/* View Header */}
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight text-[#2C2825]">
          Artisan Roasteries
        </h2>
        <p className="text-xs text-[#7A7067] mt-0.5">
          Order ahead from micro-roasters in your neighborhood. Zero queue waiting.
        </p>
      </div>

      {/* Filter Tabs (Interactive buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {ROAST_FILTERS.map((filter) => {
          const isActive = activeRoastFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveRoastFilter(filter)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                isActive
                  ? 'bg-[#2C2825] text-[#FAF7F2] shadow-xs'
                  : 'bg-[#F1ECE4] text-[#63574D] hover:bg-[#E8E1D7] hover:text-[#2C2825]'
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Roastery Cards */}
      <div className="space-y-4">
        {filteredRoasteries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#ECE4DA] p-6">
            <Coffee className="w-8 h-8 mx-auto text-[#A89D93] mb-2 stroke-[1.5]" />
            <p className="text-sm font-semibold text-[#2C2825]">No roasteries matched</p>
            <p className="text-xs text-[#7A7067] mt-1">Try resetting filters to explore all nearby coffee bars.</p>
          </div>
        ) : (
          filteredRoasteries.map((roastery) => (
            <article
              key={roastery.id}
              onClick={() => onSelectRoastery(roastery)}
              className="bg-white rounded-2xl overflow-hidden border border-[#ECE4DA] shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              {/* Image banner */}
              <div className="relative h-44 w-full bg-[#E5DDD4] overflow-hidden">
                <img
                  src={roastery.heroImage}
                  alt={roastery.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Top overlay badges */}
                <div className="absolute top-3 left-3 bg-[#FAF7F2]/90 backdrop-blur-xs px-2.5 py-1 rounded-xl text-[11px] font-medium text-[#2C2825] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5D8B61]" />
                  <span>Open · {roastery.openingHours}</span>
                </div>

                <div className="absolute top-3 right-3 bg-[#FAF7F2]/90 backdrop-blur-xs px-2.5 py-1 rounded-xl text-[11px] font-semibold text-[#2C2825] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#8D6B57]" />
                  <span>~{roastery.currentWaitMins} min pickup</span>
                </div>

                {/* Bottom title on image */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold leading-tight drop-shadow-xs">
                      {roastery.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md text-xs font-semibold">
                      <span>★ {roastery.rating}</span>
                      <span className="text-[10px] text-white/70">({roastery.reviewCount})</span>
                    </div>
                  </div>
                  <p className="text-xs text-white/85 line-clamp-1 mt-0.5">
                    {roastery.tagline}
                  </p>
                </div>
              </div>

              {/* Roastery details */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#7A7067]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8D6B57]" />
                    <span className="truncate max-w-[200px]">{roastery.address}</span>
                  </div>
                  <div className="font-medium text-[#2C2825] shrink-0">
                    {roastery.distanceMiles} mi · {roastery.walkingMinutes} min
                  </div>
                </div>

                {/* Specialty Origin & Process */}
                <div className="bg-[#FAF6F0] rounded-xl p-2.5 border border-[#EDE4D8] flex items-center justify-between">
                  <div className="text-[11px]">
                    <span className="text-[#8D7F73] block uppercase text-[9px] font-bold tracking-wider">
                      Featured Micro-lot
                    </span>
                    <span className="font-semibold text-[#2C2825]">
                      {roastery.specialtyOrigin}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8D6B57] font-semibold flex items-center gap-0.5">
                    View Bar Menu →
                  </span>
                </div>

                {/* Feature tags as unboxed text with bullets */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#8C8074]">
                  {roastery.features.map((feature, idx) => (
                    <React.Fragment key={feature}>
                      <span>{feature}</span>
                      {idx < roastery.features.length - 1 && <span aria-hidden="true">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
