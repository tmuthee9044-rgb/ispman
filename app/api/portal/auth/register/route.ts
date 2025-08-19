import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      firstName,
      lastName,
      email,
      phone,
      idNumber,
      address,
      city,
      county,
      postalCode,
      serviceType,
      preferredPlan,
      installationAddress,
      password,
      agreeTerms,
      agreePrivacy,
      agreeMarketing,
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!agreeTerms || !agreePrivacy) {
      return NextResponse.json({ error: "You must agree to the Terms of Service and Privacy Policy" }, { status: 400 })
    }

    // Check if email already exists
    const existingCustomer = await sql`
      SELECT id FROM customers WHERE email = ${email} LIMIT 1
    `

    if (existingCustomer.length > 0) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    // Generate customer account number
    const accountNumber = `TW${Date.now().toString().slice(-6)}`

    // Hash password (in production, use proper password hashing like bcrypt)
    const hashedPassword = Buffer.from(password).toString("base64") // Simple encoding for demo

    // Create customer record
    const newCustomer = await sql`
      INSERT INTO customers (
        account_number,
        first_name,
        last_name,
        email,
        phone,
        id_number,
        address,
        city,
        county,
        postal_code,
        service_type,
        preferred_plan,
        installation_address,
        portal_password,
        status,
        registration_date,
        agree_terms,
        agree_privacy,
        agree_marketing,
        email_verified,
        portal_access
      ) VALUES (
        ${accountNumber},
        ${firstName},
        ${lastName},
        ${email},
        ${phone},
        ${idNumber || null},
        ${address || null},
        ${city || null},
        ${county || null},
        ${postalCode || null},
        ${serviceType || "residential"},
        ${preferredPlan || null},
        ${installationAddress || null},
        ${hashedPassword},
        'pending',
        NOW(),
        ${agreeTerms},
        ${agreePrivacy},
        ${agreeMarketing},
        false,
        true
      )
      RETURNING id, account_number, email, first_name, last_name
    `

    console.log("[v0] New customer registered:", {
      id: newCustomer[0].id,
      accountNumber: newCustomer[0].account_number,
      email: newCustomer[0].email,
      name: `${newCustomer[0].first_name} ${newCustomer[0].last_name}`,
    })

    // TODO: Send welcome email with account verification link
    // TODO: Notify admin of new registration

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      customer: {
        id: newCustomer[0].id,
        accountNumber: newCustomer[0].account_number,
        email: newCustomer[0].email,
        name: `${newCustomer[0].first_name} ${newCustomer[0].last_name}`,
      },
    })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 })
  }
}
