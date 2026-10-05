import React from 'react';
import { Roastery, Drink, DrinkCategory } from '../../types/coffee';
import { Sparkles, Clock, ArrowRight, Heart, Coffee } from 'lucide-react';

interface ExploreViewProps {
  roasteries: Roastery[];
  drinks: Drink[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectRoastery: (roastery: Roastery) => void;
  onSelectDrink: (drink: Drink) => void;
  onViewAllRoasteries: () => void;
  searchQuery: string;
}

const CATEGORIES: { id: string; label: string; icon: string }[] = [
  { id: 'All', label: 'All Brews', icon: '☕' },
  { id: 'Espresso & Milk', label: 'Espresso & Milk', icon: '🥛' },
  { id: 'Pour-Over', label: 'Pour-Over', icon: '💧' },
  { id: 'Cold & Tonic', label: 'Cold & Tonic', icon: '🧊' },
  { id: 'Botanical & Tea', label: 'Matcha & Tea', icon: '🍵' },
  { id: 'Pastries', label: 'Pastries', icon: '🥐' },
];

export const ExploreView: React.FC<ExploreViewProps> = ({
  roasteries,
  drinks,
  selectedCategory,
  onSelectCategory,
  onSelectRoastery,
  onSelectDrink,
  onViewAllRoasteries,
  searchQuery,
}) => {
  // Filter drinks based on category and search query
  const filteredDrinks = drinks.filter((drink) => {
    const matchesCategory = selectedCategory === 'All' || drink.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      drink.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drink.tastingNotes.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      drink.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredRoastery = roasteries[0];

  return (
    <div className="space-y-6 pt-3 px-4">
      {/* Editorial Morning Greeting Card */}
      {!searchQuery && (
        <section aria-label="Curated daily coffee insight" className="relative overflow-hidden rounded-2xl bg-[#EBE3D8] p-5 text-[#2C2825] shadow-xs">
          <div className="relative z-10 max-w-[280px]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A695C] block mb-1">
              Morning Fresh Crop
            </span>
            <h2 className="font-display text-xl font-bold leading-tight tracking-tight text-[#2B231E]">
              Fresh Pink Bourbon roasted 48h ago.
            </h2>
            <p className="text-xs text-[#5D5146] mt-1.5 leading-relaxed">
              Atelier Sol dialed in a limited anaerobic lot with notes of white peach and floral bergamot.
            </p>
            <button
              onClick={() => onSelectRoastery(featuredRoastery)}
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-[#2C2825] text-[#FAF7F2] hover:bg-[#3D3733] transition-colors"
            >
              <span>Explore Atelier Sol</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {/* Subtle decorative background glow */}
          <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-[#E0D3C4] opacity-50 blur-2xl pointer-events-none" />
          <div className="absolute top-3 right-4 opacity-25">
            <Sparkles className="w-12 h-12 text-[#9A7D69]" />
          </div>
        </section>
      )}

      {/* Category Segmented Controls (Buttons, not static pills) */}
      <section aria-label="Filter by beverage category">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#8A7E74]">
            Categories
          </h2>
          <span className="text-[11px] text-[#A69B91]">
            {filteredDrinks.length} crafted options
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#2C2825] text-[#FAF7F2] shadow-xs'
                    : 'bg-[#F1ECE4] text-[#63574D] hover:bg-[#E8E1D7] hover:text-[#2C2825]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Nearby Roasteries Section */}
      <section aria-label="Local Roasteries">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-display text-base font-bold tracking-tight text-[#2C2825]">
              Local Artisan Roasteries
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-[#8A7E74]">
              <span>Within 1.5 miles</span>
              <span aria-hidden="true">·</span>
              <span>Fastest pickup 6 min</span>
            </div>
          </div>
          <button
            onClick={onViewAllRoasteries}
            className="text-xs font-semibold text-[#8D6B57] hover:text-[#6F513F] transition-colors flex items-center gap-0.5"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Roasteries Carousel */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {roasteries.map((roastery) => (
            <article
              key={roastery.id}
              onClick={() => onSelectRoastery(roastery)}
              className="min-w-[240px] max-w-[240px] bg-white rounded-2xl overflow-hidden border border-[#EBE3D8] shadow-xs cursor-pointer hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              <div className="relative h-28 w-full bg-[#EBE4DC] overflow-hidden">
                <img
                  src={roastery.heroImage}
                  alt={roastery.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute top-2.5 right-2.5 bg-[#FAF7F2]/90 backdrop-blur-xs px-2 py-0.5 rounded-lg text-[10px] font-semibold text-[#2C2825] flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-[#8D6B57]" />
                  <span>{roastery.currentWaitMins} min wait</span>
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-sm font-bold text-[#2C2825] truncate">
                    {roastery.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-[#8D6B57]">
                    ★ {roastery.rating}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-[#7A7067] mt-1">
                  <span>{roastery.neighborhood}</span>
                  <span aria-hidden="true">·</span>
                  <span>{roastery.distanceMiles} mi</span>
                  <span aria-hidden="true">·</span>
                  <span>{roastery.walkingMinutes} min walk</span>
                </div>

                <div className="mt-2 pt-2 border-t border-[#F2ECE3] flex items-center justify-between text-[11px]">
                  <span className="text-[#8A7E74] truncate max-w-[140px]">
                    {roastery.vibe}
                  </span>
                  <span className="text-xs font-semibold text-[#2C2825] group-hover:translate-x-0.5 transition-transform">
                    Order →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Crafted Drinks Grid / List */}
      <section aria-label="Available Drinks Menu">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-display text-base font-bold tracking-tight text-[#2C2825]">
              {selectedCategory === 'All' ? 'Curated Brews & Sips' : selectedCategory}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-[#8A7E74]">
              <span>Custom milk & single-origin options</span>
            </div>
          </div>
        </div>

        {filteredDrinks.length === 0 ? (
          <div className="text-center py-10 bg-[#F4EFEA] rounded-2xl p-6">
            <Coffee className="w-8 h-8 mx-auto text-[#A89D93] mb-2 stroke-[1.5]" />
            <p className="text-sm font-semibold text-[#2C2825]">No drinks found</p>
            <p className="text-xs text-[#7A7067] mt-1">Try another search keyword or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredDrinks.map((drink) => (
              <div
                key={drink.id}
                onClick={() => onSelectDrink(drink)}
                className="bg-white rounded-2xl p-3 border border-[#ECE4DA] hover:border-[#DACFBF] shadow-xs cursor-pointer transition-all flex items-center justify-between gap-3 group"
              >
                {/* Left image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#EFE9E0] shrink-0 relative">
                  <img
                    src={drink.image}
                    alt={drink.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {drink.isSeasonal && (
                    <div className="absolute bottom-1 left-1 bg-[#F9DDD3] text-[#6E4233] text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Seasonal
                    </div>
                  )}
                </div>

                {/* Center details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-1">
                    <h3 className="font-display text-sm font-bold text-[#2C2825] truncate">
                      {drink.name}
                    </h3>
                    <span className="text-xs font-bold text-[#2C2825] font-mono tabular-nums">
                      ${drink.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#7A7067] line-clamp-2 mt-0.5 leading-snug">
                    {drink.description}
                  </p>

                  {/* Tasting notes as clean text with typographic bullet separator */}
                  <div className="flex items-center gap-1.5 text-[10px] text-[#9A8D80] mt-1.5 truncate">
                    {drink.tastingNotes.map((note, index) => (
                      <React.Fragment key={note}>
                        <span>{note}</span>
                        {index < drink.tastingNotes.length - 1 && <span aria-hidden="true">·</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Right button */}
                <div className="shrink-0 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#FAF5EE] group-hover:bg-[#2C2825] text-[#2C2825] group-hover:text-[#FAF7F2] transition-colors flex items-center justify-center">
                    <span className="text-base leading-none font-medium">+</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sustainable Craft Roasting Promise */}
      <section aria-label="Craft Roasting Ethos" className="rounded-2xl border border-[#E5DCD0] bg-[#FAF6F0] p-4 text-[#4A4139]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#EADFD2] flex items-center justify-center shrink-0 text-[#825F4D]">
            ☕
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C2825]">
              Direct-Trade & Fresh Daily Roasting
            </h4>
            <p className="text-[11px] text-[#6E6358] mt-1 leading-relaxed">
              Every coffee shop on Velvet Drip sources sustainably from independent producers, roasted locally in small batches and pre-ordered for zero counter lines.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
