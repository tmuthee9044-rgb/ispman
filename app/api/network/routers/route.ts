import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const routers = await sql`
      SELECT 
        id,
        name,
        type as model,
        ip_address,
        location,
        status,
        mac_address,
        configuration,
        created_at,
        last_seen
      FROM network_devices 
      WHERE type LIKE '%router%' OR type LIKE '%gateway%'
      ORDER BY created_at DESC
    `

    const formattedRouters = routers.map((router) => {
      const config = router.configuration || {}
      const lastSeen = router.last_seen ? new Date(router.last_seen) : new Date()
      const createdAt = new Date(router.created_at)
      const uptimeMs = lastSeen.getTime() - createdAt.getTime()
      const uptimeDays = Math.floor(uptimeMs / (1000 * 60 * 60 * 24))
      const uptimeHours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

      return {
        id: router.id,
        name: router.name || `Router ${router.id}`,
        model: router.model || "Unknown Model",
        ipAddress: router.ip_address || "0.0.0.0",
        location: router.location || "Unknown Location",
        status: router.status || "offline",
        uptime: `${uptimeDays} days, ${uptimeHours} hours`,
        bandwidth: {
          used: Math.floor(Math.random() * 100), // This would come from monitoring data
          total: 100,
        },
        connectedDevices: Math.floor(Math.random() * 200) + 50, // This would come from DHCP/ARP tables
        temperature: Math.floor(Math.random() * 30) + 25, // This would come from SNMP monitoring
        lastUpdate: lastSeen.toLocaleString(),
        signalStrength: router.status === "online" ? Math.floor(Math.random() * 30) + 70 : 0,
        firmwareVersion: config.firmware_version || "Unknown",
        manufacturer: config.manufacturer || "Unknown",
        macAddress: router.mac_address || "00:00:00:00:00:00",
      }
    })

    return NextResponse.json({
      success: true,
      data: formattedRouters,
    })
  } catch (error) {
    console.error("[v0] Network routers error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch network routers" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, model, ipAddress, location, macAddress, manufacturer } = body

    const result = await sql`
      INSERT INTO network_devices (name, type, ip_address, location, mac_address, status, configuration)
      VALUES (${name}, ${model}, ${ipAddress}, ${location}, ${macAddress}, 'offline', ${JSON.stringify({ manufacturer })})
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: result[0],
    })
  } catch (error) {
    console.error("[v0] Create router error:", error)
    return NextResponse.json({ success: false, error: "Failed to create router" }, { status: 500 })
  }
}
