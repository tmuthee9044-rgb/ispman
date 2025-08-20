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
        date_of_birth = ${updateData.date_of_birth || existingCustomer[0].date_of_birth || ""},
        gender = ${updateData.gender || existingCustomer[0].gender || ""},
        national_id = ${updateData.national_id || existingCustomer[0].national_id || ""},
        customer_type = ${updateData.customer_type || existingCustomer[0].customer_type},
        status = ${updateData.status || existingCustomer[0].status},
        monthly_fee = ${updateData.monthly_fee || existingCustomer[0].monthly_fee},
        balance = ${updateData.balance || existingCustomer[0].balance},
        physical_address = ${updateData.physical_address || updateData.address || existingCustomer[0].physical_address || ""},
        physical_city = ${updateData.physical_city || existingCustomer[0].physical_city || ""},
        physical_county = ${updateData.physical_county || existingCustomer[0].physical_county || ""},
        physical_gps_lat = ${updateData.physical_gps_lat || existingCustomer[0].physical_gps_lat || ""},
        physical_gps_lng = ${updateData.physical_gps_lng || existingCustomer[0].physical_gps_lng || ""},
        contact_person = ${updateData.contact_person || existingCustomer[0].contact_person || ""},
        vat_pin = ${updateData.vat_pin || existingCustomer[0].vat_pin || ""},
        tax_id = ${updateData.tax_id || existingCustomer[0].tax_id || ""},
        business_reg_no = ${updateData.business_reg_no || existingCustomer[0].business_reg_no || ""},
        business_type = ${updateData.business_type || existingCustomer[0].business_type || ""},
        industry = ${updateData.industry || existingCustomer[0].industry || ""},
        company_size = ${updateData.company_size || existingCustomer[0].company_size || ""},
        school_type = ${updateData.school_type || existingCustomer[0].school_type || ""},
        student_count = ${updateData.student_count || existingCustomer[0].student_count || ""},
        staff_count = ${updateData.staff_count || existingCustomer[0].staff_count || ""},
        portal_login_id = ${updateData.portal_login_id || existingCustomer[0].portal_login_id || ""},
        portal_username = ${updateData.portal_username || existingCustomer[0].portal_username || ""},
        portal_password = ${updateData.portal_password || existingCustomer[0].portal_password || ""},
        auto_renewal = ${updateData.auto_renewal !== undefined ? updateData.auto_renewal : existingCustomer[0].auto_renewal || false},
        paperless_billing = ${updateData.paperless_billing !== undefined ? updateData.paperless_billing : existingCustomer[0].paperless_billing || false},
        sms_notifications = ${updateData.sms_notifications !== undefined ? updateData.sms_notifications : existingCustomer[0].sms_notifications || false},
        billing_cycle = ${updateData.billing_cycle || existingCustomer[0].billing_cycle || "monthly"},
        payment_method = ${updateData.payment_method || existingCustomer[0].payment_method || "mpesa"},
        auto_payment = ${updateData.auto_payment !== undefined ? updateData.auto_payment : existingCustomer[0].auto_payment || false},
        referral_source = ${updateData.referral_source || existingCustomer[0].referral_source || ""},
        special_requirements = ${updateData.special_requirements || existingCustomer[0].special_requirements || ""},
        sales_rep = ${updateData.sales_rep || existingCustomer[0].sales_rep || ""},
        account_manager = ${updateData.account_manager || existingCustomer[0].account_manager || ""},
        notes = ${updateData.notes || existingCustomer[0].notes || ""},
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
