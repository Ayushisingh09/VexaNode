# 🌌 VexaNode — Premium Game & Cloud Hosting Portal

VexaNode is an enterprise-grade, high-performance web hosting storefront, customer portal, and billing platform. Engineered with a state-of-the-art glassmorphic dark-theme design system, VexaNode offers users an interactive, low-latency interface to provision game servers, deploy virtual private servers (VPS), register domains, and manage client infrastructure.

---

## 📖 Table of Contents
1. [Key Features](#-key-features)
2. [Project Architecture](#-project-architecture)
3. [Database Schema & Migrations](#-database-schema--migrations)
4. [API Route Registry](#-api-route-registry)
5. [Environment Variables Reference](#-environment-variables-reference)
6. [Getting Started (Local Development)](#-getting-started-local-development)
7. [Production Deployment Guides](#-production-deployment-guides)
8. [Advanced Optimization & Security Guidelines](#-advanced-optimization--security-guidelines)
9. [Contributors](#-contributors)

---

## 🚀 Key Features

### 💻 storefront & Landing Pages
- **Interactive Landing Page**: Includes floating particle effects, a locations ping list, glowing accordions, and currency selectors.
- **Billing Frequency Calculator**: Live toggle switching between Monthly and Annual plans with automatic math and 10% discount processing.
- **VPS Deployment Shop**: Location selector dropdowns, CPU toggle selectors, and plan detail configurations.
- **Lavalink & Game Servers Portal**: Neon-shadowed specs cards with hardware tiers (e.g. Ryzen 9, NVMe SSDs, DDoS Protection).
- **Domains Checker**: Frosted search consoles connecting to domain availability APIs.

### 🔑 Advanced Authentication Overhaul
- **NextAuth Integration**: JWT-based session strategy combining social OAuth with local user directories.
- **Multiple Providers**: Connect using Google, Discord, or Email & Password Credentials.
- **Bcrypt Encryption**: Hashing user passwords using Salt rounds (10) for maximum credentials safety.
- **Modern Login & Register UI**: Compact glass cards, eye masking toggles, dynamic checklist constraints, and custom remember checkboxes.

### 📊 Client Console & Billing Portal
- **Dashboard Overview**: Access active orders, service metrics, and pending invoices.
- **Support Ticket Engine**: Create ticket items, track priority states, and exchange real-time support replies.
- **Manual Payment Verification**: Upload transaction proof receipts to Supabase storage buckets for operator checkups.

### 🛡️ Administrator Panel
- **Global Overview**: View user lists, system sales metrics, and active support tickets.
- **Configuration Management**: Edit currency exchanges, toggle storefront templates, and adjust discount tiers from a live dashboard.

---

## 📂 Project Architecture

```
VexaNode/
├── app/
│   ├── about/              # About us page
│   ├── affiliates/         # Affiliate referral panel
│   ├── api/                # Core backend API endpoints
│   │   ├── admin/          # Admin config, action, and data controllers
│   │   ├── auth/           # OAuth config and user registration endpoint
│   │   ├── domains/        # Domain check availability route
│   │   ├── lavalink/       # Lavalink stats fetcher
│   │   ├── orders/         # Client order submission
│   │   ├── payments/       # Cashfree gateways configurations
│   │   ├── tickets/        # Ticket management and replies
│   │   └── user/           # Current session profile retriever
│   ├── aup/                # Acceptable Use Policy page
│   ├── blogs/              # Markdown blogs and news lists
│   ├── components/         # Reusable styling blocks (Navbar, FAQSection, PricingSection)
│   ├── config/             # Theme variables and navigation mappings
│   ├── contact/            # Customer contact page
│   ├── dashboard/          # Private customer console routes
│   ├── databases/          # Database service offerings page
│   ├── dedicated/          # Dedicated servers page
│   ├── discord/            # Discord integration page
│   ├── docs/               # User guides and documentation
│   ├── domains/            # Domains search and checkout routes
│   ├── fup/                # Fair Use Policy page
│   ├── games/              # Game server list page
│   ├── lavalink/           # Lavalink page
│   ├── login/              # Sign In page
│   ├── partners/           # Sponsorship panel
│   ├── privacy-policy/     # Privacy policies page
│   ├── register/           # Sign Up page
│   ├── refund-policy/      # Refund terms page
│   ├── sla/                # Service Level Agreement policies
│   ├── team/               # Staff and leadership index
│   ├── terms-of-services/  # Terms of services page
│   ├── vps/                # Virtual Private Server tiers page
│   └── webhosting/         # Webhosting tiers page
├── lib/                    # Supabase client helpers & database query methods
├── public/                 # Static assets (logos, partner banners, images)
├── types/                  # TypeScript interface definitions
└── setup_database.sql      # Supabase database schema setup script
```

---

## 🗄️ Database Schema & Migrations

VexaNode stores data in a Supabase PostgreSQL instance using the `public` schema. Run this script in your Supabase SQL Editor to prepare your tables:

```sql
-- 1. NextAuth Core Tables
CREATE TABLE IF NOT EXISTS public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text,
  email text,
  "emailVerified" timestamp with time zone,
  image text,
  password text, -- Added for Credentials hashing
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_email_key UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS public.accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type text NOT NULL,
  provider text NOT NULL,
  "providerAccountId" text NOT NULL,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  "userId" uuid NOT NULL,
  CONSTRAINT accounts_pkey PRIMARY KEY (id),
  CONSTRAINT accounts_user_id_fkey FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  expires timestamp with time zone NOT NULL,
  "sessionToken" text NOT NULL,
  "userId" uuid NOT NULL,
  CONSTRAINT sessions_pkey PRIMARY KEY (id),
  CONSTRAINT sessions_session_token_key UNIQUE ("sessionToken"),
  CONSTRAINT sessions_user_id_fkey FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.verification_tokens (
  identifier text NOT NULL,
  token text NOT NULL,
  expires timestamp with time zone NOT NULL,
  CONSTRAINT verification_tokens_pkey PRIMARY KEY (identifier, token)
);

-- 2. VexaNode Application Tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  name text,
  email text,
  status text DEFAULT 'Active',
  is_admin boolean DEFAULT false,
  joined_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  user_name text,
  plan_name text,
  amount text,
  status text DEFAULT 'Pending',
  proof_url text,
  expiry_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.tickets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subject text,
  message text,
  status text DEFAULT 'Open',
  priority text DEFAULT 'Normal',
  type text DEFAULT 'Support',
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tickets_pkey PRIMARY KEY (id),
  CONSTRAINT tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.ticket_replies (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL,
  user_id uuid NOT NULL,
  message text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ticket_replies_pkey PRIMARY KEY (id),
  CONSTRAINT ticket_replies_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE,
  CONSTRAINT ticket_replies_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.settings (
  key text NOT NULL PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Automatic Triggers
-- Creates a profile automatically when a user logs in for the first time
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (new.id, new.name, new.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON public.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 📡 API Route Registry

All API routes are implemented in Next.js Edge-compatible route handlers under `/app/api/`:

| Route | Method | Description | Security |
|-------|--------|-------------|----------|
| `/api/auth/register` | `POST` | Creates a new credentials-based user. Hashes password with `bcryptjs`. | Public |
| `/api/user/data` | `GET` | Fetches active orders and profile settings for the logged-in session. | Session JWT |
| `/api/orders/create` | `POST` | Submits a new host service transaction plan. | Session JWT |
| `/api/tickets` | `GET`, `POST` | Retrieves customer tickets or creates a new support query ticket. | Session JWT |
| `/api/tickets/[id]` | `GET` | Fetches details and logs for a single support ticket. | Session JWT |
| `/api/tickets/[id]/reply` | `POST` | Appends a customer or operator answer reply log to the ticket. | Session JWT |
| `/api/admin/data` | `GET` | Pulls statistics, transaction volumes, user directories, and ticket queue. | Admin Role |
| `/api/admin/settings` | `POST` | Updates global dashboard toggles and currency factors. | Admin Role |
| `/api/domains/check` | `GET` | Connects to domain availability checkers. | Public |

---

## ⚙️ Environment Variables Reference

Create a `.env.local` file in the root directory:

```env
# 1. Supabase Configurations (Database Service Role Client)
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-service-key"

# 2. NextAuth Configuration
NEXTAUTH_SECRET="your-32-character-secret-jwt-key"
NEXTAUTH_URL="http://localhost:3000"

# 3. Discord OAuth Integration
DISCORD_CLIENT_ID="your-discord-application-client-id"
DISCORD_CLIENT_SECRET="your-discord-application-client-secret"

# 4. Google OAuth Integration
GOOGLE_CLIENT_ID="your-google-api-client-id"
GOOGLE_CLIENT_SECRET="your-google-api-client-secret"
```

---

## 💻 Getting Started (Local Development)

### Prerequisites
Make sure you have Node.js (v18+) and npm installed on your system.

### 1. Installation
Clone your repository and install project packages:
```bash
git clone https://github.com/Ayushisingh09/VexaNode.git
cd VexaNode
npm install
```

### 2. Run Local Development Server
Execute Next.js dev server:
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

### 3. Production Build
Verify code compilation, type safety, and asset routing:
```bash
npm run build
```

---

## 🌍 Production Deployment Guides

### ☁️ Vercel Deployment (Recommended)
1. **GitHub Sync**: Connect your Vercel account to your GitHub repository.
2. **Framework Detection**: Vercel automatically detects the Next.js presets.
3. **Environment Keys**: Input all values listed in the `.env.local` section into Vercel Settings -> Environment Variables.
4. **Deploy**: Click Deploy. Vercel provisions static routes, edge functions, and automatically secures free SSL certificates.

### ⚙️ Self-Hosting (PM2 + Nginx Reverse Proxy)

#### 1. Start Server with PM2
Ensure PM2 is installed globally (`npm install -g pm2`), compile the Next.js application, and launch the daemon process:
```bash
npm run build
pm2 start npm --name "vexa-node" -- start
```

#### 2. Configure Nginx Proxy
Create an Nginx configuration file (`/etc/nginx/sites-available/vexanode.cloud`):
```nginx
server {
    listen 80;
    server_name vexanode.cloud www.vexanode.cloud;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Enable the configuration and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/vexanode.cloud /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 Advanced Optimization & Security Guidelines

### 🛡️ Authentication Safety
- All API handlers query sessions using `getServerSession(authOptions)` to block unauthorized requests.
- Database access uses an isolated service role client inside servers to bypass RLS, with Next.js validating permissions.
- Passwords are encrypted with `bcryptjs` using a salt work factor of 10. Passwords are never returned in JSON payloads.

### 🏎️ Asset and Route Performance
- Static assets like SVGs are embedded or optimized to limit server requests.
- Heavy page modules (like Accordion panels or Location listings) are hydrated with Framer Motion, keeping page sizes low.
- Next.js Turbopack handles fast HMR during development, while production compiler outputs are minified and cached globally.

---

## 👥 Contributors

This platform is developed and maintained by:

- **Ayushisingh09** ([GitHub Profile](https://github.com/Ayushisingh09)) — Core developer, authentication systems, minimal forms refactoring, and database architecture.
- **titanxdevz** ([GitHub Profile](https://github.com/titanxdevz)) — Platform infrastructure creator and server operations developer.