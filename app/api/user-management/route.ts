import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const users = await sql`
      SELECT 
        u.id,
        u.username,
        u.email,
        u.role,
        u.status,
        u.last_login,
        u.created_at,
        e.first_name,
        e.last_name,
        e.employee_id,
        e.department,
        e.position
      FROM users u
      LEFT JOIN employees e ON u.employee_id = e.id
      ORDER BY u.created_at DESC
    `

    const roles = await sql`
      SELECT 
        role_name as name,
        description,
        permissions,
        (SELECT COUNT(*) FROM users WHERE role = role_name AND status = 'active') as user_count
      FROM user_roles
      ORDER BY role_name
    `

    return NextResponse.json({
      users: users.map((user) => ({
        id: user.id,
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username,
        email: user.email,
        role: user.role,
        department: user.department || "N/A",
        status: user.status,
        lastLogin: user.last_login ? new Date(user.last_login).toLocaleString() : "Never",
        employeeId: user.employee_id || "N/A",
      })),
      roles: roles.map((role) => ({
        name: role.name,
        description: role.description,
        permissions: role.permissions ? role.permissions.split(",") : [],
        userCount: Number.parseInt(role.user_count) || 0,
      })),
    })
  } catch (error) {
    console.error("Error fetching user management data:", error)
    return NextResponse.json({ error: "Failed to fetch user management data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    if (action === "create_user") {
      const { username, email, role, employeeId, password } = data

      const result = await sql`
        INSERT INTO users (username, email, role, employee_id, password_hash, status, created_at)
        VALUES (${username}, ${email}, ${role}, ${employeeId}, ${password}, 'active', NOW())
        RETURNING id, username, email, role
      `

      return NextResponse.json({ success: true, user: result[0] })
    }

    if (action === "create_role") {
      const { name, description, permissions } = data

      await sql`
        INSERT INTO user_roles (role_name, description, permissions, created_at)
        VALUES (${name}, ${description}, ${permissions.join(",")}, NOW())
      `

      return NextResponse.json({ success: true })
    }

    if (action === "update_settings") {
      const settings = data

      for (const [key, value] of Object.entries(settings)) {
        await sql`
          INSERT INTO system_config (config_key, config_value, updated_at)
          VALUES (${`user_management.${key}`}, ${JSON.stringify(value)}, NOW())
          ON CONFLICT (config_key) 
          DO UPDATE SET config_value = ${JSON.stringify(value)}, updated_at = NOW()
        `
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error in user management operation:", error)
    return NextResponse.json({ error: "Operation failed" }, { status: 500 })
  }
}
