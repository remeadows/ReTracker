# ReTracker v1

<div align="center">

**A comprehensive personal finance tracker for managing expenses, income, and budgets**

[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20PostgreSQL-blue)](#tech-stack)
[![License](https://img.shields.io/badge/License-MIT-green)](#)

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [macOS Setup](#macos-setup)
  - [Windows 11 Setup](#windows-11-setup)
  - [Linux Setup](#linux-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)

---

## Overview

ReTracker v1 is a full-stack personal finance management application designed to help you take control of your financial life. Built with modern web technologies, it provides an intuitive interface for tracking expenses, managing income sources, and visualizing your budget in real-time.

### Key Capabilities

- **Expense Management**: Track one-time and recurring expenses across multiple categories
- **Income Tracking**: Manage salary and hourly wages with automatic tax calculations
- **Budget Visualization**: View comprehensive financial summaries with interactive charts
- **Smart Projections**: Forecast yearly expenses based on recurring costs
- **Export Functionality**: Export your data to CSV or generate PDF reports

---

## Features

### 💰 Expense Tracking
- **Add, edit, and delete expenses** with intuitive forms
- **Recurring expense support** (daily, weekly, biweekly, monthly, yearly)
- **Category-based organization** (food, transport, entertainment, utilities, healthcare, shopping, other)
- **Advanced filtering** by category, date range, and keyword search
- **Visual analytics** with pie charts showing spending by category
- **Monthly trends** displayed in interactive bar charts
- **Export options** to CSV or print/PDF

### 💵 Income Management
- **Multiple income types**:
  - Salary with biweekly (26 pay periods) or semimonthly (24 pay periods) options
  - Hourly wages with configurable hours per week
- **Automatic tax calculation** based on 2024 federal tax brackets
- **Income source management** with full CRUD operations
- **Yearly income projections** for budget planning

### 📊 Budget Overview
- **Comprehensive dashboard** showing:
  - Net monthly income (after expenses)
  - Total monthly income (net of taxes)
  - Total monthly expenses (from projections)
  - Savings rate percentage
- **Yearly breakdowns** of income vs. expenses
- **Real-time calculations** that update as you add/edit data
- **Visual cards** highlighting key financial metrics

### 🎨 User Experience
- **Mobile-responsive design** works seamlessly on all devices
- **Modern, clean interface** with intuitive navigation
- **Real-time updates** with no page refreshes needed
- **Past and future date support** for planning ahead
- **Dark/light theme compatible** with system preferences

---

## Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Recharts** - Beautiful, responsive charts

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **TypeScript** - Type-safe backend code
- **PostgreSQL** - Robust relational database
- **pg** - PostgreSQL client for Node.js

### Architecture
- **Monorepo structure** with npm workspaces
- **Shared types** between client and server
- **RESTful API** design
- **Connection pooling** for database efficiency

---

## Prerequisites

Before installing ReTracker, ensure you have the following software installed:

| Software | Minimum Version | Purpose |
|----------|----------------|---------|
| Node.js | 18.0.0+ | JavaScript runtime |
| npm | 9.0.0+ | Package manager |
| PostgreSQL | 12.0+ | Database |
| Git | 2.0+ | Version control |

---

## Installation

Choose your operating system for detailed setup instructions:

### macOS Setup

#### 1. Install Homebrew (if not already installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. Install Node.js
```bash
# Install Node.js via Homebrew
brew install node

# Verify installation
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
```

#### 3. Install PostgreSQL
```bash
# Install PostgreSQL
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Verify PostgreSQL is running
brew services list | grep postgresql
```

#### 4. Create Database
```bash
# Create the database
createdb retracker

# Verify database was created
psql -l | grep retracker
```

#### 5. Clone and Install ReTracker
```bash
# Clone the repository
git clone <repository-url>
cd ReTracker

# Install all dependencies
npm install
```

#### 6. Configure Environment
```bash
# Create server environment file
cat > server/.env << 'EOF'
DB_HOST=localhost
DB_PORT=5432
DB_NAME=retracker
DB_USER=postgres
DB_PASSWORD=
PORT=3001
EOF

# Create client environment file (optional)
cat > client/.env << 'EOF'
VITE_API_URL=/api
EOF
```

#### 7. Start the Application
```bash
# Start both client and server
npm run dev
```

Open your browser to `http://localhost:3000`

---

### Windows 11 Setup

#### 1. Install Node.js
1. Download the **Windows Installer (.msi)** from [nodejs.org](https://nodejs.org/)
2. Choose the **LTS version** (18.x or higher)
3. Run the installer and follow the prompts
4. Verify installation:
```powershell
node --version
npm --version
```

#### 2. Install PostgreSQL
1. Download the installer from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Run the installer (choose version 14 or higher)
3. During installation:
   - Remember your **postgres user password**
   - Default port: **5432**
   - Install **pgAdmin 4** (GUI tool)
4. Verify PostgreSQL is running:
   - Open **Services** (Win + R → `services.msc`)
   - Look for **postgresql-x64-14** (should be Running)

#### 3. Create Database
**Option A: Using pgAdmin 4**
1. Open **pgAdmin 4**
2. Connect to your PostgreSQL server (enter password)
3. Right-click **Databases** → **Create** → **Database**
4. Database name: `retracker`
5. Click **Save**

**Option B: Using Command Line**
```powershell
# Open PowerShell as Administrator
# Navigate to PostgreSQL bin directory
cd "C:\Program Files\PostgreSQL\14\bin"

# Create database
.\createdb.exe -U postgres retracker

# Enter password when prompted
```

#### 4. Clone and Install ReTracker
```powershell
# Clone the repository
git clone <repository-url>
cd ReTracker

# Install dependencies
npm install
```

#### 5. Configure Environment
Create `server\.env`:
```powershell
# Using PowerShell
@"
DB_HOST=localhost
DB_PORT=5432
DB_NAME=retracker
DB_USER=postgres
DB_PASSWORD=your_password_here
PORT=3001
"@ | Out-File -FilePath server\.env -Encoding ASCII
```

Create `client\.env` (optional):
```powershell
@"
VITE_API_URL=/api
"@ | Out-File -FilePath client\.env -Encoding ASCII
```

**Important**: Replace `your_password_here` with your actual PostgreSQL password.

#### 6. Start the Application
```powershell
npm run dev
```

Open your browser to `http://localhost:3000`

---

### Linux Setup

#### Ubuntu/Debian

#### 1. Install Node.js
```bash
# Update package list
sudo apt update

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

#### 2. Install PostgreSQL
```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify service is running
sudo systemctl status postgresql
```

#### 3. Create Database
```bash
# Switch to postgres user
sudo -i -u postgres

# Create database
createdb retracker

# Exit postgres user
exit
```

#### 4. Configure PostgreSQL (Optional - for remote access)
```bash
# Create a password for postgres user
sudo -u postgres psql
postgres=# ALTER USER postgres PASSWORD 'your_password';
postgres=# \q
```

#### 5. Clone and Install ReTracker
```bash
# Clone repository
git clone <repository-url>
cd ReTracker

# Install dependencies
npm install
```

#### 6. Configure Environment
```bash
# Create server environment file
cat > server/.env << 'EOF'
DB_HOST=localhost
DB_PORT=5432
DB_NAME=retracker
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3001
EOF

# Create client environment file
cat > client/.env << 'EOF'
VITE_API_URL=/api
EOF
```

#### 7. Start the Application
```bash
npm run dev
```

Open your browser to `http://localhost:3000`

---

#### Fedora/RHEL/CentOS

#### 1. Install Node.js
```bash
# Install Node.js
sudo dnf install -y nodejs npm

# Or use NodeSource for latest version
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs

# Verify installation
node --version
npm --version
```

#### 2. Install PostgreSQL
```bash
# Install PostgreSQL
sudo dnf install -y postgresql-server postgresql-contrib

# Initialize database
sudo postgresql-setup --initdb

# Start and enable service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 3. Follow steps 3-7 from Ubuntu/Debian instructions above

---

## Configuration

### Server Environment Variables

Create `server/.env` with the following variables:

```env
# Database Configuration
DB_HOST=localhost          # Database host
DB_PORT=5432              # PostgreSQL port
DB_NAME=retracker         # Database name
DB_USER=postgres          # Database user
DB_PASSWORD=              # Database password (leave empty for local dev)

# Server Configuration
PORT=3001                 # Server port (3001 to avoid conflicts with macOS AirPlay)
NODE_ENV=development      # Environment (development/production)
```

### Client Environment Variables

Create `client/.env` (optional):

```env
# API Configuration
VITE_API_URL=/api         # API base URL (uses Vite proxy in development)
```

### Database Schema

The application automatically creates the required database tables on first run:

- **expenses** - Stores expense records with recurring support
- **income** - Stores income sources with tax calculations

No manual database migrations are needed!

---

## Running the Application

### Development Mode

**Run everything concurrently:**
```bash
npm run dev
```

This starts:
- Frontend dev server on `http://localhost:3000`
- Backend API server on `http://localhost:3001`

**Run servers separately:**
```bash
# Terminal 1: Start backend
npm run dev:server

# Terminal 2: Start frontend
npm run dev:client
```

### Production Mode

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run both client and server in development mode |
| `npm run dev:client` | Run only the frontend (port 3000) |
| `npm run dev:server` | Run only the backend (port 3001) |
| `npm run build` | Build both client and server for production |
| `npm run build:client` | Build only the frontend |
| `npm run build:server` | Build only the backend |
| `npm start` | Start production server |

---

## API Documentation

### Base URL
```
http://localhost:3001/api
```

### Expenses Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/expenses` | Get all expenses |
| GET | `/expenses/stats` | Get expense statistics |
| GET | `/expenses/:id` | Get expense by ID |
| POST | `/expenses` | Create new expense |
| PUT | `/expenses/:id` | Update expense |
| DELETE | `/expenses/:id` | Delete expense |

**Create Expense Example:**
```json
POST /api/expenses
{
  "amount": 45.99,
  "description": "Grocery shopping",
  "category": "food",
  "date": "2024-12-03",
  "isRecurring": true,
  "recurringFrequency": "weekly"
}
```

### Income Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/income` | Get all income sources |
| GET | `/income/:id` | Get income by ID |
| POST | `/income` | Create new income |
| PUT | `/income/:id` | Update income |
| DELETE | `/income/:id` | Delete income |

**Create Income Example (Salary):**
```json
POST /api/income
{
  "amount": 2500,
  "description": "Main job salary",
  "incomeType": "salary",
  "payFrequency": "biweekly",
  "date": "2024-12-03"
}
```

**Create Income Example (Hourly):**
```json
POST /api/income
{
  "amount": 25.50,
  "description": "Freelance work",
  "incomeType": "hourly",
  "hoursPerWeek": 20,
  "date": "2024-12-03"
}
```

### Budget Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/budget/summary` | Get complete budget summary |

**Budget Summary Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 60000,
    "totalExpenses": 42000,
    "yearlyIncome": 60000,
    "yearlyExpenses": 42000,
    "monthlyIncome": 5000,
    "monthlyExpenses": 3500,
    "netIncome": 18000,
    "netMonthly": 1500,
    "savingsRate": 30.0
  }
}
```

---

## Project Structure

```
ReTracker/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── BudgetDashboard.tsx
│   │   │   ├── CategoryChart.tsx
│   │   │   ├── ExpenseFilters.tsx
│   │   │   ├── ExpenseForm.tsx
│   │   │   ├── ExpenseList.tsx
│   │   │   ├── ExportMenu.tsx
│   │   │   ├── IncomeForm.tsx
│   │   │   ├── MonthlyTrendChart.tsx
│   │   │   └── Navigation.tsx
│   │   ├── pages/               # Page components
│   │   │   └── Dashboard.tsx
│   │   ├── services/            # API service layer
│   │   │   └── api.ts
│   │   ├── styles/              # CSS stylesheets
│   │   │   ├── App.css
│   │   │   ├── BudgetDashboard.css
│   │   │   ├── ExpenseForm.css
│   │   │   └── Navigation.css
│   │   ├── App.tsx              # Root component
│   │   └── main.tsx             # Entry point
│   ├── package.json
│   └── vite.config.ts           # Vite configuration
│
├── server/                      # Backend Express application
│   ├── src/
│   │   ├── controllers/         # Request handlers
│   │   │   ├── budget.controller.ts
│   │   │   ├── expense.controller.ts
│   │   │   └── income.controller.ts
│   │   ├── routes/              # API route definitions
│   │   │   ├── budget.routes.ts
│   │   │   ├── expense.routes.ts
│   │   │   └── income.routes.ts
│   │   ├── config/              # Configuration
│   │   │   └── database.ts
│   │   ├── utils/               # Utility functions
│   │   │   └── taxCalculator.ts
│   │   └── index.ts             # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                      # Shared TypeScript types
│   └── types/
│       └── index.ts             # Common type definitions
│
├── package.json                 # Root workspace configuration
└── README.md                    # This file
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. PostgreSQL Connection Refused

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**

**macOS:**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# If not running, start it
brew services start postgresql@14

# Or start temporarily
pg_ctl -D /usr/local/var/postgresql@14 start
```

**Windows:**
1. Open Services (Win + R → `services.msc`)
2. Find **postgresql-x64-14**
3. Right-click → Start

**Linux:**
```bash
# Check status
sudo systemctl status postgresql

# Start if not running
sudo systemctl start postgresql
```

#### 2. Database Does Not Exist

**Error:**
```
error: database "retracker" does not exist
```

**Solution:**
```bash
# macOS/Linux
createdb retracker

# Windows (in PostgreSQL bin directory)
.\createdb.exe -U postgres retracker
```

#### 3. Port 3001 Already in Use (macOS)

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**
AirPlay Receiver on macOS uses port 5000 by default. ReTracker uses port 3001 to avoid this conflict. If 3001 is still in use:

```bash
# Find process using port 3001
lsof -ti:3001

# Kill the process
kill -9 <PID>
```

Or change the port in `server/.env`:
```env
PORT=3002
```

#### 4. npm Install Fails

**Error:**
```
npm ERR! code EACCES
```

**Solution:**
```bash
# Never use sudo with npm!
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

#### 5. TypeScript Build Errors

**Error:**
```
error TS2307: Cannot find module '@shared/types'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules client/node_modules server/node_modules
npm install
```

#### 6. Database Migration Issues

**Error:**
```
error: column "is_recurring" does not exist
```

**Solution:**
The app includes automatic migrations. Restart the server:
```bash
# Stop server (Ctrl+C)
# Start again
npm run dev:server
```

The migration will run automatically and add missing columns.

---

## Future Enhancements

### Planned Features

- [ ] **User Authentication**
  - Multi-user support with secure login
  - Password encryption and JWT tokens
  - User-specific expense/income data

- [ ] **Custom Categories**
  - User-defined expense categories
  - Category icons and colors
  - Category spending limits

- [ ] **Smart Notifications**
  - Bill payment reminders
  - Budget threshold alerts
  - Recurring expense notifications

- [ ] **Investment Tracking**
  - Stock portfolio management
  - Cryptocurrency tracking
  - Investment performance analytics

- [ ] **Financial Goals**
  - Savings goal setting
  - Progress tracking
  - Goal achievement projections

- [ ] **Advanced Analytics**
  - Year-over-year comparisons
  - Spending trends analysis
  - Predictive budget forecasting
  - Custom report generation

- [ ] **Mobile App**
  - Native iOS and Android apps
  - Offline mode support
  - Push notifications

- [ ] **Bank Integration**
  - Automatic transaction imports
  - Account balance sync
  - Transaction categorization AI

---

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

## Support

If you encounter any issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Ensure all prerequisites are properly installed
3. Verify PostgreSQL is running
4. Check server logs for detailed error messages

---

<div align="center">

**Built with ❤️ using React, Node.js, and PostgreSQL**

[⬆ Back to Top](#retracker-v1)

</div>
