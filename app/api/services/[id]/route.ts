import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export const dynamic = "force-dynamic"

const parseIntOrNull = (value: any): number | null => {
  if (value === "" || value === null || value === undefined) return null
  const parsed = Number.parseInt(value, 10)
  return isNaN(parsed) ? null : parsed
}

const parseFloatOrNull = (value: any): number | null => {
  if (value === "" || value === null || value === undefined) return null
  const parsed = Number.parseFloat(value)
  return isNaN(parsed) ? null : parsed
}

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

    const priorityLevelMap: { [key: string]: number } = {
      low: 1,
      standard: 2,
      high: 3,
      critical: 4,
    }

    const priorityLevelInt =
      typeof data.priority_level === "string" ? priorityLevelMap[data.priority_level] || 2 : data.priority_level || 2

    const result = await sql`
      UPDATE service_plans 
      SET 
        name = ${data.name},
        description = ${data.description},
        service_type = ${data.service_type},
        category = ${data.category},
        status = ${data.status},
        download_speed = ${parseIntOrNull(data.download_speed) || 0},
        upload_speed = ${parseIntOrNull(data.upload_speed) || 0},
        guaranteed_download = ${parseIntOrNull(data.guaranteed_download) || 0},
        guaranteed_upload = ${parseIntOrNull(data.guaranteed_upload) || 0},
        burst_download = ${parseIntOrNull(data.burst_download) || 0},
        burst_upload = ${parseIntOrNull(data.burst_upload) || 0},
        burst_duration = ${parseIntOrNull(data.burst_duration) || 0},
        aggregation_ratio = ${parseIntOrNull(data.aggregation_ratio) || 1},
        priority_level = ${priorityLevelInt},
        price = ${parseFloatOrNull(data.price) || 0},
        setup_fee = ${parseFloatOrNull(data.setup_fee) || 0},
        billing_cycle = ${data.billing_cycle || "monthly"},
        contract_length = ${data.contract_length || null},
        promo_price = ${parseFloatOrNull(data.promo_price)},
        promo_enabled = ${data.promo_enabled || false},
        promo_duration = ${data.promo_duration || null},
        currency = ${data.currency || "KES"},
        tax_included = ${data.tax_included || false},
        tax_rate = ${parseFloatOrNull(data.tax_rate) || 0},
        fup_enabled = ${data.fup_enabled || false},
        data_limit = ${parseIntOrNull(data.data_limit)},
        limit_type = ${data.limit_type || "monthly"},
        action_after_limit = ${data.action_after_limit || "throttle"},
        throttle_speed = ${parseIntOrNull(data.throttle_speed)},
        reset_day = ${data.reset_day || "1"},
        warning_threshold = ${parseIntOrNull(data.warning_threshold) || 80},
        features = ${JSON.stringify(data.advanced_features || {})},
        qos_config = ${JSON.stringify(data.qos_config || {})},
        qos_settings = ${data.qos_config ? JSON.stringify(data.qos_config) : null},
        restrictions = ${JSON.stringify(data.restrictions || {})},
        fair_usage_policy = ${data.fup_enabled ? `Data limit: ${data.data_limit || "unlimited"}, Action: ${data.action_after_limit}` : null},
        updated_at = CURRENT_TIMESTAMP
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
