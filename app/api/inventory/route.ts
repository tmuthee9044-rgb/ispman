import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Get inventory items with category counts and values
    const items = await sql`
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
        specifications,
        created_at,
        updated_at
      FROM inventory_items
      ORDER BY created_at DESC
    `

    // Calculate category statistics
    const categoryStats = await sql`
      SELECT 
        category,
        COUNT(*) as count,
        SUM(stock_quantity * unit_cost) as value
      FROM inventory_items
      GROUP BY category
      ORDER BY value DESC
    `

    // Get recent movements (if movements table exists)
    const recentMovements = await sql`
      SELECT 
        im.id,
        ii.name as item,
        im.movement_type as type,
        im.quantity,
        im.created_at as date,
        im.reason
      FROM inventory_movements im
      JOIN inventory_items ii ON im.item_id = ii.id
      ORDER BY im.created_at DESC
      LIMIT 10
    `.catch(() => []) // Fallback if movements table doesn't exist

    // Calculate totals
    const totals = await sql`
      SELECT 
        COUNT(*) as total_items,
        COUNT(CASE WHEN stock_quantity <= 5 THEN 1 END) as low_stock_items,
        COUNT(CASE WHEN stock_quantity = 0 THEN 1 END) as out_of_stock,
        SUM(stock_quantity * unit_cost) as total_value
      FROM inventory_items
    `

    // Map categories to icons and colors
    const categoryIcons = {
      "Network Equipment": { icon: "Router", color: "bg-blue-500" },
      "Fiber Optic Equipment": { icon: "Zap", color: "bg-green-500" },
      "Wireless Equipment": { icon: "Wifi", color: "bg-purple-500" },
      "Server Equipment": { icon: "Server", color: "bg-orange-500" },
      "Testing Equipment": { icon: "BarChart3", color: "bg-red-500" },
      "Power Equipment": { icon: "Zap", color: "bg-yellow-500" },
      "Installation Tools": { icon: "Package", color: "bg-gray-500" },
    }

    const categories = categoryStats.map((cat: any) => ({
      name: cat.category,
      count: Number(cat.count),
      value: Number(cat.value),
      icon: categoryIcons[cat.category as keyof typeof categoryIcons]?.icon || "Package",
      color: categoryIcons[cat.category as keyof typeof categoryIcons]?.color || "bg-gray-500",
    }))

    const inventoryData = {
      totalItems: Number(totals[0].total_items),
      lowStockItems: Number(totals[0].low_stock_items),
      outOfStock: Number(totals[0].out_of_stock),
      totalValue: Number(totals[0].total_value),
      categories,
      recentMovements: recentMovements.map((movement: any) => ({
        id: movement.id,
        item: movement.item,
        type: movement.type,
        quantity: Number(movement.quantity),
        date: movement.date,
        reason: movement.reason,
      })),
      items: items.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        sku: item.sku,
        stock_quantity: Number(item.stock_quantity),
        unit_cost: Number(item.unit_cost),
        location: item.location,
        status: item.status,
        description: item.description,
      })),
    }

    return NextResponse.json(inventoryData)
  } catch (error) {
    console.error("Error fetching inventory data:", error)
    return NextResponse.json({ error: "Failed to fetch inventory data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const name = formData.get("name") as string
    const sku = formData.get("sku") as string
    const category = formData.get("category") as string
    const stock_quantity = Number(formData.get("stock_quantity"))
    const unit_cost = Number(formData.get("unit_cost"))
    const location = formData.get("location") as string
    const description = formData.get("description") as string

    const result = await sql`
      INSERT INTO inventory_items (
        name, sku, category, stock_quantity, unit_cost, location, description, status
      ) VALUES (
        ${name}, ${sku}, ${category}, ${stock_quantity}, ${unit_cost}, ${location}, ${description}, 'active'
      )
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error adding inventory item:", error)
    return NextResponse.json({ error: "Failed to add inventory item" }, { status: 500 })
  }
}
