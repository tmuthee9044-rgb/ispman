import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customerId = params.id
    const serviceData = await request.json()

    // Insert new service for customer
    const result = await sql`
      INSERT INTO customer_services (
        customer_id, service_plan_id, status, monthly_fee, 
        installation_date, next_billing_date, ip_address, 
        router_id, auto_renewal, created_at
      ) VALUES (
        ${customerId}, ${serviceData.service_plan_id}, 'active',
        ${serviceData.monthly_fee}, ${serviceData.installation_date || new Date().toISOString()},
        ${serviceData.next_billing_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()},
        ${serviceData.ip_address}, ${serviceData.router_id}, 
        ${serviceData.auto_renewal || true}, NOW()
      ) RETURNING *
    `

    return NextResponse.json({ success: true, service: result[0] })
  } catch (error) {
    console.error("Error adding service:", error)
    return NextResponse.json({ error: "Failed to add service" }, { status: 500 })
  }
}
