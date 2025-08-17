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
      name: `${customer.name || "Unknown"} ${customer.last_name || ""}`.trim(),
      email: customer.email || "",
      phone: customer.phone || customer.phone_primary || "",
      address: customer.physical_address || customer.address || "",
      status: (customer.status || "active") as "active" | "suspended" | "inactive",
      service_plan: customer.plan || "Basic Plan",
      monthly_fee: Number(customer.monthly_fee) || 2500,
      created_at: customer.created_at,
      updated_at: customer.updated_at,
      connection_type: customer.connection_type || "Fiber",
      router_ip: customer.ip_allocated || "192.168.1.100",
      mac_address: "00:1B:44:11:3A:B7",
      installation_date: customer.installation_date || formatDate(customer.created_at),
      last_payment: customer.last_payment_date || "2024-01-01",
      balance: Number(customer.balance) || 0,
      notes: customer.internal_notes || `Customer created on ${new Date(customer.created_at).toLocaleDateString()}`,
      portal_login_id:
        customer.portal_login_id || `${customer.name?.toLowerCase().replace(/\s+/g, "_")}_${customer.id}`,
      portal_username: customer.portal_username || customer.name?.toLowerCase().replace(/\s+/g, ""),
      portal_password: customer.portal_password || "temp_password_123",
      router_allocated: customer.router_allocated ? "Router-A-001" : "Not Allocated",
      ip_allocated: customer.ip_allocated || "192.168.1.100",
      customer_type: (customer.customer_type || "individual") as const,
      payment_method: customer.payment_method || "mpesa",
      auto_payment: customer.auto_renewal || true,
      connection_quality: customer.connection_quality || "excellent",
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
