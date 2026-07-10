import React, { createContext, useContext, useState } from 'react';

export type CardType = 'visa' | 'mastercard' | 'amex' | 'unknown';

export type Card = {
  id: string;
  last4: string;
  type: CardType;
  cardholderName: string;
  expiry: string;
};

type PaymentContextType = {
  cards: Card[];
  addCard: (card: Omit<Card, 'id'>) => void;
};

const PaymentContext = createContext<PaymentContextType | null>(null);

const INITIAL_CARDS: Card[] = [
  {
    id: 'mock-1',
    last4: '4242',
    type: 'visa',
    cardholderName: 'John Doe',
    expiry: '12/26',
  },
];

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);

  const addCard = (card: Omit<Card, 'id'>) => {
    setCards((prev) => [...prev, { ...card, id: String(prev.length + 1) }]);
  };

  return (
    <PaymentContext.Provider value={{ cards, addCard }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error('usePayment must be used within PaymentProvider');
  return ctx;
}

export function detectCardType(digits: string): CardType {
  if (/^4/.test(digits)) return 'visa';
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  return 'unknown';
}
