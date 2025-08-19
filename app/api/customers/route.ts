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
    const formData = await request.formData()

    const firstName = formData.get("first_name") as string
    const lastName = formData.get("last_name") as string
    const email = formData.get("email") as string
    const alternateEmail = formData.get("alternate_email") as string
    const customerType = (formData.get("customer_type") as string) || "individual"
    const contactPerson = formData.get("contact_person") as string
    const idNumber = formData.get("national_id") as string
    const taxNumber = formData.get("tax_id") as string
    const businessName = formData.get("business_name") as string
    const businessType = formData.get("business_type") as string

    // Address information
    const address = formData.get("physical_address") as string
    const city = formData.get("physical_city") as string
    const state = formData.get("physical_county") as string
    const postalCode = formData.get("physical_postal_code") as string
    const country = formData.get("physical_country") as string
    const billingAddress = formData.get("billing_address") as string
    const installationAddress = formData.get("installation_address") as string

    // GPS coordinates
    const physicalLat = formData.get("physical_lat") as string
    const physicalLng = formData.get("physical_lng") as string
    const billingLat = formData.get("billing_lat") as string
    const billingLng = formData.get("billing_lng") as string
    const gpsCoordinates = physicalLat && physicalLng ? `${physicalLat},${physicalLng}` : null

    // Portal credentials
    const portalUsername = formData.get("portal_username") as string
    const portalPassword = formData.get("portal_password") as string

    // Contact preferences
    const preferredContactMethod = formData.get("preferred_contact_method") as string
    const referralSource = formData.get("referral_source") as string
    const assignedStaffId = formData.get("assigned_staff")
      ? Number.parseInt(formData.get("assigned_staff") as string)
      : null

    // Additional information fields
    const salesRep = formData.get("sales_rep") as string
    const accountManager = formData.get("account_manager") as string
    const specialRequirements = formData.get("special_requirements") as string
    const internalNotes = formData.get("internal_notes") as string

    // Service preferences
    const servicePreferences = {
      auto_renewal: formData.get("auto_renewal") === "on",
      paperless_billing: formData.get("paperless_billing") === "on",
      sms_notifications: formData.get("sms_notifications") === "on",
      connection_type: formData.get("connection_type"),
      equipment_needed: formData.get("equipment_needed"),
      installation_date: formData.get("installation_date"),
      billing_cycle: formData.get("billing_cycle"),
      sales_rep: salesRep,
      account_manager: accountManager,
    }

    // Generate unique account number
    const accountNumber = `ACC${Date.now()}`

    // Get primary phone number from form
    const phone = (formData.get("phone_0") as string) || (formData.get("phone") as string)

    const result = await sql`
      INSERT INTO customers (
        first_name, last_name, email, phone, address, city, state, postal_code, country,
        billing_address, installation_address, gps_coordinates, portal_username, portal_password,
        preferred_contact_method, referral_source, assigned_staff_id, service_preferences,
        account_number, status, customer_type, id_number, tax_number, business_name, business_type,
        special_requirements, internal_notes, sales_rep, account_manager,
        created_at, updated_at
      )
      VALUES (
        ${firstName}, ${lastName}, ${email}, ${phone}, ${address}, ${city}, ${state}, 
        ${postalCode}, ${country}, ${billingAddress}, ${installationAddress}, ${gpsCoordinates},
        ${portalUsername}, ${portalPassword}, ${preferredContactMethod}, ${referralSource}, 
        ${assignedStaffId}, ${JSON.stringify(servicePreferences)}, ${accountNumber}, 'pending',
        ${customerType}, ${idNumber}, ${taxNumber}, ${businessName}, ${businessType},
        ${specialRequirements}, ${internalNotes}, ${salesRep}, ${accountManager},
        NOW(), NOW()
      )
      RETURNING *
    `

    const customerId = result[0].id

    const phoneNumbers = []
    let phoneIndex = 0
    while (formData.get(`phone_${phoneIndex}`)) {
      const phoneNumber = formData.get(`phone_${phoneIndex}`) as string
      const phoneType = (formData.get(`phone_type_${phoneIndex}`) as string) || "mobile"
      const isPrimary = phoneIndex === 0

      if (phoneNumber) {
        phoneNumbers.push({ phoneNumber, phoneType, isPrimary })

        await sql`
          INSERT INTO customer_phone_numbers (customer_id, phone_number, type, is_primary)
          VALUES (${customerId}, ${phoneNumber}, ${phoneType}, ${isPrimary})
        `
      }
      phoneIndex++
    }

    let contactIndex = 0
    while (formData.get(`emergency_name_${contactIndex}`)) {
      const name = formData.get(`emergency_name_${contactIndex}`) as string
      const phone = formData.get(`emergency_phone_${contactIndex}`) as string
      const relationship = formData.get(`emergency_relationship_${contactIndex}`) as string
      const email = formData.get(`emergency_email_${contactIndex}`) as string

      if (name && phone) {
        await sql`
          INSERT INTO customer_emergency_contacts (customer_id, name, phone, relationship, email)
          VALUES (${customerId}, ${name}, ${phone}, ${relationship}, ${email})
        `
      }
      contactIndex++
    }

    return NextResponse.json({
      success: true,
      customer: result[0],
      message: "Customer created successfully",
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
