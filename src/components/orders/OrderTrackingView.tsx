import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, OrderStatusUpdate } from '../../types/coffee';
import {
  Clock,
  CheckCircle2,
  Coffee,
  MapPin,
  QrCode,
  Sparkles,
  Phone,
  Navigation,
  RotateCw,
  ChevronRight,
  Flame,
  Check
} from 'lucide-react';

interface OrderTrackingViewProps {
  activeOrder: Order | null;
  orderHistory: Order[];
  onAdvanceOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  onCustomerArrived: (orderId: string) => void;
  onReorder: (order: Order) => void;
  onBrowseMenu: () => void;
}

const STATUS_STEPS: {
  status: OrderStatus;
  title: string;
  subtitle: string;
  progressPercent: number;
}[] = [
  {
    status: 'received',
    title: 'Order Confirmed',
    subtitle: 'Ticket received by roastery team',
    progressPercent: 20,
  },
  {
    status: 'grinding',
    title: 'Grinding Single-Origin',
    subtitle: 'Dosing fresh roasted beans on Mahlkönig EK43',
    progressPercent: 50,
  },
  {
    status: 'brewing',
    title: 'Brewing & Texturing',
    subtitle: 'Pulling 1:2 espresso & steaming micro-foam',
    progressPercent: 80,
  },
  {
    status: 'ready',
    title: 'Ready at Pickup Bar',
    subtitle: 'Waiting on express shelf with your name',
    progressPercent: 100,
  },
  {
    status: 'collected',
    title: 'Order Completed',
    subtitle: 'Enjoy your handcrafted coffee!',
    progressPercent: 100,
  },
];

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  activeOrder,
  orderHistory,
  onAdvanceOrderStatus,
  onCustomerArrived,
  onReorder,
  onBrowseMenu,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [showQrModal, setShowQrModal] = useState(false);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

  // Live countdown timer calculation
  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'collected') {
      setSecondsRemaining(0);
      return;
    }

    const updateTimer = () => {
      const diff = Math.max(0, Math.floor((activeOrder.targetReadyTime - Date.now()) / 1000));
      setSecondsRemaining(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeOrder?.targetReadyTime, activeOrder?.status]);

  // Optional automatic stage progression simulation (so users see real-time updates happen live)
  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'collected' || activeOrder.status === 'ready') return;

    // Automatically transition to next step after 20 seconds for an authentic live feel
    const autoAdvanceTimer = setTimeout(() => {
      if (activeOrder.status === 'received') {
        onAdvanceOrderStatus(activeOrder.id, 'grinding');
      } else if (activeOrder.status === 'grinding') {
        onAdvanceOrderStatus(activeOrder.id, 'brewing');
      } else if (activeOrder.status === 'brewing') {
        onAdvanceOrderStatus(activeOrder.id, 'ready');
      }
    }, 22000);

    return () => clearTimeout(autoAdvanceTimer);
  }, [activeOrder?.status, activeOrder?.id, onAdvanceOrderStatus]);

  const formatCountdown = (totalSecs: number) => {
    if (totalSecs <= 0) return 'Ready Now!';
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const currentStepIndex = activeOrder
    ? STATUS_STEPS.findIndex((s) => s.status === activeOrder.status)
    : 0;

  const currentStep = STATUS_STEPS[Math.max(0, currentStepIndex)];

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    if (current === 'received') return 'grinding';
    if (current === 'grinding') return 'brewing';
    if (current === 'brewing') return 'ready';
    if (current === 'ready') return 'collected';
    return null;
  };

  return (
    <div className="space-y-4 pt-3 px-4 pb-6">
      {/* Sub Tabs: Live Tracker vs History */}
      <div className="flex items-center gap-1 p-1 bg-[#EFE9DF] rounded-xl">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'active'
              ? 'bg-[#FAF7F2] text-[#2C2825] shadow-xs'
              : 'text-[#7A7067] hover:text-[#2C2825]'
          }`}
        >
          Live Order Tracker {activeOrder && activeOrder.status !== 'collected' && '•'}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'history'
              ? 'bg-[#FAF7F2] text-[#2C2825] shadow-xs'
              : 'text-[#7A7067] hover:text-[#2C2825]'
          }`}
        >
          Past Orders ({orderHistory.length})
        </button>
      </div>

      {activeTab === 'active' ? (
        activeOrder ? (
          <div className="space-y-4">
            {/* Real-time Status Card in Pastel Rose & Cream */}
            <div className="relative overflow-hidden bg-white rounded-3xl p-5 border border-[#ECE3D6] shadow-xs">
              {/* Top row: Order Number & Roastery */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8D7F73]">
                    Express Pre-Order
                  </span>
                  <h3 className="font-display text-xl font-bold text-[#2C2825]">
                    {activeOrder.orderNumber}
                  </h3>
                  <p className="text-xs text-[#6B5E53] font-medium mt-0.5">
                    {activeOrder.roasteryName}
                  </p>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FAF0E6] text-[#A05C38] text-xs font-bold font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {activeOrder.status === 'ready'
                        ? 'Ready for pickup'
                        : activeOrder.status === 'collected'
                        ? 'Completed'
                        : formatCountdown(secondsRemaining)}
                    </span>
                  </div>
                  <span className="block text-[10px] text-[#A69B91] mt-1 font-medium">
                    {activeOrder.pickupType}
                  </span>
                </div>
              </div>

              {/* Visual Live Brew Status Animation */}
              <div className="my-5 p-4 rounded-2xl bg-[#FAF6F0] border border-[#EDE2D4] flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-xs shrink-0">
                  {activeOrder.status === 'ready' ? (
                    <span className="text-2xl animate-bounce">🎉</span>
                  ) : activeOrder.status === 'collected' ? (
                    <CheckCircle2 className="w-7 h-7 text-[#5D8B61]" />
                  ) : (
                    <>
                      <Coffee className="w-7 h-7 text-[#8D6B57]" />
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E08A68] opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C96B48]" />
                      </span>
                    </>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#2C2825]">
                      {currentStep.title}
                    </span>
                    {activeOrder.status !== 'collected' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C96B48] animate-pulse" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#7A7067] leading-snug mt-0.5">
                    {currentStep.subtitle}
                  </p>
                </div>
              </div>

              {/* Progress Bar in Soft Pastel Coral */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#8C8074]">
                  <span>Progress</span>
                  <span className="font-mono font-semibold">
                    {currentStep.progressPercent}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#EDE5DB] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#DE9F84] to-[#C96B48] transition-all duration-700 ease-out rounded-full"
                    style={{ width: `${currentStep.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Shelf Pickup Badge when ready */}
              {activeOrder.status === 'ready' && (
                <div className="mt-4 p-3 bg-[#EAF2E9] rounded-2xl border border-[#CCE0CA] text-[#2C482A] flex items-center justify-between animate-fade-in">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#477744]" />
                    <span className="text-xs font-bold">
                      Your drink is on {activeOrder.shelfCode}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold bg-white px-2 py-0.5 rounded-lg text-[#2C482A]">
                    Tap & Grab
                  </span>
                </div>
              )}

              {/* Customer Arrived Banner if triggered */}
              {activeOrder.hasCustomerArrived && (
                <div className="mt-3 p-2.5 bg-[#FFF5E6] rounded-xl border border-[#F3DFC2] text-[#855B23] text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#855B23]" />
                  <span>Barista notified you are outside! Order is being handed over.</span>
                </div>
              )}

              {/* Action Buttons: Digital Pass & Directions */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#F2ECE3]">
                <button
                  onClick={() => setShowQrModal(true)}
                  className="py-2.5 px-3 rounded-xl bg-[#F5EFE7] hover:bg-[#EBE2D7] text-[#2C2825] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Pickup Pass</span>
                </button>

                <button
                  onClick={() => setShowDirectionsModal(true)}
                  className="py-2.5 px-3 rounded-xl bg-[#F5EFE7] hover:bg-[#EBE2D7] text-[#2C2825] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Cafe Map</span>
                </button>
              </div>

              {/* "I've Arrived" Trigger Button */}
              {activeOrder.status !== 'collected' && !activeOrder.hasCustomerArrived && (
                <button
                  onClick={() => onCustomerArrived(activeOrder.id)}
                  className="w-full mt-3 py-2.5 rounded-xl bg-[#FAF0E6] hover:bg-[#F3E3D3] text-[#8D5737] text-xs font-bold border border-[#ECD9C5] transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>📍 I've Arrived at Roastery</span>
                </button>
              )}

              {/* Simulator / Demo tool to advance status */}
              {getNextStatus(activeOrder.status) && (
                <div className="mt-4 pt-3 border-t border-dashed border-[#E8DFD4] flex items-center justify-between">
                  <span className="text-[10px] text-[#A3968A] uppercase font-semibold">
                    Live Demo Controls
                  </span>
                  <button
                    onClick={() => {
                      const next = getNextStatus(activeOrder.status);
                      if (next) onAdvanceOrderStatus(activeOrder.id, next);
                    }}
                    className="text-[11px] font-semibold text-[#8D6B57] hover:text-[#6F513F] flex items-center gap-1 bg-[#FAF5EE] px-2.5 py-1 rounded-lg border border-[#EDE2D4]"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Next: {getNextStatus(activeOrder.status)}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Live Barista Timeline & Activity Log */}
            <div className="bg-white rounded-3xl p-5 border border-[#ECE3D6] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold text-[#2C2825]">
                  Barista Status Stream
                </h4>
                <span className="text-[11px] text-[#7A7067]">
                  Barista: {activeOrder.baristaName}
                </span>
              </div>

              <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-[#EAE1D4]">
                {activeOrder.statusHistory.map((historyItem, idx) => (
                  <div key={idx} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-[#8D6B57] border-2 border-white shadow-xs" />
                    <div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-bold text-[#2C2825]">
                          {historyItem.label}
                        </span>
                        <span className="text-[10px] font-mono text-[#A89D93]">
                          {historyItem.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A7067] mt-0.5 leading-snug">
                        {historyItem.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items Breakdown */}
            <div className="bg-white rounded-3xl p-5 border border-[#ECE3D6] space-y-3">
              <h4 className="font-display text-sm font-bold text-[#2C2825]">
                Order Items ({activeOrder.items.length})
              </h4>
              <div className="space-y-2.5">
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between text-xs py-1 border-b border-[#F5EFE7] last:border-0">
                    <div>
                      <div className="font-bold text-[#2C2825]">
                        {item.quantity}x {item.drink.name}
                      </div>
                      <div className="text-[11px] text-[#7A7067]">
                        {item.selectedTemp} · {item.selectedMilk}
                        {item.selectedRoast && ` · ${item.selectedRoast}`}
                      </div>
                    </div>
                    <span className="font-mono tabular-nums font-semibold text-[#2C2825]">
                      ${(item.itemPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 flex justify-between font-bold text-xs text-[#2C2825]">
                <span>Total Paid</span>
                <span className="font-mono tabular-nums">${activeOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#ECE4DA] p-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#FAF3EC] flex items-center justify-center text-[#8D6B57] mx-auto text-xl">
              ☕
            </div>
            <h3 className="font-display text-base font-bold text-[#2C2825]">
              No Active Pre-Orders Right Now
            </h3>
            <p className="text-xs text-[#7A7067] max-w-xs mx-auto leading-relaxed">
              When you pre-order a handcrafted drink from any local roastery, you can follow its live grinding, brewing, and shelf readiness right here.
            </p>
            <button
              onClick={onBrowseMenu}
              className="mt-3 px-4 py-2 rounded-xl bg-[#2C2825] text-[#FAF7F2] text-xs font-semibold hover:bg-[#3D3733] transition-colors"
            >
              Browse Roastery Menu
            </button>
          </div>
        )
      ) : (
        /* Order History View */
        <div className="space-y-3">
          {orderHistory.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#ECE4DA] p-6">
              <p className="text-xs text-[#7A7067]">No past pre-orders yet.</p>
            </div>
          ) : (
            orderHistory.map((pastOrder) => (
              <div
                key={pastOrder.id}
                className="bg-white rounded-2xl p-4 border border-[#ECE4DA] shadow-xs space-y-2.5"
              >
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#2C2825]">
                      {pastOrder.orderNumber}
                    </span>
                    <span className="text-[11px] text-[#8A7E74] ml-2">
                      {pastOrder.roasteryName}
                    </span>
                  </div>
                  <span className="text-xs font-bold font-mono text-[#2C2825] tabular-nums">
                    ${pastOrder.total.toFixed(2)}
                  </span>
                </div>

                <div className="text-xs text-[#6B5E53] line-clamp-1">
                  {pastOrder.items.map((i) => `${i.quantity}x ${i.drink.name}`).join(', ')}
                </div>

                <div className="pt-2 border-t border-[#F2ECE3] flex items-center justify-between">
                  <span className="text-[11px] text-[#A69B91]">
                    {new Date(pastOrder.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <button
                    onClick={() => onReorder(pastOrder)}
                    className="text-xs font-bold text-[#8D6B57] hover:text-[#6F513F] transition-colors flex items-center gap-1"
                  >
                    <span>Reorder Bag</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* QR Code Digital Pass Modal */}
      {showQrModal && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xs bg-white rounded-3xl p-6 text-center shadow-2xl relative">
            <h3 className="font-display text-lg font-bold text-[#2C2825]">
              Express Pickup Pass
            </h3>
            <p className="text-xs text-[#7A7067] mt-0.5">
              Show to barista or tap on counter shelf
            </p>

            <div className="my-5 p-4 bg-[#FAF7F2] rounded-2xl border border-[#EDE4D8] flex flex-col items-center justify-center">
              {/* Simulated QR Pattern */}
              <div className="w-40 h-40 bg-white p-3 rounded-xl border border-[#E0D5C7] flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-[#2C2825]">
                  <rect x="0" y="0" width="30" height="30" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" />

                  <rect x="70" y="0" width="30" height="30" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="80" y="10" width="10" height="10" />

                  <rect x="0" y="70" width="30" height="30" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="80" width="10" height="10" />

                  <circle cx="50" cy="50" r="8" />
                  <rect x="42" y="15" width="8" height="15" />
                  <rect x="15" y="42" width="15" height="8" />
                  <rect x="65" y="45" width="10" height="20" />
                  <rect x="45" y="70" width="18" height="8" />
                  <rect x="70" y="70" width="15" height="15" />
                </svg>
              </div>

              <div className="mt-3">
                <span className="font-mono text-base font-bold text-[#2C2825] tracking-widest block">
                  {activeOrder.orderNumber}
                </span>
                <span className="text-[11px] font-semibold text-[#8D6B57]">
                  {activeOrder.shelfCode}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#2C2825] text-white text-xs font-semibold hover:bg-[#3D3733]"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}

      {/* Directions & Walking Route Modal */}
      {showDirectionsModal && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-[#2C2825]">
                  Walk to {activeOrder.roasteryName}
                </h3>
                <p className="text-xs text-[#7A7067]">{activeOrder.roasteryAddress}</p>
              </div>
              <button
                onClick={() => setShowDirectionsModal(false)}
                className="w-7 h-7 rounded-full bg-[#F5EFE7] flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Stylized Walking Route Graphic */}
            <div className="h-44 rounded-2xl bg-[#F6F2EB] border border-[#E8DFC9] p-3 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-[#7A7067]">
                <span className="font-semibold text-[#8D6B57]">Estimated 8 min walk (0.4 mi)</span>
                <span className="bg-white/80 px-2 py-0.5 rounded text-[10px]">Sunny 71°F</span>
              </div>

              {/* Graphic path */}
              <div className="my-auto flex items-center justify-between px-4">
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-[#2C2825] text-white text-xs flex items-center justify-center mx-auto mb-1">
                    📍
                  </div>
                  <span className="text-[10px] font-semibold block">You</span>
                </div>

                <div className="flex-1 mx-3 border-t-2 border-dashed border-[#8D6B57] relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F6F2EB] px-1 text-[9px] text-[#8D6B57] font-semibold">
                    via 3rd St
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-[#E08A68] text-white text-xs flex items-center justify-center mx-auto mb-1">
                    ☕
                  </div>
                  <span className="text-[10px] font-semibold block truncate max-w-[70px]">
                    Atelier Sol
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-[#63574D] bg-white/70 backdrop-blur-xs p-2 rounded-xl">
                Entrance on East 3rd Street through the sunlit courtyard garden.
              </div>
            </div>

            <button
              onClick={() => {
                alert(`Opening map directions to ${activeOrder.roasteryAddress}`);
                setShowDirectionsModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-[#2C2825] text-white text-xs font-semibold hover:bg-[#3D3733]"
            >
              Open in Maps Navigation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
