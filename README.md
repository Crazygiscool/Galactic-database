# Galactic Database
[![wakatime](https://wakatime.com/badge/user/94726172-a5c4-4c20-b247-f01d1fc63010/project/cf5531a1-dbd9-4713-bd65-9e9dc7ff203e.svg)](https://wakatime.com/badge/user/94726172-a5c4-4c20-b247-f01d1fc63010/project/cf5531a1-dbd9-4713-bd65-9e9dc7ff203e)

Interactive Star Wars galaxy map with an Imperial Terminal aesthetic.

<img width="1366" height="687" alt="Screenshot_2026-05-23_21-59-11" src="https://github.com/user-attachments/assets/31b91f5b-8116-4339-9479-37f84050aa52" />

## Stack

- **Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS
- **UI**: Radix UI components, Framer Motion
- **Data**: SWAPI.dev API (Star Wars)
- **Package Manager**: pnpm

## Features

- Interactive pan/zoom galaxy map with 60+ Star Wars planets
- Glowing cyan planet markers on deep space background with starfield
- Planet detail panel showing climate, terrain, population, diameter, gravity, orbital period
- Residents panel fetches character names from SWAPI
- Imperial Terminal aesthetic: Share Tech Mono font, glowing cyan/blue text on black, scanlines
- Terminal-style loading screen with typewriter text effects

## Getting Started

```bash
pnpm install
pnpm run dev
```

## Build

```bash
pnpm run build
```

## Deploy

```bash
vercel --prod
```
