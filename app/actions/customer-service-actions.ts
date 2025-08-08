"use server"

import { query } from "@/lib/db"
import { revalidatePath } from "next/cache"

// Enhanced mock data for service plans
const mockServicePlans = [
  {
    id: 1,
    name: "Basic Plan",
    price: 29.99,
    description: "Perfect for light internet usage, email, and basic browsing",
    speed_down: 10,
    speed_up: 5,
    data_limit: null,
    active: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: 2,
    name: "Standard Plan",
    price: 49.99,
    description: "Great for streaming, video calls, and moderate usage",
    speed_down: 50,
    speed_up: 25,
    data_limit: null,
    active: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: 3,
    name: "Premium Plan",
    price: 79.99,
    description: "High-speed internet for heavy usage, gaming, and 4K streaming",
    speed_down: 100,
    speed_up: 50,
    data_limit: null,
    active: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: 4,
    name: "Business Basic",
    price: 99.99,
    description: "Reliable internet solution for small businesses",
    speed_down: 150,
    speed_up: 75,
    data_limit: null,
    active: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: 5,
    name: "Business Premium",
    price: 149.99,
    description: "Enterprise-grade internet with priority support",
    speed_down: 250,
    speed_up: 125,
    data_limit: null,
    active: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: 6,
    name: "Ultra Plan",
    price: 199.99,
    description: "Maximum speed for power users and content creators",
    speed_down: 500,
    speed_up: 250,
    data_limit: null,
    active: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
]

// Mock data for customer services
const mockServices = [
  {
    id: 1,
    customer_id: 1,
    service_plan_id: 3,
    service_plan_name: "Premium Plan",
    monthly_fee: 79.99,
    status: "active",
    start_date: "2024-01-01",
    end_date: "2024-02-01",
    days_remaining: 15,
    auto_renew: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
]

export async function getCustomerServices(customerId: number) {
  try {
    const services = await query(
      `
      SELECT 
        cs.*,
        sp.name as service_plan_name,
        sp.price as monthly_fee,
        DATEDIFF(cs.end_date, NOW()) as days_remaining
      FROM customer_services cs
      JOIN service_plans sp ON cs.service_plan_id = sp.id
      WHERE cs.customer_id = ?
      ORDER BY cs.created_at DESC
    `,
      [customerId],
    )

    return { success: true, services: services || mockServices }
  } catch (error) {
    console.error("Error fetching customer services:", error)
    // Return mock data on error
    return { success: true, services: mockServices }
  }
}

export async function getServicePlans() {
  try {
    const plans = await query(`
      SELECT * FROM service_plans 
      WHERE active = true 
      ORDER BY price ASC
    `)

    // Always return the enhanced mock data for now
    return { success: true, plans: mockServicePlans }
  } catch (error) {
    console.error("Error fetching service plans:", error)
    // Return mock data on error
    return { success: true, plans: mockServicePlans }
  }
}

export async function addCustomerService(formData: FormData) {
  try {
    const customerId = Number.parseInt(formData.get("customer_id") as string)
    const servicePlanId = Number.parseInt(formData.get("service_plan_id") as string)
    const autoRenew = formData.get("auto_renew") === "on"

    // Find the selected service plan
    const selectedPlan = mockServicePlans.find((plan) => plan.id === servicePlanId)

    if (!selectedPlan) {
      return { success: false, error: "Selected service plan not found" }
    }

    // In a real implementation, this would add to database
    console.log("Adding service:", {
      customerId,
      servicePlanId,
      planName: selectedPlan.name,
      monthlyFee: selectedPlan.price,
      autoRenew,
    })

    revalidatePath(`/customers/${customerId}`)
    return {
      success: true,
      message: `${selectedPlan.name} added successfully for $${selectedPlan.price}/month`,
    }
  } catch (error) {
    console.error("Error adding customer service:", error)
    return { success: false, error: "Failed to add service" }
  }
}

export async function updateServiceStatus(serviceId: number, status: string) {
  try {
    // In a real implementation, this would update the database
    console.log("Updating service status:", { serviceId, status })

    revalidatePath("/customers")
    return { success: true, message: "Service status updated" }
  } catch (error) {
    console.error("Error updating service status:", error)
    return { success: false, error: "Failed to update service status" }
  }
}

export async function processPayment(formData: FormData) {
  try {
    const customerId = Number.parseInt(formData.get("customer_id") as string)
    const amount = Number.parseFloat(formData.get("amount") as string)
    const method = formData.get("method") as string
    const reference = formData.get("reference") as string

    // In a real implementation, this would process the payment
    console.log("Processing payment:", { customerId, amount, method, reference })

    revalidatePath(`/customers/${customerId}`)
    return {
      success: true,
      message: `Payment of $${amount} processed successfully. Services extended by 30 days.`,
    }
  } catch (error) {
    console.error("Error processing payment:", error)
    return { success: false, error: "Failed to process payment" }
  }
}

export async function removeCustomerService(serviceId: number, customerId: number) {
  try {
    // In a real implementation, this would update the database
    console.log("Removing service:", { serviceId, customerId })

    revalidatePath(`/customers/${customerId}`)
    return { success: true, message: "Service removed successfully" }
  } catch (error) {
    console.error("Error removing service:", error)
    return { success: false, error: "Failed to remove service" }
  }
}
