import React, { createContext, useContext, useState } from 'react';

export const TAX_RATE = 0.08;

export type MenuCategory = 'starters' | 'mains' | 'desserts' | 'drinks';

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: MenuCategory;
};

export type TableOrder = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
};

export type TableStatus = 'open' | 'bill_sent' | 'paid';

export type RestaurantTable = {
  id: string;
  number: number;
  customerName: string;
  memberId: string;
  orders: TableOrder[];
  seatedAt: number;
  status: TableStatus;
  tipAmount?: number;
  tipPercentage?: number;
};

export type ClosedTable = {
  id: string;
  number: number;
  customerName: string;
  memberId: string;
  orders: TableOrder[];
  seatedAt: number;
  closedAt: number;
  tipAmount: number;
  tipPercentage: number;
};

export function tableSubtotal(orders: TableOrder[]): number {
  return orders.reduce((s, o) => s + o.price * o.quantity, 0);
}

export function tableTax(orders: TableOrder[]): number {
  return tableSubtotal(orders) * TAX_RATE;
}

export function tableTotal(orders: TableOrder[]): number {
  return tableSubtotal(orders) * (1 + TAX_RATE);
}

export function fmt(n: number): string {
  return n.toFixed(2);
}

export function fmtTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

const LOOKUP_NAMES = [
  'Alex J.', 'Morgan K.', 'Riley S.', 'Taylor B.',
  'Casey R.', 'Jordan L.', 'Quinn A.', 'Drew M.',
  'Avery P.', 'Reese N.',
];

export function lookupMemberById(memberId: string): string | null {
  if (!/^\d{6}$/.test(memberId)) return null;
  return LOOKUP_NAMES[parseInt(memberId) % LOOKUP_NAMES.length];
}

const INITIAL_MENU: MenuItem[] = [
  { id: 'm1', name: 'Burrata & Heirloom Tomato', price: 18, category: 'starters' },
  { id: 'm2', name: 'Truffle Arancini', price: 16, category: 'starters' },
  { id: 'm3', name: 'Beef Carpaccio', price: 22, category: 'starters' },
  { id: 'm4', name: "Rigatoni all'Amatriciana", price: 28, category: 'mains' },
  { id: 'm5', name: 'Branzino al Forno', price: 36, category: 'mains' },
  { id: 'm6', name: 'Duck Confit Risotto', price: 34, category: 'mains' },
  { id: 'm7', name: 'Veal Scaloppine', price: 42, category: 'mains' },
  { id: 'm8', name: 'Crème Brûlée', price: 14, category: 'desserts' },
  { id: 'm9', name: 'Tiramisu', price: 12, category: 'desserts' },
  { id: 'm10', name: 'Aperol Spritz', price: 16, category: 'drinks' },
  { id: 'm11', name: 'House Red Wine', price: 14, category: 'drinks' },
  { id: 'm12', name: 'Sparkling Water', price: 8, category: 'drinks' },
];

const NOW = Date.now();

const INITIAL_TABLES: RestaurantTable[] = [
  {
    id: 't4', number: 4, customerName: 'Sarah M.', memberId: '847293',
    seatedAt: NOW - 45 * 60 * 1000, status: 'open',
    orders: [
      { menuItemId: 'm3', name: 'Beef Carpaccio', price: 22, quantity: 1 },
      { menuItemId: 'm4', name: "Rigatoni all'Amatriciana", price: 28, quantity: 1 },
      { menuItemId: 'm5', name: 'Branzino al Forno', price: 36, quantity: 1 },
      { menuItemId: 'm11', name: 'House Red Wine', price: 14, quantity: 2 },
    ],
  },
  {
    id: 't7', number: 7, customerName: 'Jack P.', memberId: '192847',
    seatedAt: NOW - 23 * 60 * 1000, status: 'open',
    orders: [
      { menuItemId: 'm4', name: "Rigatoni all'Amatriciana", price: 28, quantity: 1 },
      { menuItemId: 'm5', name: 'Branzino al Forno', price: 36, quantity: 1 },
      { menuItemId: 'm8', name: 'Crème Brûlée', price: 14, quantity: 1 },
    ],
  },
  {
    id: 't12', number: 12, customerName: 'Emma R.', memberId: '593104',
    seatedAt: NOW - 67 * 60 * 1000, status: 'open',
    orders: [
      { menuItemId: 'm1', name: 'Burrata & Heirloom Tomato', price: 18, quantity: 1 },
      { menuItemId: 'm2', name: 'Truffle Arancini', price: 16, quantity: 2 },
      { menuItemId: 'm6', name: 'Duck Confit Risotto', price: 34, quantity: 2 },
      { menuItemId: 'm10', name: 'Aperol Spritz', price: 16, quantity: 2 },
      { menuItemId: 'm9', name: 'Tiramisu', price: 12, quantity: 1 },
    ],
  },
  {
    id: 't3', number: 3, customerName: 'Michael T.', memberId: '741852',
    seatedAt: NOW - 12 * 60 * 1000, status: 'open',
    orders: [
      { menuItemId: 'm2', name: 'Truffle Arancini', price: 16, quantity: 1 },
      { menuItemId: 'm10', name: 'Aperol Spritz', price: 16, quantity: 1 },
      { menuItemId: 'm12', name: 'Sparkling Water', price: 8, quantity: 2 },
    ],
  },
];

