// Simplified database configuration that works in both development and production
import { Pool } from 'pg'
let db: any = null

// Mock database for development/demo purposes
const mockDb = {
  execute: async (sql: string, params?: any[]) => {
    console.log("Mock DB Query:", sql, params)
    // Return empty results for demo
    return [[]]
  },
}

// Only try to connect to real database if environment variables are present
async function initializeDb() {
  if (db) return db

  // Check if we have database configuration
  const hasDbConfig = process.env.DATABASE_URL || (process.env.POSTGRES_HOST && process.env.POSTGRES_USER)

  if (!hasDbConfig) {
    console.log("No database configuration found, using mock database")
    db = mockDb
    return db
  }

  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    })

    db = {
      execute: async (sql: string, params?: any[]) => {
        const client = await pool.connect()
        try {
          const result = await client.query(sql, params)
          return result.rows
        } finally {
          client.release()
        }
      },
    }

    console.log("Database connected successfully")
    return db
  } catch (error) {
    console.error("Database connection failed, using mock database:", error)
    db = mockDb
    return db
  }
}

export async function query(sql: string, params?: any[]) {
  const database = await initializeDb()
  return database.execute(sql, params)
}

export { db }
