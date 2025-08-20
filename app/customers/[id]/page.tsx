import { Suspense } from "react"
import { CustomerDetailsClient } from "./customer-details-client"
import { neon } from "@neondatabase/serverless"
import { notFound } from "next/navigation"

const sql = neon(process.env.DATABASE_URL!)

interface CustomerPageProps {
  params: {
    id: string
  }
}

const getCustomerData = async (id: string) => {
  try {
    const customerId = Number.parseInt(id)
    if (isNaN(customerId)) {
      console.log("[v0] Invalid customer ID:", id)
      return null
    }

    console.log("[v0] Fetching customer with ID:", customerId)

    const result = await sql`SELECT * FROM customers WHERE id = ${customerId}`

    if (result.length === 0) {
      console.log("[v0] No customer found with ID:", customerId)
      return null
    }

    const customer = result[0]
    console.log("[v0] Customer fetched successfully")

    const formatDate = (date: any) => {
      if (!date) return new Date().toISOString().split("T")[0]
      if (typeof date === "string") return date.split("T")[0]
      if (date instanceof Date) return date.toISOString().split("T")[0]
      return new Date(date).toISOString().split("T")[0]
    }

    const transformedCustomer = {
      id: customer.id,
      name: `${customer.first_name || "Unknown"} ${customer.last_name || ""}`.trim(),
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      email: customer.email || "",
      alternate_email: customer.alternate_email || "",
      phone: customer.phone || customer.phone_primary || "",
      address: customer.physical_address || customer.address || "",
      status: (customer.status || "active") as "active" | "suspended" | "inactive",
      service_plan: customer.plan || "Basic Plan",
      monthly_fee: Number(customer.monthly_fee) || 2500,
      created_at: customer.created_at,
      updated_at: customer.updated_at,

      // Personal Information
      date_of_birth: customer.date_of_birth || "",
      gender: customer.gender || "",
      national_id: customer.id_number || customer.national_id || "",

      // Business Information
      customer_type: (customer.customer_type || "individual") as const,
      contact_person: customer.contact_person || "",
      vat_pin: customer.tax_number || customer.vat_pin || "",
      tax_id: customer.tax_number || customer.tax_id || "",
      business_reg_no: customer.business_reg_no || "",
      business_type: customer.business_type || "",
      industry: customer.industry || "",
      company_size: customer.company_size || "",
      school_type: customer.school_type || "",
      student_count: customer.student_count || "",
      staff_count: customer.staff_count || "",

      // Address Information
      physical_address: customer.address || customer.physical_address || "",
      physical_city: customer.city || customer.physical_city || "",
      physical_county: customer.state || customer.physical_county || "",
      physical_postal_code: customer.postal_code || customer.physical_postal_code || "",
      physical_country: customer.country || customer.physical_country || "Kenya",
      physical_gps_lat: customer.gps_coordinates
        ? customer.gps_coordinates.split(",")[0]
        : customer.physical_gps_lat || "",
      physical_gps_lng: customer.gps_coordinates
        ? customer.gps_coordinates.split(",")[1]
        : customer.physical_gps_lng || "",

      billing_address: customer.billing_address || customer.address || "",
      billing_city: customer.city || customer.billing_city || "",
      billing_county: customer.state || customer.billing_county || "",
      billing_postal_code: customer.postal_code || customer.billing_postal_code || "",
      billing_country: customer.country || customer.billing_country || "Kenya",
      billing_gps_lat: customer.gps_coordinates
        ? customer.gps_coordinates.split(",")[0]
        : customer.billing_gps_lat || "",
      billing_gps_lng: customer.gps_coordinates
        ? customer.gps_coordinates.split(",")[1]
        : customer.billing_gps_lng || "",

      // Portal Access
      portal_login_id: customer.account_number || `TW${customer.id}`,
      portal_username: customer.portal_username || `customer_${customer.id}`,
      portal_password: customer.portal_password || "••••••••••••",

      // Service Configuration
      connection_type: customer.connection_type || "Fiber",
      router_ip: customer.ip_allocated || "192.168.1.100",
      mac_address: customer.mac_address || "00:1B:44:11:3A:B7",
      installation_date: customer.installation_date || formatDate(customer.created_at),
      last_payment: customer.last_payment_date || "2024-01-01",
      balance: Number(customer.balance) || 0,
      payment_method: customer.preferred_contact_method || customer.payment_method || "mpesa",
      auto_payment: customer.auto_renewal || true,
      connection_quality: customer.connection_quality || "excellent",
      billing_cycle: customer.billing_cycle || "monthly",

      // Technical Information
      equipment_needed: customer.equipment_needed || "",
      installation_notes: customer.special_requirements || customer.installation_notes || "",
      technical_contact: customer.technical_contact || "",

      // Additional Information
      referral_source: customer.referral_source || "",
      special_requirements: customer.special_requirements || "",
      sales_rep: customer.sales_rep || "",
      account_manager: customer.account_manager || "",

      // Contact Numbers and Emergency Contacts (JSON fields)
      phone_numbers: customer.phone_numbers ? JSON.parse(customer.phone_numbers) : [],
      emergency_contacts: customer.emergency_contacts ? JSON.parse(customer.emergency_contacts) : [],

      // Preferences
      auto_renewal: customer.auto_renewal || false,
      paperless_billing: customer.paperless_billing || false,
      sms_notifications: customer.sms_notifications || false,

      notes: customer.internal_notes || `Customer created on ${new Date(customer.created_at).toLocaleDateString()}`,
      router_allocated: customer.router_allocated ? "Router-A-001" : "Not Allocated",
      ip_allocated: customer.ip_allocated || "192.168.1.100",
    }

    return transformedCustomer
  } catch (error) {
    console.error("[v0] Error in getCustomerData:", error)
    return null
  }
}

export default async function CustomerPage({ params }: CustomerPageProps) {
  const customer = await getCustomerData(params.id)

  if (!customer) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Suspense fallback={<div>Loading customer details...</div>}>
        <CustomerDetailsClient customer={customer} />
      </Suspense>
    </div>
  )
}
