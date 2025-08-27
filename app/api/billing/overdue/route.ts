import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const overdueInvoices = await sql`
      SELECT 
        i.id,
        i.invoice_number as id,
        CONCAT(c.first_name, ' ', c.last_name) as customer,
        c.email,
        c.phone,
        i.amount,
        EXTRACT(DAY FROM (CURRENT_DATE - i.due_date)) as days_overdue,
        i.created_at::date as invoice_date,
        i.due_date,
        i.status,
        sp.name as plan
      FROM invoices i
      JOIN customers c ON i.customer_id = c.id
      LEFT JOIN customer_services cs ON c.id = cs.customer_id
      LEFT JOIN service_plans sp ON cs.service_plan_id = sp.id
      WHERE i.due_date < CURRENT_DATE 
        AND i.status = 'unpaid'
      ORDER BY i.due_date ASC
    `

    const formattedInvoices = overdueInvoices.map((invoice) => ({
      id: invoice.id,
      customer: invoice.customer || "Unknown Customer",
      email: invoice.email || "",
      phone: invoice.phone || "",
      amount: Number.parseFloat(invoice.amount) || 0,
      daysOverdue: Number.parseInt(invoice.days_overdue) || 0,
      invoiceDate: invoice.invoice_date,
      dueDate: invoice.due_date,
      status: "overdue",
      plan: invoice.plan || "No Plan",
    }))

    return NextResponse.json({
      success: true,
      data: formattedInvoices,
    })
  } catch (error) {
    console.error("[v0] Overdue invoices error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch overdue invoices" }, { status: 500 })
  }
}
