import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customerId = params.id
    const serviceData = await request.json()

    const result = await sql`
      INSERT INTO customer_services (
        customer_id, service_plan_id, status, monthly_fee, 
        start_date, installation_date, next_billing_date, 
        ip_address, router_id, auto_renewal, contract_length,
        contract_start_date, setup_fee, notes, created_at
      ) VALUES (
        ${customerId}, 
        ${serviceData.service_plan_id}, 
        ${serviceData.status || "active"},
        ${serviceData.monthly_fee}, 
        ${serviceData.start_date || new Date().toISOString().split("T")[0]},
        ${serviceData.installation_date || new Date().toISOString().split("T")[0]},
        ${serviceData.next_billing_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]},
        ${serviceData.ip_address || null}, 
        ${serviceData.router_id || null}, 
        ${serviceData.auto_renewal !== undefined ? serviceData.auto_renewal : true},
        ${serviceData.contract_length || 12},
        ${serviceData.contract_start_date || new Date().toISOString().split("T")[0]},
        ${serviceData.setup_fee || 0},
        ${serviceData.notes || "Service added via customer portal"},
        NOW()
      ) RETURNING *
    `

    return NextResponse.json({ success: true, service: result[0] })
  } catch (error) {
    console.error("Error adding service:", error)
    return NextResponse.json({ error: "Failed to add service" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customerId = params.id

    const services = await sql`
      SELECT 
        cs.*,
        sp.name as service_name,
        sp.description as service_description,
        sp.download_speed,
        sp.upload_speed,
        sp.data_limit
      FROM customer_services cs
      LEFT JOIN service_plans sp ON cs.service_plan_id = sp.id
      WHERE cs.customer_id = ${customerId}
      ORDER BY cs.created_at DESC
    `

    return NextResponse.json({ success: true, services })
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customerId = params.id
    const { serviceId, action, ...updateData } = await request.json()

    let result

    if (action === "suspend") {
      result = await sql`
        UPDATE customer_services 
        SET 
          status = 'suspended',
          suspension_reason = ${updateData.reason || "Manual suspension"},
          suspended_at = NOW(),
          suspended_by = ${updateData.suspended_by || "System"}
        WHERE id = ${serviceId} AND customer_id = ${customerId}
        RETURNING *
      `
    } else if (action === "reactivate") {
      result = await sql`
        UPDATE customer_services 
        SET 
          status = 'active',
          suspension_reason = NULL,
          suspended_at = NULL,
          suspended_by = NULL
        WHERE id = ${serviceId} AND customer_id = ${customerId}
        RETURNING *
      `
    } else {
      // General update
      const updateFields = []
      const updateValues = []

      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined) {
          updateFields.push(`${key} = $${updateValues.length + 1}`)
          updateValues.push(value)
        }
      })

      if (updateFields.length > 0) {
        updateValues.push(serviceId, customerId)
        result = await sql`
          UPDATE customer_services 
          SET ${sql.unsafe(updateFields.join(", "))}
          WHERE id = $${updateValues.length - 1} AND customer_id = $${updateValues.length}
          RETURNING *
        `
      }
    }

    return NextResponse.json({ success: true, service: result?.[0] })
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customerId = params.id
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get("serviceId")

    if (!serviceId) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM customer_services 
      WHERE id = ${serviceId} AND customer_id = ${customerId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Service deleted successfully" })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}
