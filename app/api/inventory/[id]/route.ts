import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export const dynamic = "force-dynamic"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData()
    const id = Number(params.id)

    const name = formData.get("name") as string
    const sku = formData.get("sku") as string
    const category = formData.get("category") as string
    const stock_quantity = Number(formData.get("stock_quantity"))
    const unit_cost = Number(formData.get("unit_cost"))
    const location = formData.get("location") as string
    const description = formData.get("description") as string

    await sql`
      UPDATE inventory_items 
      SET 
        name = ${name},
        sku = ${sku},
        category = ${category},
        stock_quantity = ${stock_quantity},
        unit_cost = ${unit_cost},
        location = ${location},
        description = ${description},
        updated_at = NOW()
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating inventory item:", error)
    return NextResponse.json({ error: "Failed to update inventory item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)

    await sql`
      DELETE FROM inventory_items 
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting inventory item:", error)
    return NextResponse.json({ error: "Failed to delete inventory item" }, { status: 500 })
  }
}
