/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MobileShell } from './components/layout/MobileShell';
import { BottomTabBar, TabType } from './components/layout/BottomTabBar';
import { ExploreView } from './components/explore/ExploreView';
import { RoasteriesView } from './components/roasteries/RoasteriesView';
import { RoasteryDetailModal } from './components/roasteries/RoasteryDetailModal';
import { DrinkDetailModal } from './components/menu/DrinkDetailModal';
import { CartDrawer } from './components/checkout/CartDrawer';
import { OrderTrackingView } from './components/orders/OrderTrackingView';
import {
  LOCAL_ROASTERIES,
  MENU_DRINKS,
  INITIAL_ACTIVE_ORDER,
} from './data/mockCoffeeData';
import { Roastery, Drink, CartItem, Order, OrderStatus, OrderStatusUpdate } from './types/coffee';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('explore');
  const [selectedLocation, setSelectedLocation] = useState('Arts District, LA');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals / Overlays
  const [activeRoasteryDetail, setActiveRoasteryDetail] = useState<Roastery | null>(null);
  const [customizingDrink, setCustomizingDrink] = useState<Drink | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Cart & Order State with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('velvet_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem('velvet_active_order');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVE_ORDER;
    } catch {
      return INITIAL_ACTIVE_ORDER;
    }
  });

  const [orderHistory, setOrderHistory] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('velvet_order_history');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'past-ord-1',
          orderNumber: '#VD-719',
          roasteryId: 'maison-nuage',
          roasteryName: 'Maison Nuage Coffee',
          roasteryAddress: '820 S Santa Fe Ave',
          items: [
            {
              cartItemId: 'past-item-1',
              drink: MENU_DRINKS[3], // Rose Latte
              roasteryId: 'maison-nuage',
              roasteryName: 'Maison Nuage Coffee',
              quantity: 1,
              selectedMilk: 'Artisan Oat M*lk',
              selectedRoast: 'Colombia Pink Bourbon',
              selectedSweetness: 'Balanced (50%)',
              selectedTemp: 'Hot',
              selectedAddOns: [],
              baristaNotes: '',
              itemPrice: 7.00,
            }
          ],
          subtotal: 7.00,
          tip: 1.40,
          tax: 0.61,
          total: 9.01,
          pickupType: 'Walk-in Bar',
          pickupTimeSlot: 'Yesterday',
          status: 'collected',
          createdAt: Date.now() - 28 * 3600 * 1000,
          targetReadyTime: Date.now() - 28 * 3600 * 1000,
          baristaName: 'Noah S.',
          shelfCode: 'Shelf A-1',
          statusHistory: [],
        }
      ];
    } catch {
      return [];
    }
  });

  const [favoriteRoasteryIds, setFavoriteRoasteryIds] = useState<string[]>(['atelier-sol']);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('velvet_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (activeOrder) {
        localStorage.setItem('velvet_active_order', JSON.stringify(activeOrder));
      } else {
        localStorage.removeItem('velvet_active_order');
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeOrder]);

  useEffect(() => {
    try {
      localStorage.setItem('velvet_order_history', JSON.stringify(orderHistory));
    } catch (e) {
      console.error(e);
    }
  }, [orderHistory]);

  // Cart operations
  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => {
      // Check if duplicate item exists with identical customizations
      const existingIdx = prev.findIndex(
        (i) =>
          i.drink.id === item.drink.id &&
          i.selectedMilk === item.selectedMilk &&
          i.selectedRoast === item.selectedRoast &&
          i.selectedSweetness === item.selectedSweetness &&
          i.selectedTemp === item.selectedTemp &&
          i.baristaNotes === item.baristaNotes &&
          i.selectedAddOns.length === item.selectedAddOns.length &&
          i.selectedAddOns.every((a, idx) => a.id === item.selectedAddOns[idx]?.id)
      );

      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });

    // Provide friendly micro notification and navigate or let user keep browsing
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity: newQty } : i))
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Pre-Order Placement
  const handlePlaceOrder = (newOrder: Order) => {
    setActiveOrder(newOrder);
    setOrderHistory((prev) => [newOrder, ...prev]);
    setActiveTab('orders');
  };

  // Real-time Barista status update simulation
  const handleAdvanceOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setActiveOrder((prev) => {
      if (!prev || prev.id !== orderId) return prev;

      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let statusDetail = '';
      let statusLabel = '';

      if (nextStatus === 'grinding') {
        statusLabel = 'Grinding & Weighing Dose';
        statusDetail = 'Barista Clara dialed 18.5g beans to 350 microns on EK43 grinder.';
      } else if (nextStatus === 'brewing') {
        statusLabel = 'Extracting & Steaming Microfoam';
        statusDetail = 'Pulling double shot at 9.2 bars & texturing velvety oat milk.';
      } else if (nextStatus === 'ready') {
        statusLabel = 'Placed on Express Shelf';
        statusDetail = `Your cup is ready for pickup on ${prev.shelfCode} with your name!`;
      } else if (nextStatus === 'collected') {
        statusLabel = 'Order Picked Up';
        statusDetail = 'Customer checked out drink. Enjoy!';
      }

      const newHistoryEntry: OrderStatusUpdate = {
        status: nextStatus,
        label: statusLabel,
        detail: statusDetail,
        timestamp: nowStr,
      };

      const updated: Order = {
        ...prev,
        status: nextStatus,
        statusHistory: [...prev.statusHistory, newHistoryEntry],
      };

      // Also update in orderHistory
      setOrderHistory((historyPrev) =>
        historyPrev.map((o) => (o.id === orderId ? updated : o))
      );

      return updated;
    });
  };

  const handleCustomerArrived = (orderId: string) => {
    setActiveOrder((prev) => {
      if (!prev || prev.id !== orderId) return prev;
      return { ...prev, hasCustomerArrived: true };
    });
  };

  const handleReorder = (pastOrder: Order) => {
    setCartItems(pastOrder.items);
    setActiveTab('bag');
  };

  const handleToggleFavorite = (roasteryId: string) => {
    setFavoriteRoasteryIds((prev) =>
      prev.includes(roasteryId) ? prev.filter((id) => id !== roasteryId) : [...prev, roasteryId]
    );
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <MobileShell
      selectedLocation={selectedLocation}
      onLocationClick={() => setShowLocationPicker(true)}
      onSearchClick={() => {
        // focus search or navigate to discover
        setActiveTab('explore');
      }}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {/* Tab 1: Explore & Curated Drink Menu */}
      {activeTab === 'explore' && (
        <ExploreView
          roasteries={LOCAL_ROASTERIES}
          drinks={MENU_DRINKS}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onSelectRoastery={(roastery) => setActiveRoasteryDetail(roastery)}
          onSelectDrink={(drink) => setCustomizingDrink(drink)}
          onViewAllRoasteries={() => setActiveTab('roasteries')}
          searchQuery={searchQuery}
        />
      )}

      {/* Tab 2: Roasteries View */}
      {activeTab === 'roasteries' && (
        <RoasteriesView
          roasteries={LOCAL_ROASTERIES}
          onSelectRoastery={(roastery) => setActiveRoasteryDetail(roastery)}
          searchQuery={searchQuery}
        />
      )}

      {/* Tab 3: Real-Time Order Tracking & History */}
      {activeTab === 'orders' && (
        <OrderTrackingView
          activeOrder={activeOrder}
          orderHistory={orderHistory}
          onAdvanceOrderStatus={handleAdvanceOrderStatus}
          onCustomerArrived={handleCustomerArrived}
          onReorder={handleReorder}
          onBrowseMenu={() => setActiveTab('explore')}
        />
      )}

      {/* Tab 4: Pre-Order Bag & Checkout */}
      {activeTab === 'bag' && (
        <CartDrawer
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onPlaceOrder={handlePlaceOrder}
          onBrowseMenu={() => setActiveTab('explore')}
        />
      )}

      {/* Fixed Bottom Navigation Bar */}
      <BottomTabBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={totalCartCount}
        activeOrder={activeOrder}
      />

      {/* Roastery Detail Modal */}
      {activeRoasteryDetail && (
        <RoasteryDetailModal
          roastery={activeRoasteryDetail}
          drinks={MENU_DRINKS}
          onClose={() => setActiveRoasteryDetail(null)}
          onSelectDrink={(drink) => {
            setActiveRoasteryDetail(null);
            setCustomizingDrink(drink);
          }}
          isFavorite={favoriteRoasteryIds.includes(activeRoasteryDetail.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Drink Customization Bottom Sheet Modal */}
      {customizingDrink && (
        <DrinkDetailModal
          drink={customizingDrink}
          roasteryName={
            LOCAL_ROASTERIES.find((r) => r.id === customizingDrink.roasteryId)?.name ||
            'Atelier Sol Roastery'
          }
          onClose={() => setCustomizingDrink(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Location Picker Sheet */}
      {showLocationPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 md:p-4">
          <div className="w-full max-w-sm bg-white rounded-t-3xl md:rounded-3xl p-5 shadow-2xl relative space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
              <h3 className="font-display text-sm font-bold text-[#2C2825]">
                Select Neighborhood Roastery Hub
              </h3>
              <button
                onClick={() => setShowLocationPicker(false)}
                className="w-7 h-7 rounded-full bg-[#F5EFE7] flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5">
              {[
                { name: 'Arts District, LA', detail: 'Atelier Sol, Maison Nuage (0.4 mi away)' },
                { name: 'Little Tokyo, LA', detail: 'Kanso Coffee Lab (1.1 mi away)' },
                { name: 'South Park / DTLA', detail: 'Folia Roasters & Flora (1.4 mi away)' },
                { name: 'Silver Lake Reservoir', detail: 'Coming soon to Velvet Drip' },
              ].map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => {
                    setSelectedLocation(loc.name);
                    setShowLocationPicker(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between ${
                    selectedLocation === loc.name
                      ? 'bg-[#FAF2EB] border-[#D0BAA8] text-[#2C2825]'
                      : 'bg-white border-[#E8DFD4] text-[#554A41] hover:border-[#DACFBF]'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs text-[#2C2825]">{loc.name}</div>
                    <div className="text-[11px] text-[#7A7067] mt-0.5">{loc.detail}</div>
                  </div>
                  {selectedLocation === loc.name && (
                    <span className="text-xs text-[#8D6B57] font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </MobileShell>
  );
}
