import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const { customers, source } = await request.json()

    if (!customers || !Array.isArray(customers)) {
      return Response.json({ error: "Invalid customers data" }, { status: 400 })
    }

    let imported = 0
    let errors = 0
    const errorDetails: string[] = []

    for (const customer of customers) {
      try {
        const requiredField = customer.name || customer.email || customer.phone
        if (!requiredField) {
          errors++
          errorDetails.push(`Customer missing required identification (name, email, or phone)`)
          continue
        }

        const existing = await sql`
          SELECT id FROM customers 
          WHERE email = ${customer.email || ""} 
          OR phone = ${customer.phone || ""}
          AND (email != '' OR phone != '')
        `

        if (existing.length > 0) {
          errors++
          errorDetails.push(`Customer ${customer.name || customer.email || customer.phone} already exists`)
          continue
        }

        const customerData = {
          first_name: customer.name?.split(" ")[0] || customer.first_name || "",
          last_name: customer.last_name || customer.name?.split(" ").slice(1).join(" ") || "",
          email: customer.email || "",
          phone: customer.phone || "",
          customer_type: customer.customer_type || "individual",
          status: customer.status || "active",
          monthly_fee: Number.parseFloat(customer.monthly_fee?.toString() || "0") || 0,
          balance: Number.parseFloat(customer.balance?.toString() || "0") || 0,
          physical_address: customer.physical_address || customer.address || "",
          physical_city: customer.physical_city || customer.city || "",
          physical_county: customer.physical_county || customer.county || "",
          postal_code: customer.postal_code || customer.zip_code || "",
          plan: customer.plan || customer.tariff_name || "",
          import_source: source || "manual",
          import_date: new Date().toISOString(),
        }

        // Insert new customer with enhanced field mapping
        await sql`
          INSERT INTO customers (
            first_name, last_name, email, phone, customer_type, status,
            monthly_fee, balance, physical_address, physical_city, physical_county,
            postal_code, plan, import_source, import_date, created_at, updated_at
          ) VALUES (
            ${customerData.first_name},
            ${customerData.last_name},
            ${customerData.email},
            ${customerData.phone},
            ${customerData.customer_type},
            ${customerData.status},
            ${customerData.monthly_fee},
            ${customerData.balance},
            ${customerData.physical_address},
            ${customerData.physical_city},
            ${customerData.physical_county},
            ${customerData.postal_code},
            ${customerData.plan},
            ${customerData.import_source},
            ${customerData.import_date},
            NOW(),
            NOW()
          )
        `
        imported++
      } catch (error) {
        console.error("Error importing customer:", error)
        errors++
        errorDetails.push(`Failed to import ${customer.name || customer.email || "unknown customer"}: ${error}`)
      }
    }

    return Response.json({
      success: true,
      imported,
      errors,
      source: source || "manual",
      message: `Successfully imported ${imported} customers from ${source?.toUpperCase() || "manual"} ${errors > 0 ? ` (${errors} errors)` : ""}`,
      errorDetails: errors > 0 ? errorDetails.slice(0, 10) : [], // Limit to first 10 errors
    })
  } catch (error) {
    console.error("Import customers error:", error)
    return Response.json({ error: "Failed to import customers" }, { status: 500 })
  }
}
