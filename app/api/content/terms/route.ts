import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const content = await sql`
      SELECT content, updated_at 
      FROM company_content 
      WHERE type = 'terms' 
      ORDER BY updated_at DESC 
      LIMIT 1
    `

    if (content.length > 0) {
      return NextResponse.json({
        content: JSON.parse(content[0].content),
        lastUpdated: content[0].updated_at,
      })
    }

    return NextResponse.json({ error: "Terms content not found" }, { status: 404 })
  } catch (error) {
    console.error("[v0] Error fetching terms content:", error)
    return NextResponse.json({ error: "Failed to fetch terms content" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    // Update or insert terms content
    await sql`
      INSERT INTO company_content (type, content, updated_at)
      VALUES ('terms', ${JSON.stringify(content)}, NOW())
      ON CONFLICT (type) 
      DO UPDATE SET 
        content = ${JSON.stringify(content)},
        updated_at = NOW()
    `

    return NextResponse.json({ success: true, message: "Terms content saved successfully" })
  } catch (error) {
    console.error("[v0] Error saving terms content:", error)
    return NextResponse.json({ error: "Failed to save terms content" }, { status: 500 })
  }
}
