import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const employees = await sql`
      SELECT 
        id, employee_id, first_name, last_name, 
        CONCAT(first_name, ' ', last_name) as name,
        email, phone, position, department, hire_date, salary, status, created_at
      FROM employees 
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      success: true,
      employees: employees,
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
    const contentType = request.headers.get("content-type")
    let data: any

    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData()
      data = Object.fromEntries(formData.entries())
    } else {
      data = await request.json()
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      basicSalary,
      allowances,
      employeeId,
      nationalId,
      kraPin,
      nssfNumber,
      shaNumber,
      address,
      emergencyContact,
      emergencyPhone,
      bankName,
      bankAccount,
      createUserAccount,
      userRole,
      startDate,
      dateOfBirth,
      gender,
      maritalStatus,
      contractType,
      employmentType,
      workLocation,
      benefits,
      qualifications,
      experience,
      skills,
      notes,
    } = data

    // Generate employee ID if not provided
    const finalEmployeeId = employeeId || `EMP${Date.now().toString().slice(-6)}`

    const result = await sql`
      INSERT INTO employees (
        employee_id, first_name, last_name, email, phone, position,
        department, salary, allowances, national_id, kra_pin, nssf_number, 
        sha_number, hire_date, date_of_birth, gender, marital_status,
        address, emergency_contact, emergency_phone, bank_name, bank_account,
        contract_type, employment_type, work_location, benefits,
        qualifications, experience, skills, notes, status, created_at
      ) VALUES (
        ${finalEmployeeId}, ${firstName}, ${lastName}, ${email}, ${phone}, ${position},
        ${department}, ${Number.parseFloat(basicSalary) || 0}, ${Number.parseFloat(allowances) || 0}, 
        ${nationalId}, ${kraPin}, ${nssfNumber}, ${shaNumber}, 
        ${startDate ? new Date(startDate).toISOString() : new Date().toISOString()},
        ${dateOfBirth ? new Date(dateOfBirth).toISOString() : null}, ${gender}, ${maritalStatus},
        ${address}, ${emergencyContact}, ${emergencyPhone}, ${bankName}, ${bankAccount},
        ${contractType}, ${employmentType}, ${workLocation}, ${benefits},
        ${qualifications}, ${experience}, ${skills}, ${notes}, 'active', NOW()
      )
      RETURNING *
    `

    // Create user account if requested
    if (createUserAccount === "true" || createUserAccount === true) {
      try {
        const username = `${firstName?.toLowerCase()}.${lastName?.toLowerCase()}`
        const tempPassword = "temp_password_hash" // This should be properly hashed in production

        await sql`
          INSERT INTO users (username, email, password_hash, role, status, created_at)
          VALUES (${username}, ${email}, ${tempPassword}, ${userRole || "employee"}, 'active', NOW())
        `

        // Link employee to user account
        const user = await sql`
          SELECT id FROM users WHERE username = ${username}
        `

        if (user.length > 0) {
          await sql`
            UPDATE employees 
            SET user_id = ${user[0].id}
            WHERE employee_id = ${finalEmployeeId}
          `
        }
      } catch (userError) {
        console.error("Error creating user account:", userError)
        // Continue even if user creation fails
      }
    }

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
