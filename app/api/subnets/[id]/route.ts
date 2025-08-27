import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, network, cidr, gateway, dns_servers, description, status } = body
    const subnetId = Number.parseInt(params.id)

    const [subnet] = await sql`
      UPDATE subnets 
      SET name = ${name}, 
          network = ${network + "/" + cidr}::cidr, 
          gateway = ${gateway}::inet, 
          dns_servers = ${dns_servers}, 
          description = ${description},
          status = ${status}
      WHERE id = ${subnetId}
      RETURNING *
    `

    if (!subnet) {
      return NextResponse.json({ error: "Subnet not found" }, { status: 404 })
    }

    return NextResponse.json(subnet)
  } catch (error) {
    console.error("Error updating subnet:", error)
    return NextResponse.json({ error: "Failed to update subnet" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const subnetId = Number.parseInt(params.id)

    const [ipCount] = await sql`
      SELECT COUNT(*) as count FROM ip_addresses 
      WHERE subnet_id = ${subnetId} AND status = 'allocated'
    `

    if (ipCount.count > 0) {
      return NextResponse.json({ error: "Cannot delete subnet with allocated IP addresses" }, { status: 400 })
    }

    await sql`DELETE FROM subnets WHERE id = ${subnetId}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting subnet:", error)
    return NextResponse.json({ error: "Failed to delete subnet" }, { status: 500 })
  }
}
