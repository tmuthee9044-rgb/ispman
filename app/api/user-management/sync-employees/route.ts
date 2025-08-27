import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === "sync_all") {
      // Get all active employees who don't have user accounts
      const employeesWithoutUsers = await sql`
        SELECT e.id, e.employee_id, e.first_name, e.last_name, e.email, e.phone, e.position, e.department
        FROM employees e
        LEFT JOIN users u ON e.employee_id = u.username OR e.email = u.email
        WHERE e.status = 'active' AND u.id IS NULL
      `

      const createdUsers = []

      for (const employee of employeesWithoutUsers) {
        // Determine default role based on position/department
        let defaultRole = "employee"
        const position = employee.position?.toLowerCase() || ""
        const department = employee.department?.toLowerCase() || ""

        if (position.includes("manager") || position.includes("supervisor")) {
          defaultRole = "manager"
        } else if (position.includes("technician") || department.includes("technical")) {
          defaultRole = "technician"
        } else if (position.includes("accountant") || department.includes("finance")) {
          defaultRole = "accountant"
        } else if (position.includes("admin") || position.includes("administrator")) {
          defaultRole = "administrator"
        }

        // Generate username (firstname.lastname format)
        const username = `${employee.first_name?.toLowerCase() || "user"}.${employee.last_name?.toLowerCase() || employee.employee_id}`

        // Create user account
        const newUser = await sql`
          INSERT INTO users (username, email, password_hash, role, status, created_at)
          VALUES (
            ${username},
            ${employee.email},
            'temp_password_hash', -- This should be properly hashed
            ${defaultRole},
            'active',
            NOW()
          )
          RETURNING id, username, email, role
        `

        // Link employee to user account
        await sql`
          UPDATE employees 
          SET user_id = ${newUser[0].id}
          WHERE id = ${employee.id}
        `

        createdUsers.push({
          employeeId: employee.employee_id,
          name: `${employee.first_name} ${employee.last_name}`,
          username: username,
          email: employee.email,
          role: defaultRole,
          userId: newUser[0].id,
        })
      }

      return NextResponse.json({
        success: true,
        message: `Successfully created ${createdUsers.length} user accounts`,
        data: createdUsers,
      })
    }

    if (action === "assign_role") {
      const { employeeId, role } = body

      // Update user role based on employee
      await sql`
        UPDATE users 
        SET role = ${role}, updated_at = NOW()
        WHERE id = (
          SELECT user_id FROM employees WHERE employee_id = ${employeeId}
        )
      `

      return NextResponse.json({
        success: true,
        message: "Role assigned successfully",
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid action",
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("Error syncing employees:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to sync employees",
      },
      { status: 500 },
    )
  }
}
