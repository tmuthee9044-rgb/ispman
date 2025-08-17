import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { customerId, amount, phone } = await request.json()

    // Create payment request record
    await sql`
      INSERT INTO payment_requests (customer_id, amount, phone, method, status, created_at)
      VALUES (${customerId}, ${amount}, ${phone}, 'mpesa', 'pending', NOW())
    `

    // In a real implementation, you would integrate with M-Pesa API here
    console.log(`[v0] M-Pesa request: KES ${amount} to ${phone}`)

    return NextResponse.json({
      success: true,
      message: "M-Pesa payment request sent successfully",
    })
  } catch (error) {
    console.error("[v0] Error sending M-Pesa request:", error)
    return NextResponse.json({ error: "Failed to send M-Pesa request" }, { status: 500 })
  }
}
