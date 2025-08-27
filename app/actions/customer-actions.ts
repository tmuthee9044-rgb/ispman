"use server"

import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

const sql = neon(process.env.DATABASE_URL!)

export async function createCustomer(formData: FormData) {
  try {
    const firstName = formData.get("first_name") as string
    const lastName = formData.get("last_name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const status = (formData.get("status") as string) || "active"

    console.log("Creating customer with data:", {
      firstName,
      lastName,
      email,
      phone,
      address,
      status,
    })

    const result = await sql`
      INSERT INTO customers (
        first_name, last_name, email, phone, address, status, created_at, updated_at
      )
      VALUES (
        ${firstName}, ${lastName}, ${email}, ${phone}, ${address}, ${status}, NOW(), NOW()
      )
      RETURNING *
    `

    console.log("Customer created successfully:", result[0])

    revalidatePath("/customers")
    return { success: true, customer: result[0] }
  } catch (error) {
    console.error("Error creating customer:", error)
    return { success: false, error: "Failed to create customer: " + (error as Error).message }
  }
}

export async function updateCustomer(id: number, formData: FormData) {
  try {
    const firstName = formData.get("first_name") as string
    const lastName = formData.get("last_name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const status = formData.get("status") as string

    console.log("Updating customer with id:", id, "and data:", { firstName, lastName, email, phone, address, status })

    const result = await sql`
      UPDATE customers 
      SET first_name = ${firstName}, last_name = ${lastName}, email = ${email}, phone = ${phone}, 
          address = ${address}, status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, first_name, last_name, email, phone, address, status, updated_at
    `

    console.log("Customer updated successfully:", result[0])

    revalidatePath("/customers")
    revalidatePath(`/customers/${id}`)
    return { success: true, customer: result[0] }
  } catch (error) {
    console.error("Error updating customer:", error)
    return { success: false, error: "Failed to update customer" }
  }
}

export async function getCustomers() {
  try {
    const customers = await sql`
      SELECT 
        c.id, 
        c.first_name,
        c.last_name,
        CONCAT(c.first_name, ' ', c.last_name) as name,
        c.email, 
        c.phone, 
        c.address, 
        c.status, 
        c.customer_type,
        c.account_number,
        c.balance,
        c.created_at, 
        c.updated_at,
        sp.name as plan,
        cs.monthly_fee,
        cs.ip_address as ip_allocated,
        cs.router_id as router_allocated,
        cs.status as service_status,
        cs.next_billing_date as last_payment,
        COALESCE(usage.data_usage, '0 GB') as data_usage,
        COALESCE(quality.connection_quality, 95) as connection_quality
      FROM customers c
      LEFT JOIN customer_services cs ON c.id = cs.customer_id AND cs.status = 'active'
      LEFT JOIN service_plans sp ON cs.service_plan_id = sp.id
      LEFT JOIN (
        SELECT customer_id, CONCAT(ROUND(SUM(data_used)/1024/1024/1024, 2), ' GB') as data_usage
        FROM customer_usage 
        WHERE DATE(created_at) >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY customer_id
      ) usage ON c.id = usage.customer_id
      LEFT JOIN (
        SELECT customer_id, AVG(signal_strength) as connection_quality
        FROM network_monitoring 
        WHERE DATE(created_at) >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY customer_id
      ) quality ON c.id = quality.customer_id
      ORDER BY c.created_at DESC
    `

    console.log("Customers fetched successfully:", customers.length, "customers")

    return customers.map((customer) => ({
      ...customer,
      plan: customer.plan || "No Plan",
      monthly_fee: customer.monthly_fee || 0,
      balance: customer.balance || 0,
      payment_method: "mpesa",
      location: customer.address ? customer.address.split(",")[0] : "Unknown",
      router_allocated: customer.router_allocated || "Not Assigned",
      ip_allocated: customer.ip_allocated || "Not Assigned",
      connection_quality: Math.round(customer.connection_quality) || 0,
      data_usage: customer.data_usage || "0 GB",
      avatar: null,
      last_payment: customer.last_payment || customer.created_at,
    }))
  } catch (error) {
    console.error("Error fetching customers:", error)
    return []
  }
}

export async function getCustomer(id: number) {
  try {
    const result = await sql`
      SELECT 
        c.*,
        CONCAT(c.first_name, ' ', c.last_name) as name,
        sp.name as current_plan,
        cs.monthly_fee,
        cs.ip_address as ip_allocated,
        cs.router_id as router_allocated,
        cs.status as service_status,
        cs.installation_date,
        cs.next_billing_date,
        COALESCE(usage.data_usage, 0) as data_usage_gb,
        COALESCE(quality.connection_quality, 95) as connection_quality,
        staff.first_name as staff_first_name,
        staff.last_name as staff_last_name
      FROM customers c
      LEFT JOIN customer_services cs ON c.id = cs.customer_id AND cs.status = 'active'
      LEFT JOIN service_plans sp ON cs.service_plan_id = sp.id
      LEFT JOIN staff ON c.assigned_staff_id = staff.id
      LEFT JOIN (
        SELECT customer_id, SUM(data_used)/1024/1024/1024 as data_usage
        FROM customer_usage 
        WHERE DATE(created_at) >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY customer_id
      ) usage ON c.id = usage.customer_id
      LEFT JOIN (
        SELECT customer_id, AVG(signal_strength) as connection_quality
        FROM network_monitoring 
        WHERE DATE(created_at) >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY customer_id
      ) quality ON c.id = quality.customer_id
      WHERE c.id = ${id}
    `

    if (result[0]) {
      const customer = {
        ...result[0],
        plan: result[0].current_plan || "No Plan",
        monthly_fee: result[0].monthly_fee || 0,
        payment_method: "mpesa",
        location: result[0].address ? result[0].address.split(",")[0] : "Unknown",
        router_allocated: result[0].router_allocated || "Not Assigned",
        ip_allocated: result[0].ip_allocated || "Not Assigned",
        connection_quality: Math.round(result[0].connection_quality) || 0,
        data_usage: `${(result[0].data_usage_gb || 0).toFixed(2)} GB`,
        avatar: null,
        last_payment: result[0].next_billing_date || result[0].created_at,
        assigned_staff:
          result[0].staff_first_name && result[0].staff_last_name
            ? `${result[0].staff_first_name} ${result[0].staff_last_name}`
            : null,
      }

      console.log("Customer fetched successfully:", customer)
      return customer
    }

    return null
  } catch (error) {
    console.error("Error fetching customer:", error)
    return null
  }
}

export async function deleteCustomer(id: number) {
  try {
    console.log("Deleting customer with id:", id)
    await sql`DELETE FROM customers WHERE id = ${id}`

    console.log("Customer deleted successfully")
    revalidatePath("/customers")
    return { success: true }
  } catch (error) {
    console.error("Error deleting customer:", error)
    return { success: false, error: "Failed to delete customer" }
  }
}
