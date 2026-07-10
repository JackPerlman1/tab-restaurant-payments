# Tab

A full-stack mobile app that reimagines the restaurant payment experience — letting customers pay, tip, and split the bill directly from their phone, while giving restaurants a live dashboard to manage every table in real time.

---

## The Problem

Paying at a restaurant is still stuck in the past. You wait for the check, hand over a card, wait again, scribble a tip, and do the math yourself. Splitting with friends means separate checks, awkward apps, and someone always ends up covering more than they should.

Tab replaces all of that. The restaurant sends the bill to your phone the moment you're ready. You choose your tip, pay in two taps, or split instantly with anyone at the table — no cash, no confusion, no waiting.

---

## Screenshots

> *Customer side*

| Home | Active Tab | Tip & Pay | Split |
|------|------------|-----------|-------|
| ![home](screenshots/customer-home.png) | ![tab](screenshots/customer-active-tab.png) | ![pay](screenshots/customer-tip-payment.png) | ![split](screenshots/customer-split.png) |

| Payment Success | Past Meals | Meal Detail | Settings |
|----------------|------------|-------------|----------|
| ![success](screenshots/customer-payment-success.png) | ![meals](screenshots/customer-past-meals.png) | ![detail](screenshots/customer-meal-detail.png) | ![settings](screenshots/customer-settings.png) |

> *Restaurant side*

| Dashboard | Tables | Table Detail | Closed Tables |
|-----------|--------|--------------|---------------|
| ![dashboard](screenshots/restaurant-dashboard.png) | ![tables](screenshots/restaurant-tables.png) | ![detail](screenshots/restaurant-table-detail.png) | ![closed](screenshots/restaurant-closed-tables.png) |

| Menu | Receipt | Settings |
|------|---------|----------|
| ![menu](screenshots/restaurant-menu.png) | ![receipt](screenshots/restaurant-receipt.png) | ![settings](screenshots/restaurant-settings.png) |

---

## Features

### Customer

- **Pay from your phone** — receive the bill instantly, choose a tip percentage, and pay in two taps
- **Split the check** — invite friends at the table to split the bill evenly; the tab closes automatically once everyone pays
- **Payment confirmation** — animated success screen with confetti on every completed payment
- **Past Meals** — full history of every visit with itemized receipts and a badge marking split meals
- **Payment methods** — save and manage cards with a Face ID / Touch ID authentication gate
- **Guided onboarding** — illustrated walkthrough on first launch

### Restaurant

- **Live table dashboard** — see every active table, its status (open / bill sent / paid), elapsed time, and running total at a glance
- **Insights panel** — tip averages by day of week, peak hour traffic bars, and a highlight card benchmarking your tips against the industry average
- **Table management** — open a new tab by looking up a customer's 6-digit member ID, add menu items mid-meal, send the bill to their phone, and close the table after payment
- **Closed Tables history** — segmented Active / Closed toggle; completed tables show customer name, tip percentage, grand total, and close time; tap any row for a full itemized receipt
- **Menu editor** — add and remove items by category (starters, mains, desserts, drinks) with an inline form
- **Real-time notifications** — in-app banner fires the moment a customer pays
- **Profile settings** — edit restaurant name, address, cuisine type, and owner info inline

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Expo](https://expo.dev) SDK 56 |
| Language | TypeScript 6 |
| UI | React Native 0.85 · React 19 |
| Navigation | Expo Router v4 (file-based routing, typed params) |
| Animations | React Native Reanimated 4 (`FadeInDown`, `withSpring`, custom `PressableScale`) |
| Haptics | `expo-haptics` — impact and notification feedback on all key interactions |
| Icons | `expo-symbols` (SF Symbols on iOS with Android fallbacks) |
| State | React Context (`AuthContext`, `TabContext`, `RestaurantContext`, `PaymentContext`) |
| Auth guard | `useSegments` + `router.dismissAll()` — clears the stack on logout with no back-navigation escape |

---

## Project Structure

```
src/
├── app/
│   ├── (customer-tabs)/        # Bottom tab navigator — customer
│   │   ├── index.tsx           # Home
│   │   ├── active-tab.tsx      # Live tab view
│   │   ├── past-meals.tsx      # Meal history
│   │   └── settings.tsx
│   ├── (restaurant-tabs)/      # Bottom tab navigator — restaurant
│   │   ├── index.tsx           # Dashboard + Insights
│   │   ├── tables.tsx          # Active / Closed segmented view
│   │   ├── menu.tsx            # Menu editor
│   │   └── settings.tsx
│   ├── customer/               # Stack screens — customer flows
│   │   ├── tip-payment.tsx
│   │   ├── split.tsx
│   │   ├── split-waiting.tsx
│   │   ├── payment-success.tsx
│   │   └── meal/[id].tsx
│   └── restaurant/             # Stack screens — restaurant flows
│       ├── table/[id].tsx
│       ├── closed-table/[id].tsx
│       └── add-to-table/[tableId].tsx
├── context/
│   ├── auth.tsx
│   ├── tab.tsx
│   ├── restaurant.tsx
│   └── payment.tsx
├── components/
│   ├── pressable-scale.tsx
│   ├── onboarding.tsx
│   └── card-brand.tsx
└── utils/
    └── demo.ts
```

---

## Getting Started

**Prerequisites:** Node.js 18+, Expo CLI, iOS Simulator or physical device

```bash
# Install dependencies
npm install

# Start the dev server
npm start

# Run on iOS simulator
npm run ios
```

On first launch, choose **I'm a Customer** or **I'm a Restaurant** from the welcome screen. The app ships with realistic seed data — active tables, a full menu, closed table history, and past meals — so every feature is demonstrable immediately without a backend.

---

## Design

Tab uses a unified dark navy design system (`#0B1426` base, `#1A2B4A` cards) across both sides of the app. Interactive elements use spring-physics animations and haptic feedback on every meaningful action. All layouts are safe-area aware and tested across iPhone sizes.

---

*Built with [Expo](https://expo.dev) · [React Native](https://reactnative.dev) · TypeScript*
