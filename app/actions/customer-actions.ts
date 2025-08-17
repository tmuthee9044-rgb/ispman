"use server"

import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

const sql = neon(process.env.DATABASE_URL!)

export async function createCustomer(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const status = (formData.get("status") as string) || "active"

    console.log("Creating customer with data:", {
      name,
      email,
      phone,
      address,
      status,
    })

    const result = await sql`
      INSERT INTO customers (
        name, email, phone, address, status, created_at, updated_at
      )
      VALUES (
        ${name}, ${email}, ${phone}, ${address}, ${status}, NOW(), NOW()
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
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const status = formData.get("status") as string

    console.log("Updating customer with id:", id, "and data:", { name, email, phone, address, status })

    const result = await sql`
      UPDATE customers 
      SET name = ${name}, email = ${email}, phone = ${phone}, 
          address = ${address}, status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, name, email, phone, address, status, updated_at
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
        c.name, 
        c.email, 
        c.phone, 
        c.address, 
        c.status, 
        c.created_at, 
        c.updated_at
      FROM customers c
      ORDER BY c.created_at DESC
    `

    console.log("Customers fetched successfully:", customers.length, "customers")

    return customers.map((customer) => ({
      ...customer,
      plan: "Basic Plan",
      monthly_fee: 2500,
      balance: 0,
      customer_type: "individual",
      payment_method: "mpesa",
      location: "Nairobi",
      router_allocated: "192.168.1.1",
      ip_allocated: "192.168.1.100",
      connection_quality: 95,
      data_usage: "0 GB",
      avatar: null,
      last_payment: customer.created_at,
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
        c.id, 
        c.name, 
        c.email, 
        c.phone, 
        c.address, 
        c.status, 
        c.created_at, 
        c.updated_at
      FROM customers c
      WHERE c.id = ${id}
    `

    if (result[0]) {
      const customer = {
        ...result[0],
        plan: "Basic Plan",
        monthly_fee: 2500,
        balance: 0,
        customer_type: "individual",
        payment_method: "mpesa",
        location: "Nairobi",
        router_allocated: "192.168.1.1",
        ip_allocated: "192.168.1.100",
        connection_quality: 95,
        data_usage: "0 GB",
        avatar: null,
        last_payment: result[0].created_at,
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
