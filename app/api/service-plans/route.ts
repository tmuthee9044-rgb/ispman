import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Get service plans from database
    const servicePlans = await sql`
      SELECT 
        id,
        name,
        description,
        price,
        download_speed,
        upload_speed,
        data_limit,
        throttle_speed,
        category,
        tax_rate,
        setup_fee,
        contract_length,
        status,
        created_at,
        billing_cycle,
        guaranteed_download,
        guaranteed_upload,
        burst_download,
        burst_upload,
        features
      FROM service_plans 
      WHERE status = 'active'
      ORDER BY 
        CASE category 
          WHEN 'residential' THEN 1 
          WHEN 'business' THEN 2 
          WHEN 'enterprise' THEN 3 
        END,
        price ASC
    `

    // Format plans for customer form
    const formattedPlans = servicePlans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: Number(plan.price),
      speed: `${plan.download_speed}/${plan.upload_speed} Mbps`,
      category: plan.category,
      dataLimit: plan.data_limit,
      throttleSpeed: plan.throttle_speed,
      taxRate: Number(plan.tax_rate || 16),
      setupFee: Number(plan.setup_fee || 0),
      contractLength: plan.contract_length,
      billingCycle: plan.billing_cycle,
      guaranteedDownload: plan.guaranteed_download,
      guaranteedUpload: plan.guaranteed_upload,
      burstDownload: plan.burst_download,
      burstUpload: plan.burst_upload,
      features: plan.features || [],
    }))

    return NextResponse.json({
      success: true,
      plans: formattedPlans,
    })
  } catch (error) {
    console.error("Error fetching service plans:", error)

    // Return fallback plans if database fails
    const fallbackPlans = [
      {
        id: 1,
        name: "Basic Home",
        description: "Perfect for light browsing and email",
        price: 2999,
        speed: "10/5 Mbps",
        category: "residential",
        dataLimit: 50,
        throttleSpeed: "2/1 Mbps",
        taxRate: 16,
        setupFee: 500,
        contractLength: 12,
        billingCycle: null,
        guaranteedDownload: null,
        guaranteedUpload: null,
        burstDownload: null,
        burstUpload: null,
        features: [],
      },
      {
        id: 2,
        name: "Standard Home",
        description: "Great for streaming and working from home",
        price: 4999,
        speed: "25/10 Mbps",
        category: "residential",
        dataLimit: 100,
        throttleSpeed: "5/2 Mbps",
        taxRate: 16,
        setupFee: 500,
        contractLength: 12,
        billingCycle: null,
        guaranteedDownload: null,
        guaranteedUpload: null,
        burstDownload: null,
        burstUpload: null,
        features: [],
      },
      {
        id: 3,
        name: "Premium Home",
        description: "Ideal for heavy usage and gaming",
        price: 7999,
        speed: "50/25 Mbps",
        category: "residential",
        dataLimit: 200,
        throttleSpeed: "10/5 Mbps",
        taxRate: 16,
        setupFee: 0,
        contractLength: 12,
        billingCycle: null,
        guaranteedDownload: null,
        guaranteedUpload: null,
        burstDownload: null,
        burstUpload: null,
        features: [],
      },
      {
        id: 4,
        name: "Business Starter",
        description: "Enterprise-grade connectivity for small business",
        price: 14999,
        speed: "100/50 Mbps",
        category: "business",
        dataLimit: null,
        throttleSpeed: null,
        taxRate: 16,
        setupFee: 0,
        contractLength: 24,
        billingCycle: null,
        guaranteedDownload: null,
        guaranteedUpload: null,
        burstDownload: null,
        burstUpload: null,
        features: [],
      },
      {
        id: 5,
        name: "Enterprise Pro",
        description: "Maximum performance for large enterprises",
        price: 49999,
        speed: "500/250 Mbps",
        category: "enterprise",
        dataLimit: null,
        throttleSpeed: null,
        taxRate: 16,
        setupFee: 0,
        contractLength: 36,
        billingCycle: null,
        guaranteedDownload: null,
        guaranteedUpload: null,
        burstDownload: null,
        burstUpload: null,
        features: [],
      },
    ]

    return NextResponse.json({
      success: true,
      plans: fallbackPlans,
    })
  }
}
