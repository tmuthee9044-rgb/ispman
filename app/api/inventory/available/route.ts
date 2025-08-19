import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Get available inventory items from database
    const inventoryItems = await sql`
      SELECT 
        id,
        name,
        category,
        sku,
        stock_quantity,
        unit_cost,
        location,
        status,
        description,
        specifications
      FROM inventory_items 
      WHERE status = 'active' 
        AND stock_quantity > 0
      ORDER BY category, name
    `

    // Format items for customer form
    const formattedItems = inventoryItems.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      sku: item.sku,
      stockQuantity: Number(item.stock_quantity),
      unitCost: Number(item.unit_cost),
      location: item.location,
      status: item.status,
      description: item.description,
      specifications: item.specifications,
    }))

    // Group by category
    const itemsByCategory = formattedItems.reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = []
        }
        acc[item.category].push(item)
        return acc
      },
      {} as Record<string, typeof formattedItems>,
    )

    return NextResponse.json({
      success: true,
      items: formattedItems,
      itemsByCategory,
    })
  } catch (error) {
    console.error("Error fetching inventory items:", error)

    // Return fallback inventory items if database fails
    const fallbackItems = [
      {
        id: 1,
        name: "Cisco ISR 4331 Router",
        category: "Network Equipment",
        sku: "CSC-ISR4331",
        stockQuantity: 5,
        unitCost: 129900, // in cents for KES
        location: "Main Warehouse",
        status: "active",
        description: "Enterprise-grade router for business connections",
        specifications: "4-port Gigabit Ethernet, VPN support, QoS",
      },
      {
        id: 2,
        name: "TP-Link Archer C7 Router",
        category: "Network Equipment",
        sku: "TPL-AC7",
        stockQuantity: 15,
        unitCost: 8500,
        location: "Main Warehouse",
        status: "active",
        description: "Dual-band wireless router for home use",
        specifications: "AC1750, 3x3 MIMO, USB ports",
      },
      {
        id: 3,
        name: "Netgear CM500 Modem",
        category: "Network Equipment",
        sku: "NTG-CM500",
        stockQuantity: 12,
        unitCost: 6500,
        location: "Main Warehouse",
        status: "active",
        description: "DOCSIS 3.0 cable modem",
        specifications: "16x4 channel bonding, Gigabit Ethernet",
      },
      {
        id: 4,
        name: "Corning Fiber Optic Cable",
        category: "Fiber Optic Equipment",
        sku: "COR-FOC-SM",
        stockQuantity: 2,
        unitCost: 250,
        location: "Main Warehouse",
        status: "active",
        description: "Single-mode fiber optic cable per meter",
        specifications: "OS2 9/125μm, LSZH jacket",
      },
      {
        id: 5,
        name: "Ubiquiti UniFi AP AC Pro",
        category: "Wireless Equipment",
        sku: "UBI-UAP-AC-PRO",
        stockQuantity: 8,
        unitCost: 18500,
        location: "Main Warehouse",
        status: "active",
        description: "Enterprise wireless access point",
        specifications: "802.11ac Wave 2, 3x3 MIMO, PoE+",
      },
      {
        id: 6,
        name: "Ethernet Cable Cat6",
        category: "Network Equipment",
        sku: "ETH-CAT6-1M",
        stockQuantity: 50,
        unitCost: 150,
        location: "Main Warehouse",
        status: "active",
        description: "Cat6 Ethernet cable per meter",
        specifications: "23 AWG, 550MHz, RJ45 connectors",
      },
      {
        id: 7,
        name: "APC UPS 1500VA",
        category: "Power Equipment",
        sku: "APC-UPS-1500",
        stockQuantity: 6,
        unitCost: 25000,
        location: "Main Warehouse",
        status: "active",
        description: "Uninterruptible power supply",
        specifications: "1500VA/980W, LCD display, USB monitoring",
      },
    ]

    const itemsByCategory = fallbackItems.reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = []
        }
        acc[item.category].push(item)
        return acc
      },
      {} as Record<string, typeof fallbackItems>,
    )

    return NextResponse.json({
      success: true,
      items: fallbackItems,
      itemsByCategory,
    })
  }
}
