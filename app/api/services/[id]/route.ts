import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export const dynamic = "force-dynamic"

// GET - Fetch single service plan
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const serviceId = Number.parseInt(params.id)

    if (isNaN(serviceId)) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 })
    }

    const result = await sql`
      SELECT * FROM service_plans 
      WHERE id = ${serviceId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Service plan not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching service plan:", error)
    return NextResponse.json({ error: "Failed to fetch service plan" }, { status: 500 })
  }
}

// PUT - Update service plan
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const serviceId = Number.parseInt(params.id)

    if (isNaN(serviceId)) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 })
    }

    const data = await request.json()

    const result = await sql`
      UPDATE service_plans 
      SET 
        name = ${data.name},
        description = ${data.description},
        service_type = ${data.service_type},
        category = ${data.category},
        status = ${data.status},
        price = ${data.price},
        setup_fee = ${data.setup_fee},
        billing_cycle = ${data.billing_cycle},
        contract_length = ${data.contract_length},
        currency = ${data.currency},
        tax_included = ${data.tax_included},
        tax_rate = ${data.tax_rate},
        promo_price = ${data.promo_price},
        promo_duration = ${data.promo_duration},
        speed = ${data.speed},
        download_speed = ${data.download_speed},
        upload_speed = ${data.upload_speed},
        priority_level = ${data.priority_level},
        fup_config = ${data.fup_config},
        advanced_features = ${data.advanced_features},
        restrictions = ${data.restrictions},
        updated_at = NOW()
      WHERE id = ${serviceId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Service plan not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Service plan updated successfully",
      service: result[0],
    })
  } catch (error) {
    console.error("Error updating service plan:", error)
    return NextResponse.json({ error: "Failed to update service plan" }, { status: 500 })
  }
}

// DELETE - Delete service plan
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const serviceId = Number.parseInt(params.id)

    if (isNaN(serviceId)) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM service_plans 
      WHERE id = ${serviceId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Service plan not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Service plan deleted successfully" })
  } catch (error) {
    console.error("Error deleting service plan:", error)
    return NextResponse.json({ error: "Failed to delete service plan" }, { status: 500 })
  }
}
