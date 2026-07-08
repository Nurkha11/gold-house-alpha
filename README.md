# Gold House Alpha

Gold House Alpha is a React Native + Expo MVP for a premium real estate assistant.

The app is not a listing board clone. It is a prototype of an AI-style property assistant: the buyer answers a short onboarding flow, rates apartments, and then receives personal recommendations with explanations, viewing time, detailed property pages, media, trust signals, and booking flow.

The project also includes an owner cabinet where property owners can submit apartments for review. The owner flow supports login mock, listing submission, photo/video mock uploads, preview, draft saving, and submitted status for future admin review.

## Features

- Buyer onboarding: city, district, budget, rooms, floor preference.
- AI training flow: user rates apartments before personal recommendations are shown.
- Property details: gallery, video cards, AI summary, Gold Verified, Trust Index, pros and cons, full characteristics.
- Viewing request flow with date/time selection.
- Owner cabinet with mock login.
- Full owner submission form:
  - address;
  - main characteristics;
  - price and terms;
  - repair and condition;
  - furniture and appliances;
  - owner description;
  - photos;
  - videos;
  - listing preview;
  - submission confirmation.
- Standalone browser preview in `outputs/gold-house-computer-preview.html`.

## Tech

- React Native
- Expo
- Expo Router
- TypeScript
- Local TypeScript data only, no backend
- Mock AI logic through local state

## Run

Install dependencies:

```bash
pnpm install
```

Start Expo:

```bash
pnpm start
```

Start web:

```bash
pnpm web
```

Type-check:

```bash
pnpm typecheck
```

## Standalone Preview

Open this file directly in a browser:

```text
outputs/gold-house-computer-preview.html
```

This preview is useful for quickly testing the buyer flow and owner cabinet without running Expo.
