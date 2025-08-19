import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const { basic, speed, pricing, fup, advanced, qos, restrictions } = data

    console.log("[v0] Creating service plan with data:", data)

    const result = await sql`
      INSERT INTO service_plans (
        name, description, service_type, category, status,
        download_speed, upload_speed, guaranteed_download, guaranteed_upload,
        burst_download, burst_upload, burst_duration, aggregation_ratio, priority_level,
        price, setup_fee, billing_cycle, contract_length,
        promo_price, promo_enabled, promo_duration, currency, tax_included, tax_rate,
        fup_enabled, data_limit, limit_type, action_after_limit, throttle_speed,
        reset_day, warning_threshold, features, qos_config, restrictions,
        created_at, updated_at
      ) VALUES (
        ${basic.planName}, ${basic.description}, ${basic.serviceType}, ${basic.category}, ${basic.status},
        ${speed.downloadSpeed[0]}, ${speed.uploadSpeed[0]}, ${speed.guaranteedDownload[0]}, ${speed.guaranteedUpload[0]},
        ${speed.burstDownload[0]}, ${speed.burstUpload[0]}, ${speed.burstDuration[0]}, ${speed.aggregationRatio[0]}, ${speed.priorityLevel},
        ${Number.parseFloat(pricing.monthlyPrice) || 0}, ${Number.parseFloat(pricing.setupFee) || 0}, ${pricing.billingCycle}, ${pricing.contractLength},
        ${Number.parseFloat(pricing.promoPrice) || null}, ${pricing.promoEnabled}, ${pricing.promoDuration}, ${pricing.currency}, ${pricing.taxIncluded}, ${pricing.taxRate[0]},
        ${fup.enabled}, ${fup.dataLimit}, ${fup.limitType}, ${fup.actionAfterLimit}, ${fup.throttleSpeed[0]},
        ${fup.resetDay}, ${fup.warningThreshold[0]}, ${JSON.stringify(advanced)}, ${JSON.stringify(qos)}, ${JSON.stringify(restrictions)},
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
