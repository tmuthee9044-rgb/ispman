import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const employees = await sql`
      SELECT 
        id, employee_id, first_name, last_name, email, phone, position,
        department, hire_date, salary, status, created_at
      FROM employees 
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      success: true,
      data: employees,
    })
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch employees",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      hireDate,
      salary,
      address,
      emergencyContact,
      emergencyPhone,
      bankAccount,
      taxId,
    } = data

    // Generate employee ID
    const employeeId = `EMP${Date.now().toString().slice(-6)}`

    const result = await sql`
      INSERT INTO employees (
        employee_id, first_name, last_name, email, phone, position,
        department, hire_date, salary, address, emergency_contact,
        emergency_phone, bank_account, tax_id, status, created_at
      ) VALUES (
        ${employeeId}, ${firstName}, ${lastName}, ${email}, ${phone}, ${position},
        ${department}, ${hireDate}, ${salary}, ${address}, ${emergencyContact},
        ${emergencyPhone}, ${bankAccount}, ${taxId}, 'active', NOW()
      )
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      message: "Employee created successfully",
      data: result[0],
    })
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create employee",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
