# Auth Template — Mobile (Expo)

React Native mobile app template with authentication flows. Built with Expo SDK 52, Expo Router, and TypeScript.

Works with **all 6 backend auth templates** — Python, Rust, Go × single-tenant and multi-tenant.

## Features

- 🔐 **Complete Auth Flows** — Login, register, forgot password, reset password, email verification
- 📱 **Expo Router** — File-based routing with `(main)` / `(meta)` route groups
- 🛡️ **Auth Guard** — Protected routes redirect unauthenticated users
- 🌗 **Dark Mode** — System-aware theme with Colors constants
- 📊 **Dashboard** — User overview with status, email verification, role
- 👤 **Profile** — View personal information
- ⚙️ **Settings** — Update name
- 🔒 **Security** — Change password
- 🔗 **Backend Agnostic** — Works with any of the 6 auth backends via `EXPO_PUBLIC_API_URL`

## Tech Stack

- **Expo SDK 52** (managed workflow)
- **Expo Router 6** (file-based routing)
- **TypeScript** (strict)
- **React Native** (iOS + Android + Web)
- **TanStack Query v5** — Server state management

## Getting Started

### Prerequisites

- Node.js 22+
- Expo Go app on your phone (or iOS Simulator / Android Emulator)
- One of the [auth backend templates](https://github.com/vidwadeseram) running

### Installation

```bash
npx degit vidwadeseram/auth-template-mobile my-app
cd my-app
npm install
```

### Configuration

Create `.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:8001
```

Change the URL based on which backend you're using:
- `http://localhost:8001` — Python single-tenant
- `http://localhost:8002` — Python multi-tenant
- `http://localhost:8003` — Rust single-tenant
- `http://localhost:8004` — Rust multi-tenant
- `http://localhost:8005` — Go single-tenant
- `http://localhost:8006` — Go multi-tenant

> For physical devices, use your computer's local IP (e.g., `http://192.168.1.x:8001`)

### Development

```bash
# Start Expo dev server
npx expo start

# Run on specific platform
npx expo start --ios
npx expo start --android
npx expo start --web
```

## Project Structure

```
app/
├── _layout.tsx              # Root layout (AuthProvider + QueryClient)
├── index.tsx                # Entry - redirects to login/dashboard
├── (meta)/                  # Unauthenticated screens
│   ├── _layout.tsx
│   ├── login.tsx
│   ├── register.tsx
│   ├── forgot-password.tsx
│   ├── reset-password.tsx
│   └── verify-email.tsx
└── (main)/                  # Authenticated screens
    ├── _layout.tsx          # Auth guard
    ├── dashboard.tsx
    ├── profile.tsx
    ├── settings.tsx
    └── security.tsx
components/
├── AuthForm.tsx             # Reusable form component
└── LinkButton.tsx           # Navigation link
lib/
├── api-client.ts            # HTTP client with auth interceptor
└── auth-context.tsx         # Auth state management
constants/
└── Colors.ts                # Theme colors (light/dark)
```

## Route Groups

| Group | Description | Auth Required |
|-------|-------------|:---:|
| `(meta)` | Login, register, forgot/reset password, verify email | ❌ |
| `(main)` | Dashboard, profile, settings, security | ✅ |

## Production Notes

- Replace the in-memory token storage in `auth-context.tsx` with **expo-secure-store** for secure token persistence
- Add error boundaries for production crash handling
- Configure app.json with your app name, bundle identifier, and icons

## Related Repositories

### Frontend Templates
- [auth-ui-shared](https://github.com/vidwadeseram/auth-ui-shared) — Shared npm package (web)
- [auth-template-landing](https://github.com/vidwadeseram/auth-template-landing) — Landing page (Next.js)
- [auth-template-client](https://github.com/vidwadeseram/auth-template-client) — Client dashboard (Next.js)
- [auth-template-admin](https://github.com/vidwadeseram/auth-template-admin) — Admin panel (Next.js)
- [auth-template-superadmin](https://github.com/vidwadeseram/auth-template-superadmin) — Superadmin panel (Next.js)

### Backend Templates
- [python-auth-template](https://github.com/vidwadeseram/python-auth-template)
- [python-multi-tenant-auth-template](https://github.com/vidwadeseram/python-multi-tenant-auth-template)
- [rust-auth-template](https://github.com/vidwadeseram/rust-auth-template)
- [rust-multi-tenant-auth-template](https://github.com/vidwadeseram/rust-multi-tenant-auth-template)
- [go-auth-template](https://github.com/vidwadeseram/go-auth-template)
- [go-multi-tenant-auth-template](https://github.com/vidwadeseram/go-multi-tenant-auth-template)

## License

MIT
