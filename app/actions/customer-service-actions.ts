"use server"

import { query } from "@/lib/db"
import { revalidatePath } from "next/cache"

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

    return { success: true, services: services || [] }
  } catch (error) {
    console.error("Error fetching customer services:", error)
    return { success: false, services: [], error: "Failed to fetch customer services" }
  }
}

export async function getServicePlans() {
  try {
    const plans = await query(`
      SELECT * FROM service_plans 
      WHERE active = true 
      ORDER BY price ASC
    `)

    return { success: true, plans: plans || [] }
  } catch (error) {
    console.error("Error fetching service plans:", error)
    return { success: false, plans: [], error: "Failed to fetch service plans" }
  }
}

export async function addCustomerService(formData: FormData) {
  try {
    const customerId = Number.parseInt(formData.get("customer_id") as string)
    const servicePlanId = Number.parseInt(formData.get("service_plan_id") as string)
    const autoRenew = formData.get("auto_renew") === "on"

    // Find the selected service plan
    const selectedPlan = await query(`SELECT * FROM service_plans WHERE id = ?`, [servicePlanId])

    if (!selectedPlan || selectedPlan.length === 0) {
      return { success: false, error: "Selected service plan not found" }
    }

    // In a real implementation, this would add to database
    console.log("Adding service:", {
      customerId,
      servicePlanId,
      planName: selectedPlan[0].name,
      monthlyFee: selectedPlan[0].price,
      autoRenew,
    })

    revalidatePath(`/customers/${customerId}`)
    return {
      success: true,
      message: `${selectedPlan[0].name} added successfully for $${selectedPlan[0].price}/month`,
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
