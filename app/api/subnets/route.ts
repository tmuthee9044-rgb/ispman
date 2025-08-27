import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { validateAndNormalizeCIDR, validateIPAddress } from "@/lib/cidr-utils"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const subnets = await sql`
      SELECT 
        s.*,
        COUNT(ip.id) as used_ips,
        CASE 
          WHEN s.network::text LIKE '%:%' THEN 18446744073709551616::bigint
          ELSE (2^(32 - masklen(s.network)))::bigint - 2
        END as total_ips
      FROM subnets s
      LEFT JOIN ip_addresses ip ON ip.subnet_id = s.id AND ip.status = 'allocated'
      GROUP BY s.id, s.network
      ORDER BY s.created_at DESC
    `

    const transformedSubnets = subnets.map((subnet) => ({
      id: subnet.id,
      name: subnet.name,
      network: subnet.network.split("/")[0],
      cidr: Number.parseInt(subnet.network.split("/")[1]),
      type: subnet.network.includes(":") ? "ipv6" : "ipv4",
      gateway: subnet.gateway,
      dns_primary: subnet.dns_servers?.[0] || "8.8.8.8",
      dns_secondary: subnet.dns_servers?.[1] || "8.8.4.4",
      dhcp_enabled: true,
      description: subnet.description,
      total_ips: Number(subnet.total_ips),
      used_ips: Number(subnet.used_ips),
      available_ips: Number(subnet.total_ips) - Number(subnet.used_ips),
      status: subnet.status,
      created_at: subnet.created_at,
      updated_at: subnet.created_at,
    }))

    return NextResponse.json(transformedSubnets)
  } catch (error) {
    console.error("Error fetching subnets:", error)
    return NextResponse.json({ error: "Failed to fetch subnets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, network, cidr, gateway, dns_servers, description } = body

    const cidrString = `${network}/${cidr}`
    const cidrValidation = validateAndNormalizeCIDR(cidrString)

    if (!cidrValidation.isValid) {
      return NextResponse.json(
        {
          error: `Invalid CIDR: ${cidrValidation.error}`,
        },
        { status: 400 },
      )
    }

    if (gateway) {
      const gatewayValidation = validateIPAddress(gateway)
      if (!gatewayValidation.isValid) {
        return NextResponse.json(
          {
            error: `Invalid gateway IP: ${gatewayValidation.error}`,
          },
          { status: 400 },
        )
      }
    }

    const existingSubnet = await sql`
      SELECT id FROM subnets WHERE network = ${cidrValidation.normalized}::cidr
    `

    if (existingSubnet.length > 0) {
      return NextResponse.json(
        {
          error: "A subnet with this network already exists",
        },
        { status: 409 },
      )
    }

    const [subnet] = await sql`
      INSERT INTO subnets (name, network, gateway, dns_servers, description, status, created_at)
      VALUES (${name}, ${cidrValidation.normalized}::cidr, ${gateway}::inet, ${dns_servers}, ${description}, 'active', NOW())
      RETURNING *
    `

    return NextResponse.json(subnet, { status: 201 })
  } catch (error) {
    console.error("Error creating subnet:", error)

    if (error.message?.includes("invalid input syntax")) {
      return NextResponse.json(
        {
          error: "Invalid CIDR or IP address format",
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: "Failed to create subnet" }, { status: 500 })
  }
}
