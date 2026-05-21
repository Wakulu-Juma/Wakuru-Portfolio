# Wakuru Juma Gilagali Portfolio

Next.js portfolio and admin dashboard built around the existing Wakuru content, with Tailwind CSS, Framer Motion, and a modular App Router structure.

## Features
- Public portfolio sections for hero, about, skills, projects, and contact
- Admin dashboard scaffold for login, content editing, CRUD management, and inactivity logout handling
- Dark glassmorphism UI with animated gradients and section reveals
- API helper that can target the backend with bearer tokens for admin routes

## Getting Started

Install dependencies:
```
npm install
```

Run the development server:
```
npm run dev
```

Build for production:
```
npm run build
```

Preview the production build:
```
npm run preview
```

## Project Structure
- `app/` contains the Next.js routes, layout, and admin dashboard
- `src/components/` preserves the current portfolio sections and motion-driven UI
- `src/api.js` handles backend requests
- `app/globals.css` contains the Tailwind layers and shared styles

## Customization
- Update backend URLs in `src/api.js` or via `NEXT_PUBLIC_API_URL`
- Replace project and profile data in the component files or move it into backend-driven content
- Extend `app/admin/page.js` and the backend scaffold to wire real auth and CRUD flows
