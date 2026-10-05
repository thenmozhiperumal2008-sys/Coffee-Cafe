import React, { useState } from 'react';
import { MapPin, Search, Sparkles, Smartphone, Monitor } from 'lucide-react';

interface MobileShellProps {
  children: React.ReactNode;
  selectedLocation: string;
  onLocationClick: () => void;
  onSearchClick: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const MobileShell: React.FC<MobileShellProps> = ({
  children,
  selectedLocation,
  onLocationClick,
  onSearchClick,
  searchQuery,
  onSearchChange,
}) => {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'fluid'>('mobile');

  return (
    <div className="min-h-screen bg-[#F4EFEA] text-[#2C2825] flex flex-col items-center justify-start py-0 md:py-6 px-0 md:px-4">
      {/* Top Device Switcher for Desktop Users */}
      <aside aria-label="Device view options" className="hidden md:flex items-center justify-between w-full max-w-md mb-3 px-3 text-xs text-[#7A7067]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#96A78E]" />
          <span className="font-medium tracking-tight">Velvet Drip Studio</span>
          <span className="text-[#B5ADA4]">·</span>
          <span>Artisan Pre-Order</span>
        </div>
        <div className="flex items-center gap-1 bg-[#EBE4DC] p-1 rounded-lg">
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              deviceMode === 'mobile' ? 'bg-[#FAF7F2] text-[#2C2825] shadow-xs font-medium' : 'text-[#7A7067] hover:text-[#2C2825]'
            }`}
            title="Mobile device frame"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
          <button
            onClick={() => setDeviceMode('fluid')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              deviceMode === 'fluid' ? 'bg-[#FAF7F2] text-[#2C2825] shadow-xs font-medium' : 'text-[#7A7067] hover:text-[#2C2825]'
            }`}
            title="Fluid layout"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full</span>
          </button>
        </div>
      </aside>

      {/* Main Container Phone Shell or Fluid Container */}
      <div
        className={`w-full bg-[#FAF7F2] min-h-screen md:min-h-[860px] md:h-[860px] overflow-hidden flex flex-col relative transition-all duration-300 ${
          deviceMode === 'mobile'
            ? 'max-w-[425px] md:rounded-[40px] md:shadow-[0_25px_60px_-15px_rgba(50,40,30,0.18)] md:border-[8px] md:border-[#E5DDD4]'
            : 'max-w-2xl md:rounded-3xl md:shadow-xl md:border border-[#E5DDD4]'
        }`}
      >
        {/* Subtle Phone Notch / Speaker Bar on desktop */}
        <div className="hidden md:flex justify-center pt-2 pb-1 bg-[#FAF7F2]">
          <div className="w-28 h-4 bg-[#EBE4DC] rounded-full flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D1C6BB]" />
            <span className="w-8 h-1 rounded-full bg-[#D1C6BB]" />
          </div>
        </div>

        {/* Mobile Header Bar */}
        <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md px-5 pt-3 pb-3 border-b border-[#EFEAE2]">
          <div className="flex items-center justify-between">
            {/* Location selector */}
            <button
              onClick={onLocationClick}
              className="flex items-center gap-1.5 text-left group"
              aria-label="Change current pickup location"
            >
              <div className="w-7 h-7 rounded-full bg-[#F2EAE1] flex items-center justify-center text-[#8D6B57] group-hover:bg-[#EBDDCF] transition-colors">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[10px] tracking-wide text-[#8C8278] uppercase block font-medium">Pickup Spot</span>
                <span className="text-xs font-semibold text-[#2C2825] flex items-center gap-1">
                  {selectedLocation}
                  <span className="text-[10px] text-[#A69C92]">▾</span>
                </span>
              </div>
            </button>

            {/* Brand Title */}
            <div className="text-center">
              <span className="font-display font-semibold tracking-tight text-sm text-[#2C2825]">
                VELVET DRIP
              </span>
            </div>

            {/* Roaster Vibe Tag / Curated Status */}
            <div className="flex items-center">
              <button
                onClick={onSearchClick}
                className="w-8 h-8 rounded-full bg-[#F3EDE5] hover:bg-[#E8DFD4] transition-colors flex items-center justify-center text-[#554C43]"
                aria-label="Search roasteries and brews"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Search Bar (Collapsible or always subtle) */}
          <div className="mt-2.5">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-3 text-[#9E948A] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search roastery, single origin, cortado, matcha..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#F2EDE6] text-xs text-[#2C2825] placeholder-[#9E948A] rounded-xl border border-transparent focus:border-[#D5C7B8] focus:bg-[#FAF7F2] outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 text-[11px] text-[#8C8278] hover:text-[#2C2825]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Viewport Body */}
        <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};
