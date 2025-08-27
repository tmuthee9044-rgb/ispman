import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { action } = body
    const deviceId = Number.parseInt(params.id)

    const [device] = await sql`
      SELECT * FROM network_devices WHERE id = ${deviceId}
    `

    if (!device) {
      return NextResponse.json({ error: "Network device not found" }, { status: 404 })
    }

    switch (action) {
      case "restart":
        // In a real implementation, this would send commands to the router
        await sql`
          UPDATE network_devices 
          SET status = 'restarting', last_seen = NOW()
          WHERE id = ${deviceId}
        `

        // Simulate restart process
        setTimeout(async () => {
          try {
            await sql`
              UPDATE network_devices 
              SET status = 'online', last_seen = NOW()
              WHERE id = ${deviceId}
            `
          } catch (error) {
            console.error("Error updating device status after restart:", error)
          }
        }, 30000) // 30 seconds restart simulation

        return NextResponse.json({
          success: true,
          message: `Restart command sent to ${device.name}. Device will be back online in ~30 seconds.`,
        })

      case "ping":
        const pingSuccess = Math.random() > 0.1 // 90% success rate
        const latency = Math.floor(Math.random() * 50) + 1

        if (pingSuccess) {
          await sql`
            UPDATE network_devices 
            SET status = 'online', last_seen = NOW()
            WHERE id = ${deviceId}
          `
          return NextResponse.json({
            success: true,
            message: `Ping successful. Latency: ${latency}ms`,
            data: { latency, status: "online" },
          })
        } else {
          await sql`
            UPDATE network_devices 
            SET status = 'offline'
            WHERE id = ${deviceId}
          `
          return NextResponse.json({
            success: false,
            message: `Ping failed. Device may be offline.`,
            data: { status: "offline" },
          })
        }

      case "update_firmware":
        await sql`
          UPDATE network_devices 
          SET status = 'updating'
          WHERE id = ${deviceId}
        `

        setTimeout(async () => {
          try {
            await sql`
              UPDATE network_devices 
              SET status = 'online', last_seen = NOW()
              WHERE id = ${deviceId}
            `
          } catch (error) {
            console.error("Error updating device status after firmware update:", error)
          }
        }, 120000) // 2 minutes update simulation

        return NextResponse.json({
          success: true,
          message: `Firmware update initiated for ${device.name}. This may take several minutes.`,
        })

      case "backup_config":
        return NextResponse.json({
          success: true,
          message: `Configuration backup created for ${device.name}`,
          data: {
            backup_id: `backup_${deviceId}_${Date.now()}`,
            timestamp: new Date().toISOString(),
          },
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error executing device action:", error)
    return NextResponse.json({ error: "Failed to execute device action" }, { status: 500 })
  }
}
