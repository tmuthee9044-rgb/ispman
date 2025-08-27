"use server"

import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

const sql = neon(process.env.DATABASE_URL!)

export async function getServicePlans() {
  try {
    const plans = await sql`
      SELECT 
        sp.id,
        sp.name,
        sp.description,
        sp.download_speed,
        sp.upload_speed,
        sp.price,
        sp.status,
        sp.category,
        sp.data_limit,
        sp.throttled_speed,
        sp.setup_fee,
        sp.installation_fee,
        sp.equipment_fee,
        sp.contract_length,
        sp.early_termination_fee,
        sp.features,
        sp.created_at,
        sp.updated_at,
        COUNT(cs.id) as customer_count
      FROM service_plans sp
      LEFT JOIN customer_services cs ON sp.id = cs.service_plan_id AND cs.status = 'active'
      WHERE sp.status = 'active' 
      GROUP BY sp.id
      ORDER BY sp.price ASC
    `

    return { success: true, data: plans }
  } catch (error) {
    console.error("Error fetching service plans:", error)
    return { success: false, error: "Failed to fetch service plans", data: [] }
  }
}

export async function createServicePlan(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const downloadSpeed = Number.parseInt(formData.get("download_speed") as string)
    const uploadSpeed = Number.parseInt(formData.get("upload_speed") as string)
    const price = Number.parseFloat(formData.get("price") as string)
    const dataLimit = formData.get("data_limit") ? Number.parseInt(formData.get("data_limit") as string) : null
    const throttledSpeed = (formData.get("throttled_speed") as string) || null
    const setupFee = Number.parseFloat(formData.get("setup_fee") as string) || 0
    const installationFee = Number.parseFloat(formData.get("installation_fee") as string) || 0
    const equipmentFee = Number.parseFloat(formData.get("equipment_fee") as string) || 0
    const contractLength = Number.parseInt(formData.get("contract_length") as string) || 12
    const earlyTerminationFee = Number.parseFloat(formData.get("early_termination_fee") as string) || 0
    const features = formData.get("features") as string

    const result = await sql`
      INSERT INTO service_plans (
        name, description, download_speed, upload_speed, price, status, category, 
        data_limit, throttled_speed, setup_fee, installation_fee, equipment_fee,
        contract_length, early_termination_fee, features, created_at, updated_at
      ) VALUES (
        ${name}, ${description}, ${downloadSpeed}, ${uploadSpeed}, ${price}, 'active', ${category},
        ${dataLimit}, ${throttledSpeed}, ${setupFee}, ${installationFee}, ${equipmentFee},
        ${contractLength}, ${earlyTerminationFee}, ${features}, NOW(), NOW()
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
    const downloadSpeed = Number.parseInt(formData.get("download_speed") as string)
    const uploadSpeed = Number.parseInt(formData.get("upload_speed") as string)
    const price = Number.parseFloat(formData.get("price") as string)
    const dataLimit = formData.get("data_limit") ? Number.parseInt(formData.get("data_limit") as string) : null
    const throttledSpeed = (formData.get("throttled_speed") as string) || null
    const setupFee = Number.parseFloat(formData.get("setup_fee") as string) || 0

    await sql`
      UPDATE service_plans 
      SET 
        name = ${name},
        description = ${description},
        download_speed = ${downloadSpeed},
        upload_speed = ${uploadSpeed},
        price = ${price},
        data_limit = ${dataLimit},
        throttled_speed = ${throttledSpeed},
        setup_fee = ${setupFee},
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
      SET status = 'inactive', updated_at = NOW()
      WHERE id = ${id}
    `

    revalidatePath("/services")
    return { success: true, message: "Service plan deleted successfully" }
  } catch (error) {
    console.error("Error deleting service plan:", error)
    return { success: false, error: "Failed to delete service plan" }
  }
}
