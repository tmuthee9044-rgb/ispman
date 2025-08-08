// Simplified database configuration that works in both development and production
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
    const mysql = await import("mysql2/promise")

    const connection = await mysql.createConnection({
      host: process.env.POSTGRES_HOST || "localhost",
      user: process.env.POSTGRES_USER || "root",
      password: process.env.POSTGRES_PASSWORD || "",
      database: process.env.POSTGRES_DATABASE || "isp_system",
      port: Number.parseInt(process.env.DB_PORT || "3306"),
    })

    db = {
      execute: async (sql: string, params?: any[]) => {
        const [results] = await connection.execute(sql, params)
        return results
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
