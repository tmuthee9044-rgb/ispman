"use server"

import { revalidatePath } from "next/cache"

export async function processSmartPayment(formData: FormData) {
  try {
    const customerId = Number.parseInt(formData.get("customer_id") as string)
    const amount = Number.parseFloat(formData.get("amount") as string)
    const method = formData.get("method") as string
    const reference = formData.get("reference") as string

    // Mock customer services data
    const customerServices = [
      {
        id: 1,
        service_plan_name: "Premium Internet 100Mbps",
        monthly_fee: 149.99,
        days_remaining: 25,
        service_balance: -149.99,
        next_billing_date: "2024-02-15",
      },
      {
        id: 2,
        service_plan_name: "Business Email Package",
        monthly_fee: 29.99,
        days_remaining: 25,
        service_balance: -29.99,
        next_billing_date: "2024-02-15",
      },
    ]

    const totalOwed = customerServices.reduce((sum, service) => sum + Math.abs(service.service_balance), 0)
    let remainingAmount = amount

    const allocations = []

    // Allocate payment across services based on their outstanding balances
    for (const service of customerServices) {
      if (remainingAmount <= 0) break

      const serviceOwed = Math.abs(service.service_balance)
      const allocationPercentage = serviceOwed / totalOwed
      const allocatedAmount = Math.min(amount * allocationPercentage, remainingAmount, serviceOwed)

      // Calculate days extended based on payment
      const daysExtended = Math.floor((allocatedAmount / service.monthly_fee) * 30)

      allocations.push({
        service_id: service.id,
        service_name: service.service_plan_name,
        allocated_amount: allocatedAmount,
        days_extended: daysExtended,
      })

      remainingAmount -= allocatedAmount
    }

    // If there's remaining amount after covering all service balances, extend services proportionally
    if (remainingAmount > 0) {
      const totalMonthlyFee = customerServices.reduce((sum, service) => sum + service.monthly_fee, 0)

      for (let i = 0; i < allocations.length; i++) {
        const service = customerServices[i]
        const additionalPercentage = service.monthly_fee / totalMonthlyFee
        const additionalAmount = remainingAmount * additionalPercentage
        const additionalDays = Math.floor((additionalAmount / service.monthly_fee) * 30)

        allocations[i].allocated_amount += additionalAmount
        allocations[i].days_extended += additionalDays
      }
    }

    console.log("Smart payment allocation:", { customerId, amount, method, reference, allocations })

    revalidatePath(`/customers/${customerId}`)

    return {
      success: true,
      message: `Payment of $${amount} processed successfully and allocated across ${allocations.length} services.`,
      allocations,
    }
  } catch (error) {
    console.error("Error processing smart payment:", error)
    return { success: false, error: "Failed to process payment" }
  }
}

export async function updateFinanceSettings(formData: FormData) {
  try {
    const customerId = Number.parseInt(formData.get("customer_id") as string)
    const paymentMethod = formData.get("payment_method") as string
    const mpesaNumber = formData.get("mpesa_number") as string
    const bankAccount = formData.get("bank_account") as string
    const autoPayment = formData.get("auto_payment") === "on"
    const paymentReminderDays = Number.parseInt(formData.get("payment_reminder_days") as string)
    const lateFeePercentage = Number.parseFloat(formData.get("late_fee_percentage") as string)
    const suspensionGraceDays = Number.parseInt(formData.get("suspension_grace_days") as string)

    console.log("Updating finance settings:", {
      customerId,
      paymentMethod,
      mpesaNumber,
      bankAccount,
      autoPayment,
      paymentReminderDays,
      lateFeePercentage,
      suspensionGraceDays,
    })

    revalidatePath(`/customers/${customerId}`)

    return {
      success: true,
      message: "Finance settings updated successfully.",
    }
  } catch (error) {
    console.error("Error updating finance settings:", error)
    return { success: false, error: "Failed to update finance settings" }
  }
}
