import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'retracker',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

// Test database connection
pool.on('connect', () => {
  console.log('✓ Database connected');
});

pool.on('error', (err) => {
  console.error('Database error:', err);
});

export const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    // Create expenses table with recurring support
    await client.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        amount DECIMAL(10, 2) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        is_recurring BOOLEAN DEFAULT FALSE,
        recurring_frequency VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create income table
    await client.query(`
      CREATE TABLE IF NOT EXISTS income (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        amount DECIMAL(10, 2) NOT NULL,
        description TEXT NOT NULL,
        income_type VARCHAR(20) NOT NULL,
        pay_frequency VARCHAR(20),
        hours_per_week DECIMAL(5, 2),
        tax_rate DECIMAL(5, 2),
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create index on date for faster queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_income_date ON income(date);
    `);

    // Create index on category for faster filtering
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
    `);

    // Create index on recurring expenses
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_expenses_recurring ON expenses(is_recurring);
    `);

    console.log('✓ Database tables initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};
