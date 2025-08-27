import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deviceId = Number.parseInt(params.id)

    const [device] = await sql`
      SELECT * FROM network_devices WHERE id = ${deviceId}
    `

    if (!device) {
      return NextResponse.json({ error: "Network device not found" }, { status: 404 })
    }

    return NextResponse.json(device)
  } catch (error) {
    console.error("Error fetching network device:", error)
    return NextResponse.json({ error: "Failed to fetch network device" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, type, ip_address, mac_address, location, configuration, status } = body
    const deviceId = Number.parseInt(params.id)

    const [device] = await sql`
      UPDATE network_devices 
      SET name = ${name}, 
          type = ${type}, 
          ip_address = ${ip_address}::inet, 
          mac_address = ${mac_address}, 
          location = ${location}, 
          configuration = ${JSON.stringify(configuration)},
          status = ${status},
          last_seen = NOW()
      WHERE id = ${deviceId}
      RETURNING *
    `

    if (!device) {
      return NextResponse.json({ error: "Network device not found" }, { status: 404 })
    }

    return NextResponse.json(device)
  } catch (error) {
    console.error("Error updating network device:", error)
    return NextResponse.json({ error: "Failed to update network device" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deviceId = Number.parseInt(params.id)

    await sql`DELETE FROM network_devices WHERE id = ${deviceId}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting network device:", error)
    return NextResponse.json({ error: "Failed to delete network device" }, { status: 500 })
  }
}