const INITIAL_CLOSED_TABLES: ClosedTable[] = [
  {
    id: 'ct1', number: 2, customerName: 'Alex J.', memberId: '384710',
    seatedAt: NOW - 145 * 60 * 1000, closedAt: NOW - 95 * 60 * 1000,
    tipAmount: 14.80, tipPercentage: 20,
    orders: [
      { menuItemId: 'm1', name: 'Burrata & Heirloom Tomato', price: 18, quantity: 1 },
      { menuItemId: 'm4', name: "Rigatoni all'Amatriciana", price: 28, quantity: 1 },
      { menuItemId: 'm11', name: 'House Red Wine', price: 14, quantity: 2 },
    ],
  },
  {
    id: 'ct2', number: 9, customerName: 'Riley S.', memberId: '203958',
    seatedAt: NOW - 135 * 60 * 1000, closedAt: NOW - 52 * 60 * 1000,
    tipAmount: 22.00, tipPercentage: 22,
    orders: [
      { menuItemId: 'm3', name: 'Beef Carpaccio', price: 22, quantity: 1 },
      { menuItemId: 'm6', name: 'Duck Confit Risotto', price: 34, quantity: 1 },
      { menuItemId: 'm9', name: 'Tiramisu', price: 12, quantity: 1 },
      { menuItemId: 'm10', name: 'Aperol Spritz', price: 16, quantity: 2 },
    ],
  },
  {
    id: 'ct3', number: 6, customerName: 'Jordan L.', memberId: '571038',
    seatedAt: NOW - 85 * 60 * 1000, closedAt: NOW - 18 * 60 * 1000,
    tipAmount: 10.40, tipPercentage: 20,
    orders: [
      { menuItemId: 'm2', name: 'Truffle Arancini', price: 16, quantity: 1 },
      { menuItemId: 'm4', name: "Rigatoni all'Amatriciana", price: 28, quantity: 1 },
      { menuItemId: 'm12', name: 'Sparkling Water', price: 8, quantity: 1 },
    ],
  },
];

type RestaurantContextType = {
  tables: RestaurantTable[];
  closedTables: ClosedTable[];
  menu: MenuItem[];
  notification: string | null;
  openNewTable: (memberId: string, customerName: string) => void;
  addItemsToTable: (tableId: string, items: TableOrder[]) => void;
  sendBill: (tableId: string) => void;
  simulatePayment: (tableId: string) => void;
  clearTable: (tableId: string) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  deleteMenuItem: (id: string) => void;
  setNotification: (msg: string | null) => void;
  resetDemoData: () => void;
};

