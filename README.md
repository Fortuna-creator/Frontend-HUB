# 📅 Konsultasi PKP - Consultation Booking System

A modern, secure consultation booking platform built with React 19, TypeScript, and Vite. Enables residents (Warga) to book consultations at the PKP office (Balai) for in-person meetings with administrators.

**Status:** 🟢 Development Complete | 🔒 Security Hardened (7/10 Issues Fixed)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [How to Run](#how-to-run)
- [How to Build](#how-to-build)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)

## ✨ Features

### For Warga (Residents)
- 🔐 **Secure Registration** with OTP verification (rate-limited after 3 failed attempts)
- 📅 **Browse Balai** and view available consultation time slots
- 📋 **Book Consultations** with preferred dates and times
- 📬 **Inbox** for consultation status tracking and confirmations
- 💬 **Real-time Status Updates** on consultation requests (pending, accepted, completed)
- ⏱️ **Automatic Session Expiration** (24 hours default, 7 days with "Remember Me")
- ⚠️ **Session Expiration Warning Banner** (30 minutes before timeout)

### For Balai (Administration Office)
- 📊 **Dashboard** with consultation statistics and overview
- 📋 **Manage Requests** - Accept, decline, or mark consultations as complete
- 👥 **View Consultations** - Track pending and completed resident requests
- 🔔 **Notifications** - Alert system for new booking requests

## 🔒 Security

### Implemented (7 of 10 Issues Resolved)

| Issue | Feature | Status |
|-------|---------|--------|
| #2 | Mock OTP hardcoded → dev-only restriction | ✅ Complete |
| #3 | XSS protection with HttpOnly cookies | ✅ Complete |
| #6 | Password strength validation (8+ chars, 6-level scoring) | ✅ Complete |
| #7 | CORS configuration for development | ✅ Complete |
| #8 | OTP rate limiting (3 attempts, 15-min lockout) | ✅ Complete |
| #9 | Input validation & sanitization (all form fields) | ✅ Complete |
| #10 | Token expiration with auto-logout | ✅ Complete |

### Pending (3 Issues - Require PKP Domain)
- **#1:** Hardcoded API URL → environment variables
- **#4:** Environment configuration for prod/staging
- **#5:** Console logging cleanup (dev-only)

### Security Features

**Authentication & Session Management:**
- ✅ HttpOnly cookies (backend prevents XSS attacks)
- ✅ Dual-duration tokens: 24h default, 7d with "Remember Me"
- ✅ Automatic session validation on app load
- ✅ Auto-logout with expiration countdown
- ✅ CORS properly configured for safe cross-origin requests

**Password Security:**
- ✅ Minimum 8 characters required
- ✅ Must include: uppercase, lowercase, number, special character
- ✅ Real-time strength indicator (6 levels: red → dark green)
- ✅ Visual feedback on password requirements

**Input Validation & Sanitization:**
- ✅ NIK: Exactly 16 digits (Indonesian National ID)
- ✅ Phone: Indonesian formats (+62, 62, 0 prefixes)
- ✅ Email: Standard email format, max 254 chars
- ✅ Address: 10-500 chars, alphanumeric + safe punctuation
- ✅ Name: 3-50 chars, letters/spaces/apostrophes
- ✅ HTML entity encoding prevents XSS injection

**API Rate Limiting:**
- ✅ OTP: Max 3 attempts per user, 15-minute lockout
- ✅ HTTP 429 response with retry countdown
- ✅ Server-side enforcement (cannot be bypassed)

[See SECURITY_AUDIT.md](SECURITY_AUDIT.md) for full security documentation.

## 🛠️ Tech Stack

- **Frontend Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4
- **Routing:** React Router v7
- **HTTP Client:** Fetch API with `credentials: 'include'` for HttpOnly cookies
- **State Management:** React Context API + Custom Hooks
- **Authentication:** JWT with HttpOnly cookies (backend) + Cookie-based session
- **Form Validation:** Custom validators with real-time feedback
- **Icons:** Lucide React, React Icons
- **Date Picker:** React Datepicker
- **Code Quality:** ESLint + TypeScript
- **Development:** Vite HMR for instant hot reload

## 📦 Prerequisites

- **Node.js:** v18 or higher
- **npm:** v9 or higher (or yarn/pnpm)
- **Git:** For version control
- **Backend API:** Running on http://localhost:8080/api (development)

Verify installation:
```bash
node --version   # Should be v18+
npm --version    # Should be v9+
```

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Klinik_HUB_PKP
```

### 2. Install Dependencies
```bash
npm install
```

This will install all dependencies listed in `package.json`:
- React & React DOM
- React Router for navigation
- Tailwind CSS for styling
- Date picker and icon libraries
- TypeScript for type safety
- ESLint for code quality

### 3. Environment Configuration

Create a `.env.local` file in the project root (optional - backend URL defaults to production):

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Optional: Feature flags
VITE_SHOW_SESSION_KEYS=true
```

**Note:** The application has a built-in API configuration fallback to production endpoints.

### 4. Verify Setup

```bash
# Check for TypeScript errors
npm run build

# Check code quality
npm run lint
```

## ▶️ How to Run

### Development Server (Recommended)

Start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

**Output:**
```
➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Features:**
- ⚡ Instant page refresh on file changes
- 🐛 Easy debugging with browser DevTools
- 🎨 Live CSS updates

### Preview Production Build

To test the production build locally before deployment:

```bash
npm run build
npm run preview
```

**Output:**
```
➜  Preview:  http://localhost:4173/
```

## 🔧 How to Build

### Compile TypeScript & Bundle

```bash
npm run build
```

**Process:**
1. Compiles TypeScript files (`tsc -b`)
2. Bundles assets with Vite
3. Optimizes for production
4. Output: `dist/` directory (minified, ready for deployment)

**Output files:**
```
dist/
  ├── index.html
  ├── assets/
  │   ├── main.*.js
  │   └── style.*.css
  └── _redirects (for Netlify routing)
```

### Build with Source Maps (Debugging)

For production debugging, include source maps:

```bash
# Modify vite.config.ts build options then run
npm run build
```

## 🧹 Other Commands

### Code Quality

**Run Linter:**
```bash
npm run lint
```

Checks code for style and quality issues according to ESLint rules.

**Fix Linting Issues (Automatic):**
```bash
npx eslint . --fix
```

### Type Checking

```bash
npx tsc --noEmit
```

Checks for TypeScript type errors without emitting files.

## 📁 Project Structure

```
src/
├── main.tsx                 # Application entry point
├── App.tsx                  # Main app & routing
├── App.css                  # Global styles
├── index.css                # CSS reset
├── api/                     # Backend integration
│   ├── service.ts           # API endpoints (with credentials: 'include')
│   ├── config.ts            # API configuration
│   ├── hooks.ts             # Custom React hooks
│   ├── types.ts             # API type definitions
│   └── idempotency.ts       # Idempotency utilities
├── utils/
│   └── validation.ts        # Input validators & sanitizers
├── types/
│   └── types.ts             # Global type definitions
├── Warga/                   # Resident (Warga) interface
│   ├── components/
│   │   ├── Auth/            # Authentication (login, register, OTP)
│   │   │   ├── authContext.tsx       # Auth state management
│   │   │   ├── useAuth.ts            # Custom auth hook
│   │   │   ├── LoginForm.tsx         # Login with "Remember Me"
│   │   │   ├── TokenExpirationWarning.tsx  # Session warning
│   │   │   └── RouteGuards.tsx       # Protected routes
│   │   └── Shared/          # Nav, footer, etc
│   └── pages/               # Page components
├── Balai/                   # PKP Office (Balai) administration interface
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── data/
└── assets/                  # Images, fonts
```

## 🔌 API Integration

### Backend Endpoints

**Authentication:**
- `POST /api/auth/register` - Register with OTP verification
- `POST /api/auth/verify-otp` - Verify OTP code
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/login` - Login (sets HttpOnly auth_token cookie)
- `POST /api/auth/logout` - Logout

**Consultations:**
- `GET /api/balai/list` - List all offices
- `GET /api/balai/{id}/available-slots` - Available consultation time slots
- `POST /api/consultations/book` - Book consultation appointment
- `GET /api/consultations/me` - User's consultation bookings
- `GET /api/consultations/{id}/status` - Check consultation status

**Dashboard:**
- `GET /api/dashboard/stats` - Consultation statistics
- `GET /api/booking-confirmations` - Confirmations inbox

### API Configuration

All requests automatically include:
- ✅ `credentials: 'include'` - Sends HttpOnly cookies
- ✅ `Content-Type: application/json`
- ✅ Timeout: 30 seconds
- ✅ Auto-retry on network errors (with idempotency support)

### Authentication Flow

1. **Register:** User enters credentials + OTP verification
2. **Login:** User enters email/password
3. **Server Response:** Sets `auth_token` HttpOnly cookie
4. **Protected Requests:** Browser automatically sends cookie
5. **Session Validation:** Token checked on app load
6. **Expiration:** Auto-logout after timeout (user notified 30 mins before)

### Custom Hooks

```typescript
useAuth()                    // Get current user & auth state
useGetBalai()               // Fetch facilities list
useGetConsultations(userId) // Fetch user's consultations
useGetDashboardStats()      // Fetch dashboard stats
```

## 🚢 Deployment

### Netlify (Recommended)

**Environment Variables:**
```
VITE_API_BASE_URL = https://api.pkp.go.id/api
```

**Deployment:**
1. Connect repository to Netlify
2. Set environment variables in Netlify dashboard
3. Auto-deploy on git push

**Configuration:**
- Build: `npm run build`
- Publish: `dist/`
- Node: 18+

### Environment Setup for Production

When PKP domain is ready:

1. **Update API URL:**
   ```env
   VITE_API_BASE_URL=https://api.pkp.go.id/api
   ```

2. **Enable HTTPS:**
   - Backend must serve HTTPS
   - Cookies must have `Secure` flag

3. **Configure CORS:**
   - Backend allows `https://app.pkp.go.id`
   - Credentials enabled for same-site requests

## 📝 Git Workflow

```bash
# Create a feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: description of changes"

# Push to remote
git push origin feature/your-feature

# Create Pull Request
# After review and approval, merge to main
```

## 🐛 Troubleshooting

### Port 5173 Already in Use

```bash
# Kill process on port 5173
npx kill-port 5173

# Or specify different port
npm run dev -- --port 3000
```

### Node Modules Issues

```bash
# Clean install
rm -rf node_modules
npm install
```

### TypeScript Errors

```bash
# Check for errors
npx tsc --noEmit

# Fix auto-fixable errors
npx eslint . --fix
```

### API Connection Issues

- Verify backend is running
- Check `VITE_API_BASE_URL` in `.env.local`
- Check browser DevTools Network tab
- Verify CORS configuration on backend

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is proprietary and confidential.

## � Documentation & Resources

All documentation files with their purposes and use cases:

| Document | Purpose | For Whom | Use Case |
|----------|---------|----------|----------|
| [SECURITY_AUDIT.md](SECURITY_AUDIT.md) | Complete security audit report | Developers, Security Team | Review 7/10 completed security improvements |
| [PRE_DEPLOYMENT_CHECKLIST.md](PRE_DEPLOYMENT_CHECKLIST.md) | Production deployment checklist | DevOps, Project Manager | Prepare for production deployment when PKP domain is ready |
| [API_CONTRACT.md](API_CONTRACT.md) | API contract specs | Backend Team | Implement backend endpoints matching frontend requirements |
| [BACKEND_INTEGRATION_HTTPCOOKIE.md](BACKEND_INTEGRATION_HTTPCOOKIE.md) | Backend integration guide | Backend Team | Configure HttpOnly cookie authentication |
| [FRONTEND_API_GUIDE.md](FRONTEND_API_GUIDE.md) | Frontend API integration guide | Frontend Developers | Understand API service layer, hooks, and integration patterns |
| [TOKEN_EXPIRATION.md](TOKEN_EXPIRATION.md) | Session & token management | Frontend Developers | Configure session timeout, expiration warnings, auto-logout |
| [COMPONENT_INTEGRATION_CHECKLIST.md](COMPONENT_INTEGRATION_CHECKLIST.md) | Component integration status | Frontend Team | Track component implementation and integration status |
| [SQL_INJECTION_ANALYSIS.md](SQL_INJECTION_ANALYSIS.md) | SQL injection security analysis | Security Team, Backend Team | Security analysis and prevention strategies |
| [SETUP_COMPLETE.md](SETUP_COMPLETE.md) | Development setup documentation | New Developers | Initial project setup and environment configuration |

---

## �👥 Team

Klinik HUB PKP Development Team

---

**Status:** March 6, 2026
- ✅ Frontend 100% complete and security-hardened
- ✅ 7 of 10 security issues resolved
- ⏳ Awaiting PKP domain infrastructure for final 3 issues
- 🟢 Development: READY FOR DEPLOYMENT
