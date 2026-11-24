# Galactic Database → Star Wars Fandom Platform: Refactor Plan

## Vision
Transform the read-only encyclopedia into a **community-driven fandom platform** with authentication, user-generated content, social features, and personalized experiences — preserving the Imperial Terminal aesthetic.

---

## Phase 1: Authentication & User Foundation (Weeks 1-2)

### Auth Infrastructure
- **Provider**: Better Auth (TypeScript-first, works with Vite/React)
  - Email/password + OAuth (GitHub, Google, Discord)
  - Session management with HTTP-only cookies
  - Built-in 2FA, passkeys
- **Database**: Add `users`, `sessions`, `accounts`, `verifications` tables to Drizzle
- **Integration**: Wrap app with `AuthProvider`, protect API routes

### User Profiles
- `user_profiles`: username, display_name, bio, avatar, banner, faction (Jedi/Sith/Rebel/Empire/Mandalorian/Neutral), join_date, stats
- Profile page: `/u/:username` with tabs: Activity, Favorites, Reviews, Collections, Followers
- Faction selection affects UI theme

### Migration
- Keep anonymous `custom_planets`/`custom_films` data
- Add `user_id` FK to link existing data to accounts on claim
- "Claim your data" flow on first login

---

## Phase 2: Social Layer & Content (Weeks 3-4)

### Reviews & Ratings (upgrade from custom data)
- `reviews`: entity_type, entity_id, user_id, rating, title, content (TipTap rich text), tags, spoilers, helpful_count
- Entity types: planet, film, character, starship, vehicle, species, location, organization
- Threaded replies, helpful votes, aggregate into existing custom tables

### Posts & Microblogging
- `posts`: content, media_urls, entity_references (tag planets/characters/films), visibility, thread_id
- Types: text, image, video, poll, "theory", "fan-art", "lore-question"
- Feed: algorithmic (following + interests) + chronological

### Collections (curated lists)
- `collections` + `collection_items`: "My Favorite Outer Rim Planets", "Clone Wars Watch Order"
- Social: fork, collaborate, feature on profile

### Follows & Activity Feed
- `follows`, `activities` (review, post, collection, favorite, follow, milestone)
- `/feed` (following), `/explore` (trending), notifications bell

---

## Phase 3: Enhanced Discovery & Personalization (Weeks 5-6)

- **Smart recommendations**: Collaborative filtering + content-based (favorites, ratings, views, faction, follows)
- **Advanced search**: Command palette (⌘K), filters by era/region/faction/species/affiliation, saved searches with alerts
- **Personalized galaxy map**: Toggle layers (favorites, visited, want-to-visit, faction control), exploration % by region, pinned notes
- **Personal timeline**: Mark events watched/read/played, filter by canon/legends/media type, progress tracking

---

## Phase 4: Community Features (Weeks 7-8)

- **Groups/Cantinas**: Public/private/faction-locked, announcements, events, shared collections, leaderboards
- **Events/Watch parties**: Film premieres, lore discussions, trivia, RP sessions; calendar sync, Discord/Watch2Gether embed
- **Gamification**: Badges ("Outer Rim Explorer", "Lore Master"), XP/levels, leaderboards, profile titles ("Grand Admiral", "Jedi Archivist")
- **Moderation**: Reports, shadowban/silence/ban, Perspective API auto-mod, Discourse-style trust levels

---

## Phase 5: Content Expansion & Integrations (Weeks 9-10)

- **Expanded entities**: Books, comics, games, TV episodes, audio dramas via SWAPI/Wookieepedia/custom curation
- **Rich media**: Vercel Blob/Cloudinary for images, embed YouTube/Vimeo/Twitter/TikTok, podcast players
- **External integrations**: Discord bot, Letterboxd/Goodreads/Steam import, Notion/Obsidian export
- **Public API**: Rate-limited, OAuth scopes, webhooks, TypeScript SDK

---

## Phase 6: Polish & Scale (Weeks 11-12)

- **Performance**: React Query optimization, virtualization (react-window), code splitting, edge caching
- **Accessibility**: Semantic HTML, keyboard nav, screen readers, WCAG AA, prefers-reduced-motion
- **Mobile/PWA**: Touch-friendly map, swipe gestures, bottom sheets, offline draft queue, install prompt
- **Observability**: PostHog/Mixpanel, Sentry, Vercel Analytics, feature flags

---

## Database Schema Additions (Key Tables)

```typescript
// Auth (Better Auth managed)
users, sessions, accounts, verifications

// Profiles
user_profiles: user_id, username, display_name, bio, avatar_url, banner_url, 
               faction, join_date, xp, level, title_id, settings_json

// Social
follows, blocks

// Content
reviews: entity_type, entity_id, user_id, rating, title, content_html, 
         tags, has_spoilers, helpful_count, reply_count
review_replies, review_votes

posts: user_id, content_html, media_urls, entity_refs, visibility, 
       thread_id, reply_count, like_count
post_likes, post_reposts

collections, collection_items

// Groups
groups: name, slug, description, faction, privacy, owner_id, member_count
group_members, group_posts

// Activity & Notifications
activities, notifications

// Gamification
badges, user_badges, user_stats

// Events
events, event_attendees

// Media
media_entries (film/series/book/game/comic/audio), user_media
```

---

## Technical Architecture

| Layer | Choice | Rationale |
|-------|--------|-----------|
| State | TanStack Query + Zustand | Server/client separation |
| Forms | React Hook Form + Zod | Shared schemas with API |
| Rich Text | TipTap | Collaborative-ready, headless |
| Real-time | Socket.io / Pusher / Ably | Notifications, presence |
| Routing | Wouter (keep) or TanStack Router | Type-safe nested layouts |
| Backend | Vercel Functions + Upstash Redis → Hono on Fly.io | Start serverless, migrate for WebSockets |
| Database | Neon / Supabase | Serverless PG, branching, realtime |
| Search | Fuse.js → Meilisearch | Client-side → full-text |
| Storage | Vercel Blob / Cloudinary | Integrated, transformations |

---

## Immediate UX Improvements (No Auth Required)

1. **Map**: Region legend toggle, distance ruler, coordinate copy, "Jump to" palette (⌘J), bookmark planets (localStorage)
2. **Detail Panels**: Keyboard nav (←/→), "Copy link", "Export as Imperial Dossier" PDF
3. **Search**: Fuzzy with highlighting, recent/trending, entity-type filters
4. **Timeline**: Filter by era/media/canon, "Mark watched/read" (localStorage), progress bars
5. **Performance**: Virtualize DatabankList, lazy images with blur placeholders, prefetch adjacent panels

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Auth complexity | Better Auth (battle-tested) |
| Real-time scaling | Polling + SSE first, WebSockets later |
| Content moderation | Community reports + Perspective API + trust levels |
| Data migration | Scripts to backfill SWAPI/Databank |
| SEO for UGC | Vercel ISR for profile/collection/review pages |
| Mobile map perf | Canvas → WebGL (PixiJS) if needed |

---

## Next Steps

1. **Confirm direction** — Review/prioritize phases
2. **Set up auth** — Add Better Auth, user schema, test flows
3. **Schema migration** — Add tables, run `pnpm --filter db push`
4. **API routes** — Protect custom API, add review/posts endpoints
5. **UI components** — Auth forms, profile page, review editor, feed
6. **Iterate** — Ship Phase 1 to staging, gather feedback

---

*This plan delivers standalone value per phase and can be shipped independently. Each layer builds toward the fandom platform vision while keeping the Imperial Terminal identity intact.*