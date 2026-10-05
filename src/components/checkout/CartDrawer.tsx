import React, { useState } from 'react';
import { CartItem, Order, OrderStatusUpdate } from '../../types/coffee';
import { Trash2, Plus, Minus, Clock, MapPin, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (order: Order) => void;
  onBrowseMenu: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
  onBrowseMenu,
}) => {
  const [pickupType, setPickupType] = useState<'Walk-in Bar' | 'Curbside Handoff'>('Walk-in Bar');
  const [pickupSlot, setPickupSlot] = useState<string>('ASAP (Ready in ~10 mins)');
  const [tipPercent, setTipPercent] = useState<number>(20);
  const [curbsideNote, setCurbsideNote] = useState<string>('');

  const subtotal = items.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0);
  const tax = subtotal * 0.0875;
  const tipAmount = (subtotal * tipPercent) / 100;
  const total = subtotal + tax + tipAmount;

  const roasteryName = items.length > 0 ? items[0].roasteryName : 'Atelier Sol Roastery';
  const roasteryId = items.length > 0 ? items[0].roasteryId : 'atelier-sol';

  const handleCheckout = () => {
    if (items.length === 0) return;

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderNumber = `#VD-${randomSuffix}`;
    const targetReadyTime = Date.now() + 10 * 60 * 1000;

    const initialHistory: OrderStatusUpdate[] = [
      {
        status: 'received',
        label: 'Order Ticket Sent',
        detail: `Sent to ${roasteryName} baristas. Bar prep starting immediately.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      roasteryId,
      roasteryName,
      roasteryAddress: '412 E 3rd Street, Arts District',
      items: [...items],
      subtotal,
      tip: tipAmount,
      tax,
      total,
      pickupType,
      pickupTimeSlot: pickupSlot,
      status: 'received',
      createdAt: Date.now(),
      targetReadyTime,
      baristaName: 'Julian & Clara',
      shelfCode: `Shelf ${String.fromCharCode(65 + Math.floor(Math.random() * 4))}-${Math.floor(1 + Math.random() * 4)}`,
      hasCustomerArrived: false,
      statusHistory: initialHistory,
    };

    onPlaceOrder(newOrder);
    onClearCart();
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#EFE8DF] flex items-center justify-center text-[#8D7F73] mb-4 text-2xl">
          ☕
        </div>
        <h3 className="font-display text-lg font-bold text-[#2C2825]">
          Your Pre-Order Bag is Empty
        </h3>
        <p className="text-xs text-[#7A7067] max-w-xs mt-1.5 leading-relaxed">
          Browse local roasteries to customize your pour-over, cortado, or iced botanical latte for express counter pickup.
        </p>
        <button
          onClick={onBrowseMenu}
          className="mt-6 px-5 py-2.5 rounded-xl bg-[#2C2825] hover:bg-[#3D3733] text-[#FAF7F2] text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <span>Browse Roasteries & Brews</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pt-3 px-4 pb-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-[#2C2825]">
            Pre-Order Review
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-[#7A7067] mt-0.5">
            <span>{roasteryName}</span>
            <span aria-hidden="true">·</span>
            <span>{items.reduce((s, i) => s + i.quantity, 0)} items</span>
          </div>
        </div>

        <button
          onClick={onClearCart}
          className="text-xs text-[#9E8B7C] hover:text-[#B8573A] transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Itemized Order List */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.cartItemId}
            className="bg-white rounded-2xl p-3.5 border border-[#ECE4DA] shadow-xs flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#EFE9E0] overflow-hidden shrink-0">
                <img
                  src={item.drink.image}
                  alt={item.drink.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between">
                  <h4 className="font-display text-xs font-bold text-[#2C2825] truncate">
                    {item.drink.name}
                  </h4>
                  <span className="text-xs font-bold font-mono text-[#2C2825] tabular-nums">
                    ${(item.itemPrice * item.quantity).toFixed(2)}
                  </span>
                </div>

                {/* Customizations summary */}
                <div className="text-[11px] text-[#7A7067] mt-0.5 space-y-0.5">
                  <div className="flex items-center gap-1">
                    <span>{item.selectedTemp}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.selectedMilk}</span>
                  </div>
                  {item.selectedRoast && (
                    <div className="text-[#8D6B57] truncate">
                      {item.selectedRoast}
                    </div>
                  )}
                  {item.selectedAddOns.length > 0 && (
                    <div className="text-[10px] text-[#9A8D80]">
                      + {item.selectedAddOns.map((a) => a.name).join(', ')}
                    </div>
                  )}
                  {item.baristaNotes && (
                    <div className="text-[10px] italic text-[#9A8D80]">
                      "{item.baristaNotes}"
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stepper & Delete */}
            <div className="flex items-center justify-between pt-2 border-t border-[#F2ECE3]">
              <button
                onClick={() => onRemoveItem(item.cartItemId)}
                className="text-[#A89D93] hover:text-[#B8573A] transition-colors p-1"
                aria-label="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2 bg-[#F5EFE7] rounded-lg p-0.5">
                <button
                  onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                  className="w-6 h-6 rounded bg-white flex items-center justify-center text-xs font-bold text-[#2C2825]"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-mono font-bold w-4 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                  className="w-6 h-6 rounded bg-white flex items-center justify-center text-xs font-bold text-[#2C2825]"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pickup Method */}
      <div className="bg-white rounded-2xl p-4 border border-[#ECE4DA] space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7E74]">
          Pickup Method
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['Walk-in Bar', 'Curbside Handoff'] as const).map((method) => {
            const isSelected = pickupType === method;
            return (
              <button
                key={method}
                type="button"
                onClick={() => setPickupType(method)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#2C2825] text-[#FAF7F2]'
                    : 'bg-[#F5EFE7] text-[#63574D] hover:bg-[#EAE2D7]'
                }`}
              >
                {method}
              </button>
            );
          })}
        </div>

        {pickupType === 'Curbside Handoff' && (
          <div>
            <label className="block text-[11px] text-[#7A7067] mb-1 font-medium">
              Vehicle Make, Model & Color
            </label>
            <input
              type="text"
              value={curbsideNote}
              onChange={(e) => setCurbsideNote(e.target.value)}
              placeholder="e.g. Silver Volvo V60 parked by tree"
              className="w-full px-3 py-1.5 bg-[#FAF7F2] rounded-xl border border-[#E5DDD4] text-xs text-[#2C2825] focus:outline-none focus:border-[#C4B29E]"
            />
          </div>
        )}
      </div>

      {/* Pickup Slot Timing */}
      <div className="bg-white rounded-2xl p-4 border border-[#ECE4DA] space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[#8A7E74]">
            Pickup Schedule
          </label>
          <span className="text-[11px] text-[#8D6B57] font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Standard Brew Time
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            'ASAP (Ready in ~10 mins)',
            'In 20 mins',
            'In 35 mins',
            'In 50 mins',
          ].map((slot) => {
            const isSelected = pickupSlot === slot;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => setPickupSlot(slot)}
                className={`py-2 px-2.5 rounded-xl text-[11px] font-medium transition-all text-left truncate ${
                  isSelected
                    ? 'bg-[#FAF2EB] border border-[#D0BAA8] text-[#2C2825] font-semibold'
                    : 'bg-[#F9F6F1] border border-transparent text-[#63574D] hover:bg-[#EFE8DF]'
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      {/* Barista Tip */}
      <div className="bg-white rounded-2xl p-4 border border-[#ECE4DA] space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[#8A7E74]">
            Support The Roasting Baristas
          </label>
          <span className="text-xs font-mono font-semibold text-[#2C2825]">
            ${tipAmount.toFixed(2)}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {[15, 20, 25, 0].map((percent) => (
            <button
              key={percent}
              type="button"
              onClick={() => setTipPercent(percent)}
              className={`py-1.5 rounded-xl text-xs font-semibold transition-all ${
                tipPercent === percent
                  ? 'bg-[#2C2825] text-[#FAF7F2]'
                  : 'bg-[#F5EFE7] text-[#63574D] hover:bg-[#EAE2D7]'
              }`}
            >
              {percent === 0 ? 'Custom' : `${percent}%`}
            </button>
          ))}
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white rounded-2xl p-4 border border-[#ECE4DA] space-y-2 text-xs">
        <div className="flex justify-between text-[#7A7067]">
          <span>Subtotal</span>
          <span className="font-mono tabular-nums text-[#2C2825]">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[#7A7067]">
          <span>Estimated Local Tax (8.75%)</span>
          <span className="font-mono tabular-nums text-[#2C2825]">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[#7A7067]">
          <span>Barista Tip</span>
          <span className="font-mono tabular-nums text-[#2C2825]">${tipAmount.toFixed(2)}</span>
        </div>
        <div className="pt-2 border-t border-[#EDE4D8] flex justify-between font-bold text-sm text-[#2C2825]">
          <span>Total Pre-Order</span>
          <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Place Order Primary Action CTA */}
      <button
        onClick={handleCheckout}
        className="w-full h-13 rounded-2xl bg-[#2C2825] hover:bg-[#3D3733] text-[#FAF7F2] font-semibold text-sm flex items-center justify-between px-5 transition-all shadow-md active:scale-[0.99]"
      >
        <span>Confirm Pre-Order</span>
        <span className="font-mono tabular-nums">${total.toFixed(2)} →</span>
      </button>
    </div>
  );
};
