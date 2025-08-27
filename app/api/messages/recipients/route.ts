import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "all" // customers, employees, or all
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"

    let recipients: any[] = []

    if (type === "customers" || type === "all") {
      let customerQuery = `
        SELECT 
          id, 
          CONCAT(first_name, ' ', last_name) as name,
          first_name,
          last_name,
          email, 
          phone, 
          status,
          'customer' as recipient_type,
          (SELECT plan_name FROM service_plans sp 
           JOIN customer_services cs ON sp.id = cs.service_plan_id 
           WHERE cs.customer_id = customers.id 
           AND cs.status = 'active' 
           LIMIT 1) as plan
        FROM customers 
        WHERE 1=1
      `
      const customerParams: any[] = []
      let paramIndex = 1

      if (search) {
        customerQuery += ` AND (first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR phone ILIKE $${paramIndex})`
        customerParams.push(`%${search}%`)
        paramIndex++
      }

      if (status !== "all") {
        customerQuery += ` AND status = $${paramIndex}`
        customerParams.push(status)
        paramIndex++
      }

      customerQuery += ` ORDER BY first_name, last_name`

      const customers = await sql(customerQuery, customerParams)
      recipients = [...recipients, ...customers]
    }

    if (type === "employees" || type === "all") {
      let employeeQuery = `
        SELECT 
          id,
          CONCAT(first_name, ' ', last_name) as name,
          first_name,
          last_name,
          email,
          phone,
          status,
          'employee' as recipient_type,
          position as plan
        FROM employees 
        WHERE 1=1
      `
      const employeeParams: any[] = []
      let paramIndex = 1

      if (search) {
        employeeQuery += ` AND (first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR phone ILIKE $${paramIndex})`
        employeeParams.push(`%${search}%`)
        paramIndex++
      }

      if (status !== "all") {
        employeeQuery += ` AND status = $${paramIndex}`
        employeeParams.push(status)
        paramIndex++
      }

      employeeQuery += ` ORDER BY first_name, last_name`

      const employees = await sql(employeeQuery, employeeParams)
      recipients = [...recipients, ...employees]
    }

    return NextResponse.json({ success: true, recipients })
  } catch (error) {
    console.error("Error fetching recipients:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch recipients", recipients: [] }, { status: 500 })
  }
}
