# Coinpath Frontend

Bills, expenses, and where the money is heading. React 19 + TypeScript +
Vite SPA for Coinpath. Tailwind CSS v4, shadcn/ui (on `@base-ui/react`),
React Router v8, TanStack Query, react-hook-form + zod, axios. Pair it with
the `expenses-be/` Laravel API.

## Requirements

- Node.js and npm
- `expenses-be/` running locally (see its README) with Sanctum cookie auth
  configured

## Setup

```bash
npm install
```

Create a `.env` pointing at the backend:

```env
VITE_BASE_URL_API=http://localhost:8000/api
VITE_BASE_URL=http://localhost:8000
VITE_DEVELOPMENT_MDOE=DEV
```

Start the dev server:

```bash
npm run dev
```

## Common commands

```bash
npm run dev        # Vite dev server
npm run build       # tsc -b && vite build
npm run lint        # ESLint
npm run preview     # preview a production build
```

Husky + lint-staged run Prettier on staged files at commit time.

## Architecture

Under `src/`:

- `pages/` — route-level screens, grouped by feature/auth state
  (`pages/Login`, `pages/auth/Dashboard`, `pages/auth/Bills/{list,details,components}`,
  `pages/auth/DailyExpenses`, `pages/auth/Transactions`). Feature-local
  components live in a `components/` folder next to the page that owns
  them.
- `components/` — shared, cross-feature UI: `alerts/`, `modals/`,
  `toast/`, `layouts/`, `auth/` (`Authenticated`, `GuestAuth` route
  guards), plus standalone form controls (`FormControl.tsx`,
  `FormControlField.tsx`, `FormSelect.tsx`).
- `lib/shadcn/` — shadcn/ui primitives (`components/ui/*`) and the
  `cn()` utility, kept separate from app-owned shared components.
- `hooks/` — one feature hook per screen/domain (`useBillsHook`,
  `useBillsListHook`, `useBillActionsHook`, `useTransactionHook`,
  `useActivityHook`, `useDailyExpensesHook`, `useDailyExpensesListHook`,
  `useDashboardHook`, `useAuthHook`, `useReferenceHook`,
  `useConfirmModal`, `useToastNotification`, `useUndoToast`) that owns
  local state, `react-hook-form` wiring, and orchestrates calls into
  `hooks/api/`.
- `hooks/api/` — the actual HTTP calls (axios), one file per resource
  (`bills-api.ts`, `transaction-api.ts`, `activity-api.ts`,
  `daily-expenses-api.ts`, `dashboard-api.ts`, `reference-api.ts`,
  `auth/auth-api.ts`). Raw request functions live here, not in
  components or feature hooks.
- `services/` — cross-cutting service classes (`AuthService.ts`).
- `context/` + `context/providers/` — React context: modal context,
  `BillsProvider`, `BillDetailsProvider`, `ConfirmModalProvider`,
  `ReferenceProvider`, `ToastProvider`, `AuthProvider`.
- `types/` — TypeScript types and zod schemas, one file per domain
  (`billsTypes.ts`, `transactionTypes.ts`, `activityTypes.ts`,
  `dailyExpenseTypes.ts`, `dashboardTypes.ts`, `login-types.ts`,
  `globalTypes.ts`, `modalTypes.ts`, `toastTypes.ts`,
  `formControlTypes.ts`).
- `configs/axiosHttp.ts` — the shared axios instance
  (`withCredentials: true` for Sanctum cookie auth).
- `utils/` — small helpers (`axios-error.util.ts`,
  `localStorage.util.ts`, `utilities.util.ts`).
- `routes/index.tsx` — `createBrowserRouter` tree; pages are lazy-loaded
  with `React.lazy`. Public routes live under `/` (`/login`);
  authenticated routes live under `/expense`
  (`dashboard`, `bills`, `bills/:id/{transactions,activities}`,
  `daily-expenses`).

Path aliases: `@c/*` and `@/*` both resolve to `src/*` (see
`tsconfig.app.json` and `vite.config.ts`).
