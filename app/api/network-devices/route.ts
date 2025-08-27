import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const devices = await sql`
      SELECT * FROM network_devices 
      ORDER BY created_at DESC
    `

    const transformedDevices = devices.map((device) => ({
      id: device.id,
      name: device.name,
      type: device.type,
      ip_address: device.ip_address,
      mac_address: device.mac_address,
      location: device.location,
      status: device.status,
      configuration: device.configuration,
      last_seen: device.last_seen,
      created_at: device.created_at,
    }))

    return NextResponse.json(transformedDevices)
  } catch (error) {
    console.error("Error fetching network devices:", error)
    return NextResponse.json({ error: "Failed to fetch network devices" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, ip_address, mac_address, location, configuration } = body

    const [device] = await sql`
      INSERT INTO network_devices (name, type, ip_address, mac_address, location, configuration, status, created_at, last_seen)
      VALUES (${name}, ${type}, ${ip_address}::inet, ${mac_address}, ${location}, ${JSON.stringify(configuration)}, 'online', NOW(), NOW())
      RETURNING *
    `

    return NextResponse.json(device, { status: 201 })
  } catch (error) {
    console.error("Error creating network device:", error)
    return NextResponse.json({ error: "Failed to create network device" }, { status: 500 })
  }
}
