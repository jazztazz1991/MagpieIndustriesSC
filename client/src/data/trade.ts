export interface Commodity {
  name: string;
  category: "mineral" | "metal" | "agricultural" | "medical" | "gas" | "vice" | "scrap";
  illegal: boolean;
}

export interface TradeLocation {
  name: string;
  type: "city" | "outpost" | "station" | "rest_stop";
  parent: string; // planet or moon
  buys: { commodity: string; price: number }[];
  sells: { commodity: string; price: number }[];
}

export const commodities: Commodity[] = [
  { name: "Agricium", category: "metal", illegal: false },
  { name: "Aluminum", category: "metal", illegal: false },
  { name: "Beryl", category: "mineral", illegal: false },
  { name: "Copper", category: "metal", illegal: false },
  { name: "Corundum", category: "mineral", illegal: false },
  { name: "Diamond", category: "mineral", illegal: false },
  { name: "Fluorine", category: "gas", illegal: false },
  { name: "Gold", category: "metal", illegal: false },
  { name: "Hydrogen", category: "gas", illegal: false },
  { name: "Laranite", category: "mineral", illegal: false },
  { name: "Medical Supplies", category: "medical", illegal: false },
  { name: "Processed Food", category: "agricultural", illegal: false },
  { name: "Scrap", category: "scrap", illegal: false },
  { name: "Stims", category: "vice", illegal: false },
  { name: "Titanium", category: "metal", illegal: false },
  { name: "Tungsten", category: "metal", illegal: false },
  { name: "Waste", category: "scrap", illegal: false },
  { name: "Astatine", category: "mineral", illegal: false },
  { name: "Neon", category: "vice", illegal: true },
  { name: "SLAM", category: "vice", illegal: true },
];

export const tradeLocations: TradeLocation[] = [
  // Industrial city on Hurston - mines metals, needs food and medical
  {
    name: "Lorville (CBD)",
    type: "city",
    parent: "Hurston",
    buys: [
      { commodity: "Processed Food", price: 1.50 },
      { commodity: "Medical Supplies", price: 19.50 },
    ],
    sells: [
      { commodity: "Titanium", price: 7.80 },
      { commodity: "Aluminum", price: 1.15 },
      { commodity: "Agricium", price: 23.80 },
    ],
  },
  // Trade hub on ArcCorp - buys high-value minerals and metals
  {
    name: "Area 18 (TDD)",
    type: "city",
    parent: "ArcCorp",
    buys: [
      { commodity: "Laranite", price: 29.50 },
      { commodity: "Agricium", price: 26.20 },
      { commodity: "Titanium", price: 8.60 },
    ],
    sells: [
      { commodity: "Stims", price: 3.45 },
      { commodity: "Diamond", price: 6.50 },
    ],
  },
  // Biotech hub on microTech - produces medical, needs metals
  {
    name: "New Babbage",
    type: "city",
    parent: "microTech",
    buys: [
      { commodity: "Gold", price: 6.60 },
      { commodity: "Tungsten", price: 4.10 },
    ],
    sells: [
      { commodity: "Medical Supplies", price: 17.10 },
      { commodity: "Stims", price: 3.40 },
    ],
  },
  // Gas giant farming - cheap gas and food, needs metals
  {
    name: "Orison",
    type: "city",
    parent: "Crusader",
    buys: [
      { commodity: "Aluminum", price: 1.32 },
      { commodity: "Titanium", price: 8.40 },
    ],
    sells: [
      { commodity: "Hydrogen", price: 0.88 },
      { commodity: "Processed Food", price: 1.22 },
    ],
  },
  // Orbital station - general trade hub
  {
    name: "Port Olisar",
    type: "station",
    parent: "Crusader",
    buys: [
      { commodity: "Laranite", price: 29.00 },
      { commodity: "Agricium", price: 25.60 },
    ],
    sells: [
      { commodity: "Scrap", price: 1.55 },
    ],
  },
  // Pirate station - illegal goods trade, cheap minerals
  {
    name: "Grim HEX",
    type: "station",
    parent: "Yela",
    buys: [
      { commodity: "Scrap", price: 1.85 },
      { commodity: "SLAM", price: 15.20 },
      { commodity: "Neon", price: 12.50 },
    ],
    sells: [
      { commodity: "SLAM", price: 8.50 },
      { commodity: "Neon", price: 7.20 },
      { commodity: "Laranite", price: 26.50 },
      { commodity: "Gold", price: 5.90 },
    ],
  },
  // Rest stop - buys valuables, sells common goods
  {
    name: "CRU-L1 (Ambitious Dream)",
    type: "rest_stop",
    parent: "Crusader",
    buys: [
      { commodity: "Laranite", price: 28.80 },
      { commodity: "Diamond", price: 7.15 },
      { commodity: "Hydrogen", price: 1.12 },
    ],
    sells: [
      { commodity: "Medical Supplies", price: 17.50 },
    ],
  },
  // Rest stop near Hurston - buys gems and gas
  {
    name: "HUR-L2 (Faithful Dream)",
    type: "rest_stop",
    parent: "Hurston",
    buys: [
      { commodity: "Gold", price: 6.55 },
      { commodity: "Diamond", price: 7.10 },
      { commodity: "Neon", price: 11.80 },
    ],
    sells: [
      { commodity: "Processed Food", price: 1.28 },
      { commodity: "Laranite", price: 27.00 },
    ],
  },
];

export interface TradeRoute {
  from: string;
  to: string;
  commodity: string;
  buyPrice: number;
  sellPrice: number;
  profitPerSCU: number;
}

