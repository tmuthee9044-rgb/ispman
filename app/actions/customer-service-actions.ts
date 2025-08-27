"use server"

import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"
import { ActivityLogger } from "@/lib/activity-logger"

const sql = neon(process.env.DATABASE_URL!)

export async function getCustomerServices(customerId: number) {
  try {
    const services = await sql`
      SELECT 
        cs.*,
        sp.name as service_plan_name,
        sp.price as monthly_fee,
        EXTRACT(DAY FROM (cs.end_date - NOW())) as days_remaining
      FROM customer_services cs
      JOIN service_plans sp ON cs.service_plan_id = sp.id
      WHERE cs.customer_id = ${customerId}
      ORDER BY cs.created_at DESC
    `

    return { success: true, services: services || [] }
  } catch (error) {
    console.error("Error fetching customer services:", error)
    return { success: false, services: [], error: "Failed to fetch customer services" }
  }
}

export async function getServicePlans() {
  try {
    const plans = await sql`
      SELECT * FROM service_plans 
      WHERE status = 'active' 
      ORDER BY price ASC
    `

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

    const customerExists = await sql`
      SELECT id FROM customers WHERE id = ${customerId}
    `

    if (customerExists.length === 0) {
      return { success: false, error: "Customer not found" }
    }

    // Find the selected service plan
    const selectedPlan = await sql`
      SELECT * FROM service_plans WHERE id = ${servicePlanId}
    `

    if (!selectedPlan || selectedPlan.length === 0) {
      return { success: false, error: "Selected service plan not found" }
    }

    const result = await sql`
      INSERT INTO customer_services (
        customer_id, 
        service_plan_id, 
        status, 
        monthly_fee, 
        start_date, 
        installation_date,
        next_billing_date,
        auto_renewal,
        contract_length,
        created_at
      ) VALUES (
        ${customerId},
        ${servicePlanId},
        'active',
        ${selectedPlan[0].price},
        CURRENT_DATE,
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '1 month',
        ${autoRenew},
        12,
        NOW()
      ) RETURNING *
    `

    revalidatePath(`/customers/${customerId}`)
    return {
      success: true,
      message: `${selectedPlan[0].name} added successfully for KSh ${selectedPlan[0].price}/month`,
      service: result[0],
    }
  } catch (error) {
    console.error("Error adding customer service:", error)
    return { success: false, error: "Failed to add service" }
  }
}

export async function updateServiceStatus(serviceId: number, status: string) {
  try {
    const result = await sql`
      UPDATE customer_services 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${serviceId}
      RETURNING *
    `

    if (result.length === 0) {
      return { success: false, error: "Service not found" }
    }

    revalidatePath("/customers")
    return { success: true, message: "Service status updated", service: result[0] }
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

    await ActivityLogger.logCustomerActivity(`initiated ${method} payment of KES ${amount}`, customerId.toString(), {
      amount,
      payment_method: method,
      reference,
      action: "payment_initiated",
    })

    const paymentResult = await sql`
      INSERT INTO payments (
        customer_id,
        amount,
        payment_method,
        transaction_id,
        status,
        payment_date,
        created_at
      ) VALUES (
        ${customerId},
        ${amount},
        ${method},
        ${reference || `PAY-${Date.now()}`},
        'completed',
        NOW(),
        NOW()
      ) RETURNING *
    `

    await sql`
      UPDATE customer_services 
      SET next_billing_date = next_billing_date + INTERVAL '1 month'
      WHERE customer_id = ${customerId} 
        AND status = 'active'
    `

    if (method.toLowerCase().includes("mpesa") || method.toLowerCase().includes("m-pesa")) {
      await ActivityLogger.logMpesaActivity(
        `Customer payment completed: KES ${amount}`,
        reference || paymentResult[0].transaction_id,
        {
          customer_id: customerId,
          payment_id: paymentResult[0].id,
          amount,
          payment_method: method,
          transaction_id: paymentResult[0].transaction_id,
          status: "completed",
          services_extended: true,
        },
        "SUCCESS",
      )
    } else {
      await ActivityLogger.logCustomerActivity(`completed ${method} payment of KES ${amount}`, customerId.toString(), {
        payment_id: paymentResult[0].id,
        amount,
        payment_method: method,
        transaction_id: paymentResult[0].transaction_id,
        status: "completed",
        services_extended: true,
      })
    }

    revalidatePath(`/customers/${customerId}`)
    return {
      success: true,
      message: `Payment of KSh ${amount} processed successfully. Services extended by 30 days.`,
      payment: paymentResult[0],
    }
  } catch (error) {
    const customerId = Number.parseInt(formData.get("customer_id") as string)
    const amount = Number.parseFloat(formData.get("amount") as string)
    const method = formData.get("method") as string

    await ActivityLogger.logCustomerActivity(
      `payment processing failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      customerId.toString(),
      {
        amount,
        payment_method: method,
        error: error instanceof Error ? error.message : "Unknown error",
        action: "payment_failed",
      },
    )

    console.error("Error processing payment:", error)
    return { success: false, error: "Failed to process payment" }
  }
}

export async function removeCustomerService(serviceId: number, customerId: number) {
  try {
    const result = await sql`
      UPDATE customer_services 
      SET status = 'terminated', end_date = CURRENT_DATE, updated_at = NOW()
      WHERE id = ${serviceId} AND customer_id = ${customerId}
      RETURNING *
    `

    if (result.length === 0) {
      return { success: false, error: "Service not found" }
    }

    revalidatePath(`/customers/${customerId}`)
    return { success: true, message: "Service terminated successfully", service: result[0] }
  } catch (error) {
    console.error("Error removing service:", error)
    return { success: false, error: "Failed to remove service" }
  }
}

export async function validateCustomerServiceRelationships() {
  try {
    const orphanedServices = await sql`
      SELECT cs.id, cs.customer_id, cs.service_plan_id
      FROM customer_services cs
      LEFT JOIN customers c ON cs.customer_id = c.id
      LEFT JOIN service_plans sp ON cs.service_plan_id = sp.id
      WHERE c.id IS NULL OR sp.id IS NULL
    `

    const customersWithoutServices = await sql`
      SELECT c.id, c.first_name, c.last_name, c.email
      FROM customers c
      LEFT JOIN customer_services cs ON c.id = cs.customer_id
      WHERE cs.id IS NULL AND c.status = 'active'
    `

    return {
      success: true,
      orphanedServices: orphanedServices.length,
      customersWithoutServices: customersWithoutServices.length,
      details: {
        orphaned: orphanedServices,
        withoutServices: customersWithoutServices,
      },
    }
  } catch (error) {
    console.error("Error validating relationships:", error)
    return { success: false, error: "Failed to validate relationships" }
  }
}

export async function fixOrphanedServices() {
  try {
    const result = await sql`
      DELETE FROM customer_services 
      WHERE customer_id NOT IN (SELECT id FROM customers)
         OR service_plan_id NOT IN (SELECT id FROM service_plans)
      RETURNING id
    `

    return {
      success: true,
      message: `Cleaned up ${result.length} orphaned service records`,
      deletedCount: result.length,
    }
  } catch (error) {
    console.error("Error fixing orphaned services:", error)
    return { success: false, error: "Failed to fix orphaned services" }
  }
}
