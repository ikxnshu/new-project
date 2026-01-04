# DummyJSON Admin (Next.js + NextAuth + Zustand + MUI)

A demo admin panel that uses DummyJSON for authentication, users, and products. Built with Next.js, NextAuth (Credentials provider), Zustand for state & caching, and Material-UI.

Features
- Admin login (NextAuth + DummyJSON)
- Dashboard, protected routes
- Users list with pagination and search
- Single user detail page
- Products list with pagination, search, and category filter
- Single product detail page with image gallery
- Zustand store with async actions and client-side caching (persisted)
- Performance optimizations: React.memo, useCallback/useMemo, API-side pagination

Why Zustand?
- Minimal boilerplate, small bundle footprint.
- Clean async actions support and easy to persist to localStorage.
- For small-to-medium apps it's faster to iterate with Zustand than Redux.

Caching strategy
- Query results (users/products) are cached in-memory keyed by the request (q,limit,skip,category).
- The whole store is persisted to localStorage via zustand's `persist` middleware to avoid refetch on navigation.
- Cache invalidation hooks: pass `force: true` to refetch actions to bypass cache; TTL could be added.

Setup

1. Install
   npm install

2. Run dev
   npm run dev

3. Default sample credentials (DummyJSON test user):
   - username: kminchelle
   - password: 0lelplR

Environment
- NEXTAUTH_SECRET: recommended for production. For local dev you can leave unset.

Notes / Next steps
- Add cache TTL and better invalidation.
- Replace simple image gallery with a carousel component.
- Add server-side fetching for detail pages if SEO matters.
- Add role-based auth if required.
