import React, { createContext, useContext, useState } from 'react';

export type TabItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type OpenTab = {
  restaurantName: string;
  tableNumber: number;
  items: TabItem[];
  openedAt: string;
  subtotal: number;
  tax: number;
  total: number;
};

export type PastMeal = {
  id: string;
  restaurantName: string;
  date: string;
  time: string;
  items: TabItem[];
  subtotal: number;
  tax: number;
  tipAmount: number;
  tipPercentage: number;
  total: number;
  splitWith?: string[];
};

type TabContextType = {
  openTab: OpenTab | null;
  pastMeals: PastMeal[];
  closeTab: (tipAmount: number, tipPercentage: number, splitWith?: string[]) => void;
  splitPeople: number;
  setSplitPeople: (n: number) => void;
  tableCode: string;
  resetDemoData: () => void;
};

const TabContext = createContext<TabContextType | null>(null);

const MOCK_OPEN_TAB: OpenTab = {
  restaurantName: 'Osteria Morini',
  tableNumber: 7,
  items: [
    { id: 'oi1', name: "Rigatoni all'Amatriciana", price: 28, quantity: 1 },
    { id: 'oi2', name: 'Branzino al Forno', price: 36, quantity: 1 },
    { id: 'oi3', name: 'Crème Brûlée', price: 14, quantity: 1 },
  ],
  openedAt: '7:32 PM',
  subtotal: 78,
  tax: 9,
  total: 87,
};

const MOCK_PAST_MEALS: PastMeal[] = [
  {
    id: 'pm1',
    restaurantName: 'Le Bernardin',
    date: 'Jun 15, 2026',
    time: '8:14 PM',
    items: [
      { id: 'i1', name: 'Poached Lobster', price: 48, quantity: 1 },
      { id: 'i2', name: 'Halibut en Papillote', price: 42, quantity: 1 },
      { id: 'i3', name: 'Champagne', price: 28, quantity: 2 },
    ],
    subtotal: 146,
    tax: 12.95,
    tipAmount: 29.20,
    tipPercentage: 20,
    total: 188.15,
    splitWith: ['Sarah K.', 'Emma R.'],
  },
  {
    id: 'pm2',
    restaurantName: 'Gramercy Tavern',
    date: 'Jun 8, 2026',
    time: '7:45 PM',
    items: [
      { id: 'i1', name: 'Duck Breast', price: 38, quantity: 1 },
      { id: 'i2', name: 'House Red Wine', price: 22, quantity: 1 },
      { id: 'i3', name: 'Mushroom Tart', price: 16, quantity: 1 },
    ],
    subtotal: 76,
    tax: 6.74,
    tipAmount: 13.68,
    tipPercentage: 18,
    total: 96.42,
  },
  {
    id: 'pm3',
    restaurantName: 'Carbone',
    date: 'May 28, 2026',
    time: '9:00 PM',
    items: [
      { id: 'i1', name: 'Rigatoni alla Vodka', price: 36, quantity: 1 },
      { id: 'i2', name: 'Veal Chop Milanese', price: 68, quantity: 1 },
      { id: 'i3', name: 'Tiramisu', price: 16, quantity: 1 },
      { id: 'i4', name: 'Amaro Montenegro', price: 22, quantity: 2 },
    ],
    subtotal: 164,
    tax: 14.55,
    tipAmount: 41.00,
    tipPercentage: 25,
    total: 219.55,
    splitWith: ['Mike T.'],
  },
  {
    id: 'pm4',
    restaurantName: 'Via Carota',
    date: 'May 20, 2026',
    time: '7:00 PM',
    items: [
      { id: 'i1', name: 'Pasta Primavera', price: 24, quantity: 1 },
      { id: 'i2', name: 'Branzino al Forno', price: 34, quantity: 1 },
    ],
    subtotal: 58,
    tax: 5.15,
    tipAmount: 11.60,
    tipPercentage: 20,
    total: 74.75,
  },
  {
    id: 'pm5',
    restaurantName: "Don Angie",
    date: 'May 12, 2026',
    time: '8:30 PM',
    items: [
      { id: 'i1', name: 'Lasagna Fritta', price: 28, quantity: 1 },
      { id: 'i2', name: 'Duck Ragù Orecchiette', price: 32, quantity: 1 },
      { id: 'i3', name: 'Panna Cotta', price: 14, quantity: 1 },
      { id: 'i4', name: 'Natural Wine', price: 8, quantity: 1 },
    ],
    subtotal: 82,
    tax: 7.28,
    tipAmount: 14.76,
    tipPercentage: 18,
    total: 104.04,
  },
];

export function TabProvider({ children }: { children: React.ReactNode }) {
  const [openTab, setOpenTab] = useState<OpenTab | null>(MOCK_OPEN_TAB);
  const [pastMeals, setPastMeals] = useState<PastMeal[]>(MOCK_PAST_MEALS);
  const [splitPeople, setSplitPeople] = useState(3);

  const closeTab = (tipAmount: number, tipPercentage: number, splitWith?: string[]) => {
    if (!openTab) return;
    const newMeal: PastMeal = {
      id: `pm${Date.now()}`,
      restaurantName: openTab.restaurantName,
      date: 'Jul 5, 2026',
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      items: openTab.items,
      subtotal: openTab.subtotal,
      tax: openTab.tax,
      tipAmount,
      tipPercentage,
      total: openTab.total + tipAmount,
      splitWith,
    };
    setPastMeals((prev) => [newMeal, ...prev]);
    setOpenTab(null);
  };

  const resetDemoData = () => {
    setOpenTab(MOCK_OPEN_TAB);
    setPastMeals(MOCK_PAST_MEALS);
    setSplitPeople(3);
  };

  return (
    <TabContext.Provider
      value={{
        openTab,
        pastMeals,
        closeTab,
        splitPeople,
        setSplitPeople,
        tableCode: '7421',
        resetDemoData,
      }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTab() {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error('useTab must be used within TabProvider');
  return ctx;
}

export function fmt(n: number): string {
  return n.toFixed(2);
}
