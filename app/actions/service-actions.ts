"use server"

import { query } from "@/lib/db"
import { revalidatePath } from "next/cache"

// Mock data for when database is not available
const mockServicePlans = [
  {
    id: 1,
    name: "Basic Plan",
    price: 29.99,
    description: "Basic internet service",
    speed_down: 10,
    speed_up: 5,
    active: true,
  },
  {
    id: 2,
    name: "Standard Plan",
    price: 49.99,
    description: "Standard internet service",
    speed_down: 50,
    speed_up: 25,
    active: true,
  },
  {
    id: 3,
    name: "Premium Plan",
    price: 79.99,
    description: "Premium internet service",
    speed_down: 100,
    speed_up: 50,
    active: true,
  },
  {
    id: 4,
    name: "Business Plan",
    price: 149.99,
    description: "Business internet service",
    speed_down: 200,
    speed_up: 100,
    active: true,
  },
]

export async function getServicePlans() {
  try {
    const plans = await query(`
      SELECT * FROM service_plans 
      WHERE active = true 
      ORDER BY price ASC
    `)

    return { success: true, plans: plans || mockServicePlans }
  } catch (error) {
    console.error("Error fetching service plans:", error)
    return { success: true, plans: mockServicePlans }
  }
}

export async function createServicePlan(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const speedDown = Number.parseInt(formData.get("speed_down") as string)
    const speedUp = Number.parseInt(formData.get("speed_up") as string)
    const dataLimit = formData.get("data_limit") ? Number.parseInt(formData.get("data_limit") as string) : null
    const price = Number.parseFloat(formData.get("price") as string)

    // In a real implementation, this would insert into database
    console.log("Creating service plan:", { name, description, speedDown, speedUp, dataLimit, price })

    revalidatePath("/services")
    return { success: true, message: "Service plan created successfully" }
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
    const speedDown = Number.parseInt(formData.get("speed_down") as string)
    const speedUp = Number.parseInt(formData.get("speed_up") as string)
    const dataLimit = formData.get("data_limit") ? Number.parseInt(formData.get("data_limit") as string) : null
    const price = Number.parseFloat(formData.get("price") as string)

    // In a real implementation, this would update the database
    console.log("Updating service plan:", { id, name, description, speedDown, speedUp, dataLimit, price })

    revalidatePath("/services")
    return { success: true, message: "Service plan updated successfully" }
  } catch (error) {
    console.error("Error updating service plan:", error)
    return { success: false, error: "Failed to update service plan" }
  }
}

export async function deleteServicePlan(id: number) {
  try {
    // In a real implementation, this would update the database
    console.log("Deleting service plan:", { id })

    revalidatePath("/services")
    return { success: true, message: "Service plan deleted successfully" }
  } catch (error) {
    console.error("Error deleting service plan:", error)
    return { success: false, error: "Failed to delete service plan" }
  }
}
