import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const revenueData = await sql`
      SELECT 
        TO_CHAR(payment_date, 'Mon') as month,
        EXTRACT(MONTH FROM payment_date) as month_num,
        SUM(amount) as revenue
      FROM payments 
      WHERE payment_date >= CURRENT_DATE - INTERVAL '6 months'
        AND status = 'completed'
      GROUP BY EXTRACT(MONTH FROM payment_date), TO_CHAR(payment_date, 'Mon')
      ORDER BY month_num DESC
      LIMIT 6
    `

    const chartData = revenueData
      .map((item, index, array) => {
        const prevRevenue = array[index + 1]?.revenue || item.revenue
        const growth = prevRevenue > 0 ? (((item.revenue - prevRevenue) / prevRevenue) * 100).toFixed(0) : "0"

        return {
          month: item.month,
          value: Number.parseFloat(item.revenue),
          height: `${Math.min((item.revenue / Math.max(...revenueData.map((d) => d.revenue))) * 80, 80)}%`,
          growth: `${growth >= 0 ? "+" : ""}${growth}%`,
        }
      })
      .reverse()

    return NextResponse.json({
      success: true,
      data: chartData,
    })
  } catch (error) {
    console.error("[v0] Revenue data error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch revenue data" }, { status: 500 })
  }
}
