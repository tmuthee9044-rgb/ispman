import { notFound } from "next/navigation"
import { sql } from "@neondatabase/serverless"
import { CustomerPortalClient } from "./customer-portal-client"

async function getCustomer(id: string) {
  try {
    const result = await sql`
      SELECT 
        id, name, email, phone, address, city, county, postal_code,
        connection_type, router_ip, mac_address, installation_date,
        last_payment, balance, notes, portal_login_id, portal_username,
        customer_type, payment_method, auto_payment, status,
        physical_gps_lat, physical_gps_lng, business_name, business_type,
        vat_pin, business_reg_no, first_name, last_name, alternate_email,
        created_at, updated_at
      FROM customers 
      WHERE id = ${id}
    `

    if (result.length === 0) {
      return null
    }

    return result[0]
  } catch (error) {
    console.error("Error fetching customer:", error)
    return null
  }
}

async function getCustomerServices(customerId: string) {
  try {
    const result = await sql`
      SELECT cs.*, sp.name as plan_name, sp.price, sp.speed_download, sp.speed_upload
      FROM customer_services cs
      LEFT JOIN service_plans sp ON cs.plan_id = sp.id
      WHERE cs.customer_id = ${customerId}
      ORDER BY cs.created_at DESC
    `
    return result
  } catch (error) {
    console.error("Error fetching customer services:", error)
    return []
  }
}

async function getCustomerPayments(customerId: string) {
  try {
    const result = await sql`
      SELECT * FROM payments 
      WHERE customer_id = ${customerId}
      ORDER BY payment_date DESC
      LIMIT 10
    `
    return result
  } catch (error) {
    console.error("Error fetching customer payments:", error)
    return []
  }
}

export default async function CustomerPortalPage({ params }: { params: { id: string } }) {
  const customer = await getCustomer(params.id)

  if (!customer) {
    notFound()
  }

  const [services, payments] = await Promise.all([getCustomerServices(params.id), getCustomerPayments(params.id)])

  return <CustomerPortalClient customer={customer} services={services} payments={payments} />
}
