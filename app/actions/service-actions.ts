"use server"

import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

const sql = neon(process.env.DATABASE_URL!)

export async function getServicePlans() {
  try {
    const plans = await sql`
      SELECT 
        id,
        name,
        description,
        CONCAT(download_speed, '/', upload_speed, ' Mbps') as speed,
        download_speed,
        upload_speed,
        price,
        status as active,
        created_at,
        updated_at
      FROM service_plans 
      WHERE status = 'active' 
      ORDER BY price ASC
    `

    return { success: true, plans }
  } catch (error) {
    console.error("Error fetching service plans:", error)
    return { success: false, error: "Failed to fetch service plans", plans: [] }
  }
}

export async function createServicePlan(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const speedDown = Number.parseInt(formData.get("speed_down") as string)
    const speedUp = Number.parseInt(formData.get("speed_up") as string)
    const price = Number.parseFloat(formData.get("price") as string)
    const taxRate = Number.parseFloat(formData.get("tax_rate") as string) || 16
    const setupFee = Number.parseFloat(formData.get("setup_fee") as string) || 0
    const fupLimit = formData.get("fup_limit") ? Number.parseInt(formData.get("fup_limit") as string) : null
    const fupSpeed = (formData.get("fup_speed") as string) || null

    const result = await sql`
      INSERT INTO service_plans (
        name, description, download_speed, upload_speed, price, status, category, tax_rate, setup_fee
      ) VALUES (
        ${name}, ${description}, ${speedDown}, ${speedUp}, ${price}, 'active', ${category}, ${taxRate}, ${setupFee}
      ) RETURNING id
    `

    revalidatePath("/services")
    return { success: true, message: "Service plan created successfully", id: result[0].id }
  } catch (error) {
    console.error("Error creating service plan:", error)
    return { success: false, error: "Failed to create service plan" }
  }
}

export async function updateServicePlan(formData: FormData) {
  try {
    const id = Number.parseInt(formData.get("id") as string)
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)

    await sql`
      UPDATE service_plans 
      SET 
        name = ${name},
        description = ${description},
        price = ${price},
        updated_at = NOW()
      WHERE id = ${id}
    `

    revalidatePath("/services")
    return { success: true, message: "Service plan updated successfully" }
  } catch (error) {
    console.error("Error updating service plan:", error)
    return { success: false, error: "Failed to update service plan" }
  }
}

export async function deleteServicePlan(id: number) {
  try {
    await sql`
      UPDATE service_plans 
      SET active = false, updated_at = NOW()
      WHERE id = ${id}
    `

    revalidatePath("/services")
    return { success: true, message: "Service plan deleted successfully" }
  } catch (error) {
    console.error("Error deleting service plan:", error)
    return { success: false, error: "Failed to delete service plan" }
  }
}
