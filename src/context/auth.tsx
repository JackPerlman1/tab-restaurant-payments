import React, { createContext, useContext, useState } from 'react';

type CustomerUser = {
  type: 'customer';
  name: string;
  email: string;
};

type RestaurantUser = {
  type: 'restaurant';
  restaurantName: string;
  address: string;
  ownerName: string;
  email: string;
};

export type User = CustomerUser | RestaurantUser | null;

type AuthContextType = {
  user: User;
  customerLogin: (email: string, password: string) => void;
  customerSignup: (name: string, email: string, password: string) => void;
  restaurantLogin: (email: string, password: string) => void;
  restaurantSignup: (
    restaurantName: string,
    address: string,
    ownerName: string,
    email: string,
    password: string,
  ) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  const customerLogin = (email: string, _password: string) => {
    const raw = email.split('@')[0].replace(/[._-]/g, ' ');
    const name = raw
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    setUser({ type: 'customer', name, email });
  };

  const customerSignup = (name: string, email: string, _password: string) => {
    setUser({ type: 'customer', name, email });
  };

  const restaurantLogin = (email: string, _password: string) => {
    const raw = email.split('@')[0].replace(/[._-]/g, ' ');
    const restaurantName = raw
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    setUser({ type: 'restaurant', restaurantName, address: '', ownerName: '', email });
  };

  const restaurantSignup = (
    restaurantName: string,
    address: string,
    ownerName: string,
    email: string,
    _password: string,
  ) => {
    setUser({ type: 'restaurant', restaurantName, address, ownerName, email });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ user, customerLogin, customerSignup, restaurantLogin, restaurantSignup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
