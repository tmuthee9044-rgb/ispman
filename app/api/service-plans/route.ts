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
        speed_down,
        speed_up,
        fup_limit,
        fup_speed,
        category,
        tax_rate,
        setup_fee,
        installation_fee,
        equipment_fee,
        contract_period,
        status,
        created_at
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
      speed: `${plan.speed_down}/${plan.speed_up} Mbps`,
      category: plan.category,
      fupLimit: plan.fup_limit,
      fupSpeed: plan.fup_speed,
      taxRate: Number(plan.tax_rate || 16),
      setupFee: Number(plan.setup_fee || 0),
      installationFee: Number(plan.installation_fee || 0),
      equipmentFee: Number(plan.equipment_fee || 0),
      contractPeriod: Number(plan.contract_period || 12),
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
        fupLimit: 50,
        fupSpeed: "2/1 Mbps",
        taxRate: 16,
        setupFee: 500,
        installationFee: 1000,
        equipmentFee: 2500,
        contractPeriod: 12,
      },
      {
        id: 2,
        name: "Standard Home",
        description: "Great for streaming and working from home",
        price: 4999,
        speed: "25/10 Mbps",
        category: "residential",
        fupLimit: 100,
        fupSpeed: "5/2 Mbps",
        taxRate: 16,
        setupFee: 500,
        installationFee: 1500,
        equipmentFee: 3500,
        contractPeriod: 12,
      },
      {
        id: 3,
        name: "Premium Home",
        description: "Ideal for heavy usage and gaming",
        price: 7999,
        speed: "50/25 Mbps",
        category: "residential",
        fupLimit: 200,
        fupSpeed: "10/5 Mbps",
        taxRate: 16,
        setupFee: 0,
        installationFee: 2000,
        equipmentFee: 5000,
        contractPeriod: 12,
      },
      {
        id: 4,
        name: "Business Starter",
        description: "Enterprise-grade connectivity for small business",
        price: 14999,
        speed: "100/50 Mbps",
        category: "business",
        fupLimit: null,
        fupSpeed: null,
        taxRate: 16,
        setupFee: 0,
        installationFee: 3000,
        equipmentFee: 8000,
        contractPeriod: 24,
      },
      {
        id: 5,
        name: "Enterprise Pro",
        description: "Maximum performance for large enterprises",
        price: 49999,
        speed: "500/250 Mbps",
        category: "enterprise",
        fupLimit: null,
        fupSpeed: null,
        taxRate: 16,
        setupFee: 0,
        installationFee: 5000,
        equipmentFee: 15000,
        contractPeriod: 36,
      },
    ]

    return NextResponse.json({
      success: true,
      plans: fallbackPlans,
    })
  }
}
