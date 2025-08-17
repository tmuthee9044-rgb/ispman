import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const { customers } = await request.json()

    if (!customers || !Array.isArray(customers)) {
      return Response.json({ error: "Invalid customers data" }, { status: 400 })
    }

    let imported = 0
    let errors = 0

    for (const customer of customers) {
      try {
        // Validate required fields
        if (!customer.name || !customer.email) {
          errors++
          continue
        }

        // Check if customer already exists
        const existing = await sql`
          SELECT id FROM customers WHERE email = ${customer.email}
        `

        if (existing.length > 0) {
          errors++
          continue
        }

        // Insert new customer
        await sql`
          INSERT INTO customers (
            name, last_name, email, phone, customer_type, status,
            monthly_fee, balance, physical_address, physical_city, physical_county,
            created_at, updated_at
          ) VALUES (
            ${customer.name},
            ${customer.last_name || ""},
            ${customer.email},
            ${customer.phone || ""},
            ${customer.customer_type || "individual"},
            ${customer.status || "active"},
            ${customer.monthly_fee || 0},
            ${customer.balance || 0},
            ${customer.physical_address || ""},
            ${customer.physical_city || ""},
            ${customer.physical_county || ""},
            NOW(),
            NOW()
          )
        `
        imported++
      } catch (error) {
        console.error("Error importing customer:", error)
        errors++
      }
    }

    return Response.json({
      success: true,
      imported,
      errors,
      message: `Successfully imported ${imported} customers${errors > 0 ? ` (${errors} errors)` : ""}`,
    })
  } catch (error) {
    console.error("Import customers error:", error)
    return Response.json({ error: "Failed to import customers" }, { status: 500 })
  }
}
