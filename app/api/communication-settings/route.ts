import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const settings = await sql`
      SELECT setting_type, setting_key, setting_value, is_encrypted
      FROM communication_settings
      WHERE active = true
      ORDER BY setting_type, setting_key
    `

    // Group settings by type
    const groupedSettings = settings.reduce((acc: any, setting) => {
      if (!acc[setting.setting_type]) {
        acc[setting.setting_type] = {}
      }
      // Don't return encrypted values in plain text
      acc[setting.setting_type][setting.setting_key] = setting.is_encrypted ? "***" : setting.setting_value
      return acc
    }, {})

    return NextResponse.json({ success: true, settings: groupedSettings })
  } catch (error) {
    console.error("Error fetching communication settings:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { settingType, settings } = await request.json()

    // Update settings for the specified type
    for (const [key, value] of Object.entries(settings)) {
      const isEncrypted = ["password", "api_key", "token"].some((field) => key.includes(field))

      await sql`
        INSERT INTO communication_settings (setting_type, setting_key, setting_value, is_encrypted)
        VALUES (${settingType}, ${key}, ${value as string}, ${isEncrypted})
        ON CONFLICT (setting_type, setting_key)
        DO UPDATE SET setting_value = ${value as string}, updated_at = NOW()
      `
    }

    return NextResponse.json({ success: true, message: "Settings updated successfully" })
  } catch (error) {
    console.error("Error updating communication settings:", error)
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 })
  }
}
