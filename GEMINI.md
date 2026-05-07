# Cleaning Cost Calculator - Project Context

This project is a web application designed to calculate and manage cleaning costs. It tracks work sessions (entries), payments, and additional expenses.

## Project Overview

- **Core Purpose:** To provide a simple interface for tracking cleaning activities and financial balances between service providers and clients.
- **Main Technologies:**
    - **Frontend:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite 7](https://vitejs.dev/)
    - **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
    - **Backend/Database:** [Firebase Firestore](https://firebase.google.com/docs/firestore)
    - **Authentication:** [Firebase Auth](https://firebase.google.com/docs/auth)
    - **Package Manager:** [Bun](https://bun.sh/)
    - **Icons:** [Lucide React](https://lucide.dev/)

## Architecture

The project follows a standard React architecture with a focus on custom hooks and service layers:

- **`src/components/`**: UI components.
- **`src/hooks/`**: Custom hooks for data fetching and state management (e.g., `useEntries`, `usePayments`, `useExpenses`). These hooks use Firebase's `onSnapshot` for real-time updates.
- **`src/services/`**: Contains `firestoreService.ts`, which abstracts all Firestore operations. Data is partitioned by user ID (`userData/{userId}/...`).
- **`src/types/`**: Centralized TypeScript interfaces and types.
- **`src/utils/`**: Helper functions for calculations, date formatting, and data transformation.
- **`src/constants/`**: Global constants like hourly rates.

## Building and Running

The project uses Bun as the primary tool for package management and script execution.

- **Install Dependencies:**
  ```bash
  bun install
  ```
- **Development Server:**
  ```bash
  bun run dev
  ```
- **Build for Production:**
  ```bash
  bun run build
  ```
- **Linting:**
  ```bash
  bun run lint
  ```
- **Preview Production Build:**
  ```bash
  bun run preview
  ```
- **Deployment:**
  ```bash
  firebase deploy
  ```

## Development Conventions

- **Tooling:** Always prefer `bun` over `npm` or `yarn`.
- **Components:** Use functional components with hooks. Prefer modularizing large components into smaller ones in the `components/` directory.
- **Styling:** Use Tailwind CSS utility classes. Avoid custom CSS unless absolutely necessary (centralized in `index.css`).
- **Data Fetching:** Use the custom hooks in `src/hooks/` which interact with `src/services/firestoreService.ts`. Do not call Firestore APIs directly from components.
- **Type Safety:** Ensure all new data structures are reflected in `src/types/index.ts`. Use strict TypeScript.
- **Localization:** The UI is currently in German (e.g., "Reinigungskosten-Rechner"). Keep naming and UI text consistent with this unless a multi-language setup is introduced.
- **Imports:** Use named imports. Keep imports organized.

## Key Files

- `src/firebase.ts`: Firebase initialization and configuration.
- `src/services/firestoreService.ts`: Core data access layer.
- `src/utils/calculations.ts`: Logic for computing costs and balances.
- `firestore.rules`: Security rules for the database.
- `package.json`: Project dependencies and scripts.
