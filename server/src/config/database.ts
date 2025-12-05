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
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // return error after 2 seconds if can't connect
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
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create expenses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        amount DECIMAL(10, 2) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add recurring columns if they don't exist (migration)
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name='expenses' AND column_name='is_recurring') THEN
          ALTER TABLE expenses ADD COLUMN is_recurring BOOLEAN DEFAULT FALSE;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name='expenses' AND column_name='recurring_frequency') THEN
          ALTER TABLE expenses ADD COLUMN recurring_frequency VARCHAR(20);
        END IF;
      END $$;
    `);

    // Add user_id to expenses table (migration)
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name='expenses' AND column_name='user_id') THEN
          ALTER TABLE expenses ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;
        END IF;
      END $$;
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

    // Add user_id to income table (migration)
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name='income' AND column_name='user_id') THEN
          ALTER TABLE income ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;
        END IF;
      END $$;
    `);

    // Create indexes (idempotent operations)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_income_date ON income(date);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_expenses_recurring ON expenses(is_recurring);
    `);

    // Additional indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_expenses_date_category ON expenses(date, category);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_income_type ON income(income_type);
    `);

    // Indexes for user_id (authentication)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_income_user_id ON income(user_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    console.log('✓ Database tables and indexes initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};
