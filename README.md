# Cleaning Cost Calculator

This is a web application for calculating and managing cleaning costs, built with React, TypeScript, and Firebase. It allows users to log in, add and edit entries, manage payments, and view summaries of cleaning-related expenses.

## Features

- **Authentication:** Secure login system for users
- **Entry Management:** Add, edit, and delete cleaning cost entries
- **Payment Tracking:** Record and manage payments
- **Summary Cards:** Visual overview of total costs and payments
- **Import/Export:** Easily import and export data for backup or sharing
- **Protected Routes:** Restrict access to authenticated users
- **Responsive UI:** Modern, mobile-friendly design

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** Firebase Firestore
- **Authentication:** Firebase Auth

## Getting Started

### Prerequisites

- Node.js & npm
- Firebase account

### Installation

1. Clone the repository:

 ```bash
 git clone <repo-url>
 cd cleaning-cost-calculator
 ```

1. Install dependencies:

 ```bash
 npm install
 ```

1. Configure Firebase:

- Update `src/firebase.ts` with your Firebase project credentials.
- Ensure `firebase.json`, `firestore.rules`, and `firestore.indexes.json` are set up for your project.

### Running Locally

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Deployment

Deploy to Firebase Hosting:

```bash
firebase deploy
```

## Project Structure

- `src/` - Main source code
  - `components/` - UI components
  - `hooks/` - Custom React hooks
  - `services/` - Firestore service logic
  - `types/` - TypeScript type definitions
  - `utils/` - Utility functions

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.
