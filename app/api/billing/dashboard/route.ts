import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const invoices = await sql`
      SELECT 
        i.id,
        i.invoice_number as id,
        CONCAT(c.first_name, ' ', c.last_name) as customer,
        c.email,
        i.amount,
        i.status,
        i.created_at as date,
        i.due_date as "dueDate",
        sp.name as plan,
        CASE 
          WHEN i.status = 'overdue' THEN EXTRACT(days FROM NOW() - i.due_date)::integer
          ELSE 0
        END as "daysOverdue"
      FROM invoices i
      JOIN customers c ON i.customer_id = c.id
      LEFT JOIN customer_services cs ON c.id = cs.customer_id
      LEFT JOIN service_plans sp ON cs.service_plan_id = sp.id
      ORDER BY i.created_at DESC
      LIMIT 50
    `

    const payments = await sql`
      SELECT 
        p.id,
        CONCAT(c.first_name, ' ', c.last_name) as customer,
        p.amount,
        p.payment_method as method,
        p.payment_date as date,
        p.status,
        p.transaction_id as reference,
        0 as "processingFee"
      FROM payments p
      JOIN customers c ON p.customer_id = c.id
      ORDER BY p.payment_date DESC
      LIMIT 50
    `

    const stats = await sql`
      SELECT 
        COUNT(CASE WHEN i.status = 'paid' THEN 1 END) as paid_invoices,
        COUNT(CASE WHEN i.status = 'pending' THEN 1 END) as pending_invoices,
        COUNT(CASE WHEN i.status = 'overdue' THEN 1 END) as overdue_invoices,
        COALESCE(SUM(CASE WHEN i.status = 'paid' THEN i.amount END), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN i.status = 'pending' THEN i.amount END), 0) as pending_amount,
        COALESCE(SUM(CASE WHEN i.status = 'overdue' THEN i.amount END), 0) as overdue_amount
      FROM invoices i
      WHERE i.created_at >= DATE_TRUNC('month', CURRENT_DATE)
    `

    return NextResponse.json({
      success: true,
      data: {
        invoices: invoices || [],
        payments: payments || [],
        stats: stats[0] || {
          paid_invoices: 0,
          pending_invoices: 0,
          overdue_invoices: 0,
          total_revenue: 0,
          pending_amount: 0,
          overdue_amount: 0,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching billing data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch billing data" }, { status: 500 })
  }
}
