# 🌌 VexaNode — Premium Cloud & Game Hosting Platform

VexaNode is a modern, ultra-high-performance cloud and game hosting storefront and dashboard. Featuring a premium glassmorphic dark design system, VexaNode is engineered for lightning-fast speeds, responsive navigation, and secure credential handling.

---

## 🎨 Design Theme & Core Features
- **Unified Branding system**: Tailored around VexaNode's signature brand blue `#228dbd` and dark-frosted glassmorphic panels.
- **Floating Header Navigation**: Enhanced dropdowns and mega-menus with top-edge lighting gradients and animated chevrons.
- **Overhauled Authentication**: Dual support for passwordless OAuth (Google & Discord) alongside email/password credentials.
- **Interactive Forms**: Visually compact Login and Registration screens with password visibility toggles and real-time password strength indicators.
- **Support Ticket Engine**: Real-time customer support ticket management and system status indicators.
- **Scalable Hosting Types**: Seamless location, hosting, and billing-frequency calculators for Game servers, Lavalink VPS nodes, and Domain registration.

---

## 🛠️ Technology Stack
- **Framework**: Next.js (App Router) & React 19
- **Database**: Supabase (PostgreSQL with custom functions & triggers)
- **Authentication**: NextAuth.js (JWT Strategy) with `bcryptjs` hashing
- **Animation**: Framer Motion & CSS keyframe micro-animations
- **Styling**: Vanilla CSS & TailwindCSS
- **Server Management**: PM2 process runner and Nginx reverse proxies

---

## 📂 Project Structure

| Directory/File | Purpose |
|----------------|---------|
| `/app/api/auth/` | NextAuth integration router & custom registration handlers |
| `/app/components/` | Reusable UI compartments (Navbar, HeroSection, FAQ, Footer) |
| `/app/config/sections/` | JSON-driven static configuration blocks (`hero.json`, `navigation.json`) |
| `/app/dashboard/` | Core user control panel (Services, Invoices, Ticket Support) |
| `/lib/` | Supabase initialization clients, database methods, and utility files |
| `/types/` | Global TypeScript models and schema definitions |
| `setup_database.sql` | Supabase database tables schema definitions |

---

## 🔑 Database Migration
To enable email/password credentials alongside OAuth, ensure the `users` table has a `password` field. Execute the following SQL statement in your Supabase SQL editor:
```sql
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password text;
```

---

## ⚙️ Environment Configuration (`.env.local`)
Create a `.env.local` file in the root directory and define the following keys:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

# NextAuth Configuration
NEXTAUTH_SECRET="your_nextauth_jwt_secret"
NEXTAUTH_URL="http://localhost:3000"

# Discord OAuth Provider
DISCORD_CLIENT_ID="your_discord_client_id"
DISCORD_CLIENT_SECRET="your_discord_client_secret"

# Google OAuth Provider
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

---

## 🚀 Getting Started

### 1. Installation
Staging dependencies and installing packages:
```bash
npm install
```

### 2. Launching in Development
Run the local Next.js compiler in Turbopack mode:
```bash
npm run dev
```

### 3. Production Compilation
Compile the code and verify pre-render optimization states:
```bash
npm run build
```

---

## 👥 Project Contributors

We appreciate all contributions that make VexaNode possible!

- **Ayushisingh09** ([GitHub Profile](https://github.com/Ayushisingh09)) — Core developer, dashboard refactoring, database setup, and user interface customization.
- **titanxdevz** ([GitHub Profile](https://github.com/titanxdevz)) — Original repository creator and infrastructure engineer.