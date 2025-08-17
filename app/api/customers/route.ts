import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await sql`SELECT * FROM customers ORDER BY id LIMIT 10`

    return NextResponse.json({
      success: true,
      customers: result.rows,
      count: result.rowCount,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      customers: [],
      count: 0,
    })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, address } = body

    const result = await sql`
      INSERT INTO customers (name, email, phone, address, status, customer_type, plan, monthly_fee, balance)
      VALUES (${name}, ${email}, ${phone}, ${address}, 'active', 'residential', 'Basic Plan', 2500, 0)
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      customer: result.rows[0],
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
