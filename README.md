# Galactic Database

Interactive Star Wars galaxy map with an Imperial Terminal aesthetic.

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
