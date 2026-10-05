export type RoastLevel = 'Light Scandinavian' | 'Light-Medium' | 'Medium Honey' | 'Dark Espresso';

export interface Roastery {
  id: string;
  name: string;
  tagline: string;
  description: string;
  address: string;
  neighborhood: string;
  distanceMiles: number;
  walkingMinutes: number;
  currentWaitMins: number;
  rating: number;
  reviewCount: number;
  roastFocus: string;
  heroImage: string;
  baristas: string[];
  features: string[];
  vibe: string;
  coordinates: { lat: number; lng: number };
  openingHours: string;
  specialtyOrigin: string;
}

export type DrinkCategory = 'Espresso & Milk' | 'Pour-Over' | 'Cold & Tonic' | 'Botanical & Tea' | 'Pastries';

export interface CustomizationOption {
  id: string;
  name: string;
  additionalPrice: number;
  description?: string;
}

export interface Drink {
  id: string;
  roasteryId: string;
  name: string;
  category: DrinkCategory;
  price: number;
  description: string;
  image: string;
  tastingNotes: string[];
  isPopular?: boolean;
  isSeasonal?: boolean;
  calories?: number;
  roastOptions: CustomizationOption[];
  milkOptions: CustomizationOption[];
  sweetnessOptions: string[];
  temperatureOptions: ('Hot' | 'Iced')[];
  addOnOptions: CustomizationOption[];
}

export interface CartItem {
  cartItemId: string;
  drink: Drink;
  roasteryId: string;
  roasteryName: string;
  quantity: number;
  selectedMilk: string;
  selectedRoast: string;
  selectedSweetness: string;
  selectedTemp: 'Hot' | 'Iced';
  selectedAddOns: CustomizationOption[];
  baristaNotes: string;
  itemPrice: number;
}

export type OrderStatus = 'received' | 'grinding' | 'brewing' | 'ready' | 'collected';

export interface OrderStatusUpdate {
  status: OrderStatus;
  label: string;
  detail: string;
  timestamp: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  roasteryId: string;
  roasteryName: string;
  roasteryAddress: string;
  items: CartItem[];
  subtotal: number;
  tip: number;
  tax: number;
  total: number;
  pickupType: 'Walk-in Bar' | 'Curbside Handoff';
  pickupTimeSlot: string;
  status: OrderStatus;
  createdAt: number;
  targetReadyTime: number; // timestamp in ms
  baristaName: string;
  statusHistory: OrderStatusUpdate[];
  shelfCode: string;
  hasCustomerArrived?: boolean;
}