const RestaurantContext = createContext<RestaurantContextType | null>(null);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [tables, setTables] = useState<RestaurantTable[]>(INITIAL_TABLES);
  const [closedTables, setClosedTables] = useState<ClosedTable[]>(INITIAL_CLOSED_TABLES);
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [notification, setNotification] = useState<string | null>(null);

  const openNewTable = (memberId: string, customerName: string) => {
    const maxNum = tables.reduce((m, t) => Math.max(m, t.number), 0);
    setTables((prev) => [
      ...prev,
      {
        id: `t${Date.now()}`,
        number: maxNum + 1,
        customerName,
        memberId,
        seatedAt: Date.now(),
        status: 'open',
        orders: [],
      },
    ]);
  };

  const addItemsToTable = (tableId: string, items: TableOrder[]) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        const updated = [...t.orders];
        items.forEach((newItem) => {
          const existing = updated.find((o) => o.menuItemId === newItem.menuItemId);
          if (existing) {
            existing.quantity += newItem.quantity;
          } else {
            updated.push({ ...newItem });
          }
        });
        return { ...t, orders: updated };
      }),
    );
  };

  const sendBill = (tableId: string) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status: 'bill_sent' } : t)),
    );
  };

  const simulatePayment = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;
    const sub = tableSubtotal(table.orders);
    const total = sub * (1 + TAX_RATE);
    const tip = sub * 0.2;
    const grandTotal = total + tip;
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? { ...t, status: 'paid', tipAmount: tip, tipPercentage: 20 }
          : t,
      ),
    );
    setNotification(`${table.customerName} just paid $${fmt(grandTotal)} — 20% tip`);
  };

  const clearTable = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table || table.tipAmount === undefined) return;
    const closed: ClosedTable = {
      id: table.id,
      number: table.number,
      customerName: table.customerName,
      memberId: table.memberId,
      orders: table.orders,
      seatedAt: table.seatedAt,
      closedAt: Date.now(),
      tipAmount: table.tipAmount,
      tipPercentage: table.tipPercentage ?? 0,
    };
    setClosedTables((prev) => [closed, ...prev]);
    setTables((prev) => prev.filter((t) => t.id !== tableId));
  };

  const resetDemoData = () => {
    const now = Date.now();
    setTables([
      {
        id: 't4', number: 4, customerName: 'Sarah M.', memberId: '847293',
        seatedAt: now - 45 * 60 * 1000, status: 'open',
        orders: [
          { menuItemId: 'm3', name: 'Beef Carpaccio', price: 22, quantity: 1 },
          { menuItemId: 'm4', name: "Rigatoni all'Amatriciana", price: 28, quantity: 1 },
          { menuItemId: 'm5', name: 'Branzino al Forno', price: 36, quantity: 1 },
          { menuItemId: 'm11', name: 'House Red Wine', price: 14, quantity: 2 },
        ],
      },
      {
        id: 't7', number: 7, customerName: 'Jack P.', memberId: '192847',
        seatedAt: now - 23 * 60 * 1000, status: 'open',
        orders: [
          { menuItemId: 'm4', name: "Rigatoni all'Amatriciana", price: 28, quantity: 1 },
          { menuItemId: 'm5', name: 'Branzino al Forno', price: 36, quantity: 1 },
          { menuItemId: 'm8', name: 'Crème Brûlée', price: 14, quantity: 1 },
        ],
      },
      {
        id: 't12', number: 12, customerName: 'Emma R.', memberId: '593104',
        seatedAt: now - 67 * 60 * 1000, status: 'open',
        orders: [
          { menuItemId: 'm1', name: 'Burrata & Heirloom Tomato', price: 18, quantity: 1 },
          { menuItemId: 'm2', name: 'Truffle Arancini', price: 16, quantity: 2 },
          { menuItemId: 'm6', name: 'Duck Confit Risotto', price: 34, quantity: 2 },
          { menuItemId: 'm10', name: 'Aperol Spritz', price: 16, quantity: 2 },
          { menuItemId: 'm9', name: 'Tiramisu', price: 12, quantity: 1 },
        ],
      },
      {
        id: 't3', number: 3, customerName: 'Michael T.', memberId: '741852',
        seatedAt: now - 12 * 60 * 1000, status: 'open',
        orders: [
          { menuItemId: 'm2', name: 'Truffle Arancini', price: 16, quantity: 1 },
          { menuItemId: 'm10', name: 'Aperol Spritz', price: 16, quantity: 1 },
          { menuItemId: 'm12', name: 'Sparkling Water', price: 8, quantity: 2 },
        ],
      },
    ]);
    setClosedTables([
      {
        id: 'ct1', number: 2, customerName: 'Alex J.', memberId: '384710',
        seatedAt: now - 145 * 60 * 1000, closedAt: now - 95 * 60 * 1000,
        tipAmount: 14.80, tipPercentage: 20,
        orders: [
          { menuItemId: 'm1', name: 'Burrata & Heirloom Tomato', price: 18, quantity: 1 },
          { menuItemId: 'm4', name: "Rigatoni all'Amatriciana", price: 28, quantity: 1 },
          { menuItemId: 'm11', name: 'House Red Wine', price: 14, quantity: 2 },
        ],
      },
      {
        id: 'ct2', number: 9, customerName: 'Riley S.', memberId: '203958',
        seatedAt: now - 135 * 60 * 1000, closedAt: now - 52 * 60 * 1000,
        tipAmount: 22.00, tipPercentage: 22,
        orders: [
          { menuItemId: 'm3', name: 'Beef Carpaccio', price: 22, quantity: 1 },
          { menuItemId: 'm6', name: 'Duck Confit Risotto', price: 34, quantity: 1 },
          { menuItemId: 'm9', name: 'Tiramisu', price: 12, quantity: 1 },
          { menuItemId: 'm10', name: 'Aperol Spritz', price: 16, quantity: 2 },
        ],
      },
      {
        id: 'ct3', number: 6, customerName: 'Jordan L.', memberId: '571038',
        seatedAt: now - 85 * 60 * 1000, closedAt: now - 18 * 60 * 1000,
        tipAmount: 10.40, tipPercentage: 20,
        orders: [
          { menuItemId: 'm2', name: 'Truffle Arancini', price: 16, quantity: 1 },
          { menuItemId: 'm4', name: "Rigatoni all'Amatriciana", price: 28, quantity: 1 },
          { menuItemId: 'm12', name: 'Sparkling Water', price: 8, quantity: 1 },
        ],
      },
    ]);
    setMenu([...INITIAL_MENU]);
    setNotification(null);
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    setMenu((prev) => [...prev, { ...item, id: `m${Date.now()}` }]);
  };

  const deleteMenuItem = (id: string) => {
    setMenu((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <RestaurantContext.Provider
      value={{
        tables,
        closedTables,
        menu,
        notification,
        openNewTable,
        addItemsToTable,
        sendBill,
        simulatePayment,
        clearTable,
        addMenuItem,
        deleteMenuItem,
        setNotification,
        resetDemoData,
      }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const ctx = useContext(RestaurantContext);
  if (!ctx) throw new Error('useRestaurant must be used within RestaurantProvider');
  return ctx;
}
