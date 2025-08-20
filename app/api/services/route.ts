import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const { basic, speed, pricing, fup, advanced, qos, restrictions } = data

    console.log("[v0] Creating service plan with data:", data)

    const priorityLevelMap: { [key: string]: number } = {
      low: 1,
      standard: 2,
      high: 3,
      critical: 4,
    }

    const priorityLevelInt = priorityLevelMap[speed.priorityLevel] || 2

    const result = await sql`
      INSERT INTO service_plans (
        name, description, service_type, category, status,
        download_speed, upload_speed, guaranteed_download, guaranteed_upload,
        burst_download, burst_upload, burst_duration, aggregation_ratio, priority_level,
        price, setup_fee, billing_cycle, contract_length,
        promo_price, promo_enabled, promo_duration, currency, tax_included, tax_rate,
        fup_enabled, data_limit, limit_type, action_after_limit, throttle_speed,
        reset_day, warning_threshold, features, qos_config, restrictions,
        fair_usage_policy, qos_settings,
        created_at, updated_at
      ) VALUES (
        ${basic.planName}, ${basic.description}, ${basic.serviceType}, ${basic.category}, ${basic.status},
        ${parseIntOrNull(speed.downloadSpeed[0]) || 0}, ${parseIntOrNull(speed.uploadSpeed[0]) || 0}, 
        ${parseIntOrNull(speed.guaranteedDownload[0]) || 0}, ${parseIntOrNull(speed.guaranteedUpload[0]) || 0},
        ${parseIntOrNull(speed.burstDownload[0]) || 0}, ${parseIntOrNull(speed.burstUpload[0]) || 0}, 
        ${parseIntOrNull(speed.burstDuration[0]) || 0}, ${parseIntOrNull(speed.aggregationRatio[0]) || 1}, ${priorityLevelInt},
        ${parseFloatOrNull(pricing.monthlyPrice) || 0}, ${parseFloatOrNull(pricing.setupFee) || 0}, 
        ${pricing.billingCycle || "monthly"}, ${parseIntOrNull(pricing.contractLength)},
        ${parseFloatOrNull(pricing.promoPrice)}, ${pricing.promoEnabled || false}, 
        ${parseIntOrNull(pricing.promoDuration)}, ${pricing.currency || "KES"}, 
        ${pricing.taxIncluded || false}, ${parseFloatOrNull(pricing.taxRate[0]) || 0},
        ${fup.enabled || false}, ${parseIntOrNull(fup.dataLimit)}, 
        ${fup.limitType || "monthly"}, ${fup.actionAfterLimit || "throttle"}, 
        ${parseIntOrNull(fup.throttleSpeed[0]) || 0},
        ${parseIntOrNull(fup.resetDay) || 1}, ${parseIntOrNull(fup.warningThreshold[0]) || 80}, 
        ${JSON.stringify(advanced)}, ${JSON.stringify(qos)}, ${JSON.stringify(restrictions)},
        ${fup.enabled ? `Data limit: ${fup.dataLimit || "unlimited"}, Action: ${fup.actionAfterLimit}` : null},
        ${qos.enabled ? JSON.stringify(qos) : null},
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      ) RETURNING id, name
    `

    console.log("[v0] Service plan created successfully:", result[0])

    return NextResponse.json({
      success: true,
      message: "Service plan created successfully",
      data: result[0],
    })
  } catch (error) {
    console.error("[v0] Error creating service plan:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create service plan",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const servicePlans = await sql`
      SELECT 
        id, name, description, service_type, category, status,
        download_speed, upload_speed, price, setup_fee,
        billing_cycle, contract_length, promo_enabled, promo_price,
        fup_enabled, data_limit, features, created_at, updated_at
      FROM service_plans 
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      success: true,
      data: servicePlans,
    })
  } catch (error) {
    console.error("[v0] Error fetching service plans:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch service plans",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
