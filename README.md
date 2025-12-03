# ReTracker v1

A personal finance tracker to manage expenses, income, and budgets with a modern full-stack architecture.

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Axios
- Recharts (data visualization)

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL

## Project Structure

```
ReTracker/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── hooks/       # Custom React hooks
│   │   ├── types/       # TypeScript type definitions
│   │   ├── utils/       # Utility functions
│   │   └── styles/      # CSS styles
│   ├── package.json
│   └── vite.config.ts
│
├── server/              # Backend Express application
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Data models
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Custom middleware
│   │   ├── config/      # Configuration files
│   │   └── utils/       # Utility functions
│   ├── package.json
│   └── tsconfig.json
│
├── shared/              # Shared types between client and server
│   └── types/
│
└── package.json         # Root workspace configuration
```

## Setup

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ReTracker
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

For the server:
```bash
cd server
cp .env.example .env
# Edit .env with your configuration
```

For the client:
```bash
cd client
cp .env.example .env
# Edit .env with your API URL if needed
```

### Development

Run both client and server concurrently:
```bash
npm run dev
```

Or run them separately:

```bash
# Run client only (http://localhost:3000)
npm run dev:client

# Run server only (http://localhost:3001)
npm run dev:server
```

### Build

Build both client and server:
```bash
npm run build
```

Or build separately:
```bash
npm run build:client
npm run build:server
```

### Production

```bash
npm start
```

## API Endpoints

### Expenses
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/stats` - Get expense statistics
- `GET /api/expenses/:id` - Get expense by ID
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Income
- `GET /api/income` - Get all income sources
- `GET /api/income/:id` - Get income by ID
- `POST /api/income` - Create new income
- `PUT /api/income/:id` - Update income
- `DELETE /api/income/:id` - Delete income

### Budget
- `GET /api/budget/summary` - Get complete budget summary

## Features

### Expense Tracking
- Add, edit, and delete expenses with categories
- Recurring expense support (daily, weekly, biweekly, monthly, yearly)
- Search and filter by category, date range, and keywords
- View expense statistics and trends
- Export to CSV or print/PDF
- Category-based pie charts
- Monthly trend bar charts

### Income Management
- Track salary income with biweekly/semimonthly pay periods
- Track hourly wages with hours per week
- Automatic federal tax rate calculation
- Add, edit, and delete income sources

### Budget Overview
- Complete budget summary with yearly and monthly breakdowns
- Net income calculations after taxes and expenses
- Savings rate percentage
- Projected yearly expenses from recurring costs
- Visual cards showing key financial metrics

### User Experience
- Mobile-responsive design
- Modern, clean interface
- Real-time data updates
- Date selection for past and future entries

## Future Enhancements

- [ ] User authentication and multi-user support
- [ ] Custom expense categories
- [ ] Bill reminders and notifications
- [ ] Investment tracking
- [ ] Financial goal setting
- [ ] Advanced reporting and analytics 
