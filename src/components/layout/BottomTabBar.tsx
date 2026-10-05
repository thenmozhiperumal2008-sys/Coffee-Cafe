import React from 'react';
import { Compass, Store, Coffee, ShoppingBag, Clock } from 'lucide-react';
import { Order } from '../../types/coffee';

export type TabType = 'explore' | 'roasteries' | 'orders' | 'bag';

interface BottomTabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  cartCount: number;
  activeOrder?: Order | null;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabChange,
  cartCount,
  activeOrder,
}) => {
  const isOrderInProgress = activeOrder && activeOrder.status !== 'collected';

  return (
    <nav 
      aria-label="Primary Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8E2D9] px-4 py-2"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-14">
        {/* Explore Tab */}
        <button
          onClick={() => onTabChange('explore')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeTab === 'explore' ? 'text-[#3E2F28] font-semibold' : 'text-[#8A8178] hover:text-[#5C5248]'
          }`}
          aria-label="Discover brews and roasteries"
        >
          <Compass className={`w-5 h-5 transition-transform ${activeTab === 'explore' ? 'scale-110 stroke-[2.2]' : 'stroke-[1.7]'}`} />
          <span className="text-[11px] tracking-tight mt-1">Discover</span>
        </button>

        {/* Roasteries Tab */}
        <button
          onClick={() => onTabChange('roasteries')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeTab === 'roasteries' ? 'text-[#3E2F28] font-semibold' : 'text-[#8A8178] hover:text-[#5C5248]'
          }`}
          aria-label="Browse local roasteries"
        >
          <Store className={`w-5 h-5 transition-transform ${activeTab === 'roasteries' ? 'scale-110 stroke-[2.2]' : 'stroke-[1.7]'}`} />
          <span className="text-[11px] tracking-tight mt-1">Roasteries</span>
        </button>

        {/* Live Orders Tab */}
        <button
          onClick={() => onTabChange('orders')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeTab === 'orders' ? 'text-[#3E2F28] font-semibold' : 'text-[#8A8178] hover:text-[#5C5248]'
          }`}
          aria-label="Track live pre-orders"
        >
          <div className="relative">
            <Clock className={`w-5 h-5 transition-transform ${activeTab === 'orders' ? 'scale-110 stroke-[2.2]' : 'stroke-[1.7]'}`} />
            {isOrderInProgress && (
              <span className="absolute -top-1 -right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E08A68] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C96B48]"></span>
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-tight mt-1 flex items-center gap-1">
            Tracking
            {isOrderInProgress && <span className="w-1.5 h-1.5 rounded-full bg-[#C96B48]" />}
          </span>
        </button>

        {/* Bag Tab */}
        <button
          onClick={() => onTabChange('bag')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeTab === 'bag' ? 'text-[#3E2F28] font-semibold' : 'text-[#8A8178] hover:text-[#5C5248]'
          }`}
          aria-label={`View order bag with ${cartCount} items`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 transition-transform ${activeTab === 'bag' ? 'scale-110 stroke-[2.2]' : 'stroke-[1.7]'}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#2C2825] text-[#FAF7F2] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-tight mt-1">Bag</span>
        </button>
      </div>
    </nav>
  );
};
