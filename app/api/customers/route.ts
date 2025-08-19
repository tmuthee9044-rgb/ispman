import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const result = await sql`SELECT * FROM customers ORDER BY id LIMIT 10`

    return NextResponse.json({
      success: true,
      customers: result,
      count: result.length,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      customers: [],
      count: 0,
    })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
      businessName,
      businessType,
      idNumber,
      taxNumber,
      billingAddress,
      installationAddress,
      gpsCoordinates,
      portalUsername,
      portalPassword,
      preferredContactMethod,
      referralSource,
      servicePreferences,
      assignedStaffId,
    } = body

    // Generate unique account number
    const accountNumber = `ACC${Date.now()}`

    const result = await sql`
      INSERT INTO customers (
        first_name, last_name, email, phone, address, city, state, postal_code, country,
        business_name, business_type, id_number, tax_number, billing_address, 
        installation_address, gps_coordinates, portal_username, portal_password,
        preferred_contact_method, referral_source, service_preferences, assigned_staff_id,
        account_number, status, created_at, updated_at
      )
      VALUES (
        ${firstName}, ${lastName}, ${email}, ${phone}, ${address}, ${city}, ${state}, 
        ${postalCode}, ${country}, ${businessName}, ${businessType}, ${idNumber}, 
        ${taxNumber}, ${billingAddress}, ${installationAddress}, ${gpsCoordinates},
        ${portalUsername}, ${portalPassword}, ${preferredContactMethod}, ${referralSource},
        ${JSON.stringify(servicePreferences)}, ${assignedStaffId}, ${accountNumber}, 
        'active', NOW(), NOW()
      )
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      customer: result[0],
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
