import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { action, data } = body
    const userId = params.id

    if (action === "update_user") {
      const { email, role, status } = data

      await sql`
        UPDATE users 
        SET email = ${email}, role = ${role}, status = ${status}, updated_at = NOW()
        WHERE id = ${userId}
      `

      return NextResponse.json({ success: true })
    }

    if (action === "reset_password") {
      const { newPassword } = data

      await sql`
        UPDATE users 
        SET password_hash = ${newPassword}, force_password_change = true, updated_at = NOW()
        WHERE id = ${userId}
      `

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    await sql`
      UPDATE users 
      SET status = 'inactive', updated_at = NOW()
      WHERE id = ${userId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
