# ReTracker

A personal assistance app to track expenses with a modern full-stack architecture.

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Axios

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL (planned)

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

- `GET /api/health` - Health check
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/stats` - Get expense statistics
- `GET /api/expenses/:id` - Get expense by ID
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

## Features

- Track expenses with categories
- View expense statistics
- Monthly spending analysis
- Daily average calculations
- Category-based breakdown

## Development Roadmap

- [ ] Add database integration (PostgreSQL)
- [ ] Implement user authentication
- [ ] Add expense filtering and search
- [ ] Create data visualization charts
- [ ] Export expenses to CSV/PDF
- [ ] Mobile-responsive design improvements 
