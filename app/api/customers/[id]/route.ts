import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const customerId = Number.parseInt(params.id)

    if (isNaN(customerId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid customer ID",
        },
        { status: 400 },
      )
    }

    const result = await sql`SELECT * FROM customers WHERE id = ${customerId}`

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      customer: result[0],
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const customerId = Number.parseInt(params.id)

    if (isNaN(customerId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid customer ID",
        },
        { status: 400 },
      )
    }

    // Check if customer exists
    const existingCustomer = await sql`SELECT * FROM customers WHERE id = ${customerId}`

    if (existingCustomer.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer not found",
        },
        { status: 404 },
      )
    }

    // Delete related records first (cascade deletion)
    await sql`DELETE FROM customer_services WHERE customer_id = ${customerId}`
    await sql`DELETE FROM payments WHERE customer_id = ${customerId}`
    await sql`DELETE FROM ip_addresses WHERE customer_id = ${customerId}`

    // Delete the customer
    await sql`DELETE FROM customers WHERE id = ${customerId}`

    return NextResponse.json({
      success: true,
      message: `Customer ${existingCustomer[0].name} has been deleted successfully`,
    })
  } catch (error) {
    console.error("Delete customer error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete customer",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const customerId = Number.parseInt(params.id)
    const updateData = await request.json()

    if (isNaN(customerId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid customer ID",
        },
        { status: 400 },
      )
    }

    // Check if customer exists
    const existingCustomer = await sql`SELECT * FROM customers WHERE id = ${customerId}`

    if (existingCustomer.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer not found",
        },
        { status: 404 },
      )
    }

    const result = await sql`
      UPDATE customers 
      SET 
        first_name = ${updateData.first_name || existingCustomer[0].first_name || ""},
        last_name = ${updateData.last_name || existingCustomer[0].last_name || ""},
        email = ${updateData.email || existingCustomer[0].email},
        alternate_email = ${updateData.alternate_email || existingCustomer[0].alternate_email || ""},
        phone = ${updateData.phone || existingCustomer[0].phone},
        date_of_birth = ${updateData.date_of_birth || existingCustomer[0].date_of_birth || null},
        gender = ${updateData.gender || existingCustomer[0].gender || ""},
        id_number = ${updateData.national_id || updateData.id_number || existingCustomer[0].id_number || ""},
        customer_type = ${updateData.customer_type || existingCustomer[0].customer_type},
        status = ${updateData.status || existingCustomer[0].status},
        monthly_fee = ${updateData.monthly_fee || existingCustomer[0].monthly_fee},
        balance = ${updateData.balance || existingCustomer[0].balance},
        address = ${updateData.physical_address || updateData.address || existingCustomer[0].address || ""},
        installation_address = ${updateData.installation_address || updateData.physical_address || existingCustomer[0].installation_address || ""},
        billing_address = ${updateData.billing_address || existingCustomer[0].billing_address || ""},
        city = ${updateData.physical_city || updateData.city || existingCustomer[0].city || ""},
        state = ${updateData.physical_county || updateData.state || existingCustomer[0].state || ""},
        country = ${updateData.country || existingCustomer[0].country || "Kenya"},
        postal_code = ${updateData.postal_code || existingCustomer[0].postal_code || ""},
        gps_coordinates = ${
          updateData.physical_gps_lat && updateData.physical_gps_lng
            ? `${updateData.physical_gps_lat},${updateData.physical_gps_lng}`
            : existingCustomer[0].gps_coordinates || ""
        },
        billing_gps_coordinates = ${updateData.billing_gps_coordinates || existingCustomer[0].billing_gps_coordinates || ""},
        contact_person = ${updateData.contact_person || existingCustomer[0].contact_person || ""},
        business_name = ${updateData.business_name || existingCustomer[0].business_name || ""},
        business_type = ${updateData.business_type || existingCustomer[0].business_type || ""},
        tax_number = ${updateData.vat_pin || updateData.tax_id || updateData.tax_number || existingCustomer[0].tax_number || ""},
        portal_login_id = ${updateData.portal_login_id || existingCustomer[0].portal_login_id || ""},
        portal_username = ${updateData.portal_username || existingCustomer[0].portal_username || ""},
        portal_password = ${updateData.portal_password || existingCustomer[0].portal_password || ""},
        preferred_contact_method = ${updateData.preferred_contact_method || existingCustomer[0].preferred_contact_method || "email"},
        referral_source = ${updateData.referral_source || existingCustomer[0].referral_source || ""},
        special_requirements = ${updateData.special_requirements || existingCustomer[0].special_requirements || ""},
        sales_rep = ${updateData.sales_rep || existingCustomer[0].sales_rep || ""},
        account_manager = ${updateData.account_manager || existingCustomer[0].account_manager || ""},
        internal_notes = ${updateData.notes || updateData.internal_notes || existingCustomer[0].internal_notes || ""},
        updated_at = NOW()
      WHERE id = ${customerId}
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      message: "Customer updated successfully",
      customer: result[0],
    })
  } catch (error) {
    console.error("Update customer error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update customer",
      },
      { status: 500 },
    )
  }
}
