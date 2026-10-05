import React, { useState } from 'react';
import { Drink, CustomizationOption, CartItem } from '../../types/coffee';
import { X, Plus, Minus, Check, Sparkles } from 'lucide-react';

interface DrinkDetailModalProps {
  drink: Drink;
  roasteryName: string;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export const DrinkDetailModal: React.FC<DrinkDetailModalProps> = ({
  drink,
  roasteryName,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedTemp, setSelectedTemp] = useState<'Hot' | 'Iced'>(
    drink.temperatureOptions[0] || 'Hot'
  );
  const [selectedMilk, setSelectedMilk] = useState<string>(
    drink.milkOptions.length > 0 ? drink.milkOptions[0].name : 'Standard'
  );
  const [selectedRoast, setSelectedRoast] = useState<string>(
    drink.roastOptions.length > 0 ? drink.roastOptions[0].name : 'Default Roastery Roast'
  );
  const [selectedSweetness, setSelectedSweetness] = useState<string>(
    drink.sweetnessOptions[0] || 'Unsweetened (0%)'
  );
  const [selectedAddOns, setSelectedAddOns] = useState<CustomizationOption[]>([]);
  const [baristaNotes, setBaristaNotes] = useState('');

  // Calculate dynamic unit price
  const milkExtra = drink.milkOptions.find((m) => m.name === selectedMilk)?.additionalPrice || 0;
  const roastExtra = drink.roastOptions.find((r) => r.name === selectedRoast)?.additionalPrice || 0;
  const addOnsExtra = selectedAddOns.reduce((sum, item) => sum + item.additionalPrice, 0);
  const unitPrice = drink.price + milkExtra + roastExtra + addOnsExtra;
  const totalPrice = unitPrice * quantity;

  const toggleAddOn = (addOn: CustomizationOption) => {
    if (selectedAddOns.some((a) => a.id === addOn.id)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.id !== addOn.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addOn]);
    }
  };

  const handleAddOrder = () => {
    const cartItem: CartItem = {
      cartItemId: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      drink,
      roasteryId: drink.roasteryId,
      roasteryName,
      quantity,
      selectedMilk,
      selectedRoast,
      selectedSweetness,
      selectedTemp,
      selectedAddOns,
      baristaNotes,
      itemPrice: unitPrice,
    };
    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-xs p-0 md:p-4">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#FAF7F2] rounded-t-[32px] md:rounded-[32px] max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl z-10 flex flex-col">
        {/* Header bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EDE4D8]">
          <span className="text-xs font-semibold text-[#8D7F73]">
            {roasteryName}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#EFE8DF] hover:bg-[#E5DDD2] transition-colors flex items-center justify-center text-[#2C2825]"
            aria-label="Close drink customizer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drink Image & Basic Info */}
        <div className="p-5 pb-3">
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#ECE4DA] shrink-0 border border-[#E0D5C7]">
              <img
                src={drink.image}
                alt={drink.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#918174]">
                <span>{drink.category}</span>
                {drink.calories && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{drink.calories} kcal</span>
                  </>
                )}
              </div>
              <h2 className="font-display text-xl font-bold text-[#2C2825] mt-0.5">
                {drink.name}
              </h2>
              <p className="text-xs text-[#6B5E53] mt-1 leading-relaxed">
                {drink.description}
              </p>
            </div>
          </div>
        </div>

        {/* Customization Options Body */}
        <div className="p-5 pt-0 space-y-5 flex-1">
          {/* Temperature Selector */}
          {drink.temperatureOptions.length > 1 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7E74] mb-2">
                Temperature
              </label>
              <div className="grid grid-cols-2 gap-2">
                {drink.temperatureOptions.map((temp) => (
                  <button
                    key={temp}
                    type="button"
                    onClick={() => setSelectedTemp(temp)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      selectedTemp === temp
                        ? 'bg-[#2C2825] text-[#FAF7F2] shadow-xs'
                        : 'bg-white border border-[#E5DDD4] text-[#63574D] hover:bg-[#F3ECE4]'
                    }`}
                  >
                    <span>{temp === 'Hot' ? '🔥 Steamed Hot' : '🧊 Chilled on Ice'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Single Origin Bean Selection */}
          {drink.roastOptions.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7E74] mb-2">
                Bean Roast & Farm Lot
              </label>
              <div className="space-y-1.5">
                {drink.roastOptions.map((roast) => {
                  const isSelected = selectedRoast === roast.name;
                  return (
                    <button
                      key={roast.id}
                      type="button"
                      onClick={() => setSelectedRoast(roast.name)}
                      className={`w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#FAF2EB] border-[#D0BAA8] text-[#2C2825]'
                          : 'bg-white border-[#E8DFD4] text-[#554A41] hover:border-[#DACFBF]'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-semibold text-xs text-[#2C2825]">
                          {roast.name}
                        </div>
                        {roast.description && (
                          <div className="text-[11px] text-[#7A7067] truncate mt-0.5">
                            {roast.description}
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        {roast.additionalPrice > 0 ? (
                          <span className="text-xs font-bold font-mono text-[#8D6B57]">
                            +${roast.additionalPrice.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#968B80]">Included</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Milk Selection */}
          {drink.milkOptions.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7E74] mb-2">
                Milk Choice
              </label>
              <div className="grid grid-cols-2 gap-2">
                {drink.milkOptions.map((milk) => {
                  const isSelected = selectedMilk === milk.name;
                  return (
                    <button
                      key={milk.id}
                      type="button"
                      onClick={() => setSelectedMilk(milk.name)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-[#FAF2EB] border-[#D0BAA8] text-[#2C2825]'
                          : 'bg-white border-[#E8DFD4] text-[#554A41] hover:border-[#DACFBF]'
                      }`}
                    >
                      <div className="text-xs font-semibold truncate">{milk.name}</div>
                      <div className="text-[10px] text-[#8A7E74] mt-0.5">
                        {milk.additionalPrice > 0 ? `+$${milk.additionalPrice.toFixed(2)}` : 'Standard'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sweetness */}
          {drink.sweetnessOptions.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7E74] mb-2">
                Sweetness Level
              </label>
              <div className="flex flex-wrap gap-1.5">
                {drink.sweetnessOptions.map((sweet) => {
                  const isSelected = selectedSweetness === sweet;
                  return (
                    <button
                      key={sweet}
                      type="button"
                      onClick={() => setSelectedSweetness(sweet)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#2C2825] text-[#FAF7F2]'
                          : 'bg-white border border-[#E5DDD4] text-[#5A5046] hover:bg-[#F3ECE4]'
                      }`}
                    >
                      {sweet}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons */}
          {drink.addOnOptions.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7E74] mb-2">
                Curated Add-ons
              </label>
              <div className="space-y-1.5">
                {drink.addOnOptions.map((addon) => {
                  const isChecked = selectedAddOns.some((a) => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddOn(addon)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                        isChecked
                          ? 'bg-[#FAF2EB] border-[#D0BAA8] text-[#2C2825]'
                          : 'bg-white border-[#E8DFD4] text-[#554A41] hover:border-[#DACFBF]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                            isChecked
                              ? 'bg-[#2C2825] border-[#2C2825] text-white'
                              : 'border-[#CEC3B6] bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="font-medium">{addon.name}</span>
                      </div>
                      <span className="font-mono tabular-nums text-[#8D6B57] font-semibold">
                        +${addon.additionalPrice.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Barista Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7E74] mb-1.5">
              Note for Barista
            </label>
            <input
              type="text"
              value={baristaNotes}
              onChange={(e) => setBaristaNotes(e.target.value)}
              placeholder="e.g. Extra hot, splash of oat on side, ceramic cup..."
              className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8DFD4] text-xs text-[#2C2825] placeholder-[#9E948A] focus:outline-none focus:border-[#C4B29E]"
            />
          </div>
        </div>

        {/* Bottom CTA & Quantity */}
        <div className="sticky bottom-0 z-20 bg-[#FAF7F2] border-t border-[#EDE4D8] p-4 flex items-center gap-3">
          {/* Quantity stepper */}
          <div className="flex items-center gap-2 bg-[#EFE8DF] rounded-xl p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#2C2825] hover:bg-[#FAF7F2] transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-xs font-bold font-mono">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#2C2825] hover:bg-[#FAF7F2] transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddOrder}
            className="flex-1 h-12 rounded-xl bg-[#2C2825] hover:bg-[#3D3733] text-[#FAF7F2] font-semibold text-xs flex items-center justify-between px-4 transition-all shadow-sm active:scale-[0.99]"
          >
            <span>Add to Pre-Order</span>
            <span className="font-mono tabular-nums text-sm">
              ${totalPrice.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
