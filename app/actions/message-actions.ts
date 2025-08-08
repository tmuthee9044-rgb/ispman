"use server"

import { revalidatePath } from "next/cache"

export interface MessageTemplate {
  id: number
  name: string
  type: "email" | "sms"
  category: string
  subject?: string
  content: string
  variables: string[]
  created_at: string
  updated_at: string
  usage_count: number
  active: boolean
}

export interface Message {
  id: number
  type: "email" | "sms"
  recipient: string
  subject?: string
  content: string
  template_id?: number
  status: "pending" | "sent" | "delivered" | "failed" | "opened"
  sent_at?: string
  delivered_at?: string
  opened_at?: string
  error_message?: string
  campaign_id?: number
  customer_id: number
  created_at: string
  updated_at: string
}

export interface MessageCampaign {
  id: number
  name: string
  description: string
  type: "email" | "sms" | "mixed"
  status: "draft" | "active" | "paused" | "completed"
  template_id?: number
  target_criteria: any
  scheduled_at?: string
  created_at: string
  updated_at: string
  total_recipients: number
  sent_count: number
  delivered_count: number
  opened_count: number
  failed_count: number
}

// Mock data for development
const mockTemplates: MessageTemplate[] = [
  {
    id: 1,
    name: "Welcome Message",
    type: "email",
    category: "onboarding",
    subject: "Welcome to TrustWaves Network!",
    content:
      "Dear {{customer_name}},\n\nWelcome to TrustWaves Network! Your internet service has been successfully activated.\n\nService Plan: {{service_plan}}\nSpeed: {{speed}}\nMonthly Fee: KES {{monthly_fee}}\n\nFor support, contact us at support@trustwaves.com or call +254700000000.\n\nBest regards,\nTrustWaves Network Team",
    variables: ["customer_name", "service_plan", "speed", "monthly_fee"],
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
    usage_count: 45,
    active: true,
  },
  {
    id: 2,
    name: "Payment Reminder",
    type: "sms",
    category: "billing",
    content:
      "Hi {{customer_name}}, your monthly bill of KES {{amount}} is due on {{due_date}}. Pay via M-Pesa: Paybill 123456, Account: {{account_number}}. TrustWaves Network",
    variables: ["customer_name", "amount", "due_date", "account_number"],
    created_at: "2024-01-08T00:00:00Z",
    updated_at: "2024-01-08T00:00:00Z",
    usage_count: 128,
    active: true,
  },
  {
    id: 3,
    name: "Service Interruption Notice",
    type: "email",
    category: "maintenance",
    subject: "Scheduled Maintenance - {{maintenance_date}}",
    content:
      "Dear {{customer_name}},\n\nWe will be performing scheduled maintenance on {{maintenance_date}} from {{start_time}} to {{end_time}}.\n\nDuring this time, you may experience temporary service interruptions.\n\nWe apologize for any inconvenience.\n\nTrustWaves Network Team",
    variables: ["customer_name", "maintenance_date", "start_time", "end_time"],
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-05T00:00:00Z",
    usage_count: 23,
    active: true,
  },
  {
    id: 4,
    name: "Overdue Payment Alert",
    type: "sms",
    category: "billing",
    content:
      "URGENT: {{customer_name}}, your account is overdue by KES {{overdue_amount}}. Service may be suspended. Pay now via M-Pesa: Paybill 123456, Account: {{account_number}}. TrustWaves",
    variables: ["customer_name", "overdue_amount", "account_number"],
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z",
    usage_count: 67,
    active: true,
  },
]

export async function getMessageTemplates(type?: "email" | "sms") {
  try {
    // In production, this would query the database
    let templates = mockTemplates

    if (type) {
      templates = templates.filter((t) => t.type === type)
    }

    return { success: true, templates }
  } catch (error) {
    console.error("Error fetching message templates:", error)
    return { success: false, error: "Failed to fetch templates", templates: [] }
  }
}

export async function createMessageTemplate(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const type = formData.get("type") as "email" | "sms"
    const category = formData.get("category") as string
    const subject = formData.get("subject") as string
    const content = formData.get("content") as string

    // Extract variables from content
    const variables = Array.from(content.matchAll(/\{\{(\w+)\}\}/g), (m) => m[1])

    // In production, this would insert into database
    const newTemplate: MessageTemplate = {
      id: Date.now(), // Mock ID
      name,
      type,
      category,
      subject: type === "email" ? subject : undefined,
      content,
      variables,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      usage_count: 0,
      active: true,
    }

    console.log("Creating message template:", newTemplate)

    revalidatePath("/messages")
    return { success: true, message: "Template created successfully", template: newTemplate }
  } catch (error) {
    console.error("Error creating message template:", error)
    return { success: false, error: "Failed to create template" }
  }
}

export async function updateMessageTemplate(formData: FormData) {
  try {
    const id = Number.parseInt(formData.get("id") as string)
    const name = formData.get("name") as string
    const type = formData.get("type") as "email" | "sms"
    const category = formData.get("category") as string
    const subject = formData.get("subject") as string
    const content = formData.get("content") as string

    // Extract variables from content
    const variables = Array.from(content.matchAll(/\{\{(\w+)\}\}/g), (m) => m[1])

    // In production, this would update the database
    console.log("Updating message template:", { id, name, type, category, subject, content, variables })

    revalidatePath("/messages")
    return { success: true, message: "Template updated successfully" }
  } catch (error) {
    console.error("Error updating message template:", error)
    return { success: false, error: "Failed to update template" }
  }
}

export async function deleteMessageTemplate(id: number) {
  try {
    // In production, this would soft delete or remove from database
    console.log("Deleting message template:", { id })

    revalidatePath("/messages")
    return { success: true, message: "Template deleted successfully" }
  } catch (error) {
    console.error("Error deleting message template:", error)
    return { success: false, error: "Failed to delete template" }
  }
}

export async function sendMessage(formData: FormData) {
  try {
    const type = formData.get("type") as "email" | "sms"
    const recipients = JSON.parse(formData.get("recipients") as string) as number[]
    const subject = formData.get("subject") as string
    const content = formData.get("content") as string
    const templateId = formData.get("template_id") ? Number.parseInt(formData.get("template_id") as string) : undefined
    const campaignId = formData.get("campaign_id") ? Number.parseInt(formData.get("campaign_id") as string) : undefined

    // In production, this would:
    // 1. Create message records in database
    // 2. Queue messages for sending via email/SMS service
    // 3. Track delivery status

    const messages: Partial<Message>[] = recipients.map((customerId) => ({
      type,
      recipient: type === "email" ? `customer${customerId}@example.com` : `+25471234567${customerId}`,
      subject: type === "email" ? subject : undefined,
      content,
      template_id: templateId,
      campaign_id: campaignId,
      customer_id: customerId,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    console.log("Sending messages:", messages)

    // Simulate sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update template usage count if template was used
    if (templateId) {
      console.log("Incrementing template usage count:", templateId)
    }

    revalidatePath("/messages")
    return {
      success: true,
      message: `${messages.length} ${type} message(s) sent successfully`,
      sent_count: messages.length,
    }
  } catch (error) {
    console.error("Error sending messages:", error)
    return { success: false, error: "Failed to send messages" }
  }
}

export async function getMessageHistory(filters?: {
  type?: "email" | "sms"
  status?: string
  customer_id?: number
  campaign_id?: number
  date_from?: string
  date_to?: string
}) {
  try {
    // Mock message history data
    const mockHistory: Message[] = [
      {
        id: 1,
        type: "email",
        recipient: "john@example.com",
        subject: "Welcome to TrustWaves Network!",
        content: "Dear John Doe, Welcome to TrustWaves Network!...",
        template_id: 1,
        status: "delivered",
        sent_at: "2024-01-15T10:30:00Z",
        delivered_at: "2024-01-15T10:30:15Z",
        opened_at: "2024-01-15T11:45:22Z",
        customer_id: 1,
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T11:45:22Z",
      },
      {
        id: 2,
        type: "sms",
        recipient: "+254712345678",
        content: "Hi John Doe, your monthly bill of KES 2500 is due on 2024-01-20...",
        template_id: 2,
        status: "delivered",
        sent_at: "2024-01-14T09:15:00Z",
        delivered_at: "2024-01-14T09:15:03Z",
        customer_id: 1,
        created_at: "2024-01-14T09:15:00Z",
        updated_at: "2024-01-14T09:15:03Z",
      },
    ]

    // Apply filters in production
    let filteredHistory = mockHistory

    if (filters?.type) {
      filteredHistory = filteredHistory.filter((m) => m.type === filters.type)
    }

    if (filters?.status) {
      filteredHistory = filteredHistory.filter((m) => m.status === filters.status)
    }

    return { success: true, messages: filteredHistory }
  } catch (error) {
    console.error("Error fetching message history:", error)
    return { success: false, error: "Failed to fetch message history", messages: [] }
  }
}

export async function createMessageCampaign(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const type = formData.get("type") as "email" | "sms" | "mixed"
    const templateId = formData.get("template_id") ? Number.parseInt(formData.get("template_id") as string) : undefined
    const targetCriteria = JSON.parse(formData.get("target_criteria") as string)
    const scheduledAt = formData.get("scheduled_at") as string

    // In production, this would create campaign in database
    const newCampaign: MessageCampaign = {
      id: Date.now(), // Mock ID
      name,
      description,
      type,
      status: "draft",
      template_id: templateId,
      target_criteria: targetCriteria,
      scheduled_at: scheduledAt || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      total_recipients: 0,
      sent_count: 0,
      delivered_count: 0,
      opened_count: 0,
      failed_count: 0,
    }

    console.log("Creating message campaign:", newCampaign)

    revalidatePath("/messages")
    return { success: true, message: "Campaign created successfully", campaign: newCampaign }
  } catch (error) {
    console.error("Error creating message campaign:", error)
    return { success: false, error: "Failed to create campaign" }
  }
}

export async function getMessageStats() {
  try {
    // In production, this would query database for actual stats
    const stats = {
      total_messages: 1247,
      sent_today: 23,
      sent_yesterday: 18,
      delivery_rate: 98.5,
      open_rate: 65.2,
      unread_count: 5,
      failed_count: 18,
      monthly_sent: 892,
      monthly_delivered: 879,
    }

    return { success: true, stats }
  } catch (error) {
    console.error("Error fetching message stats:", error)
    return { success: false, error: "Failed to fetch stats" }
  }
}

// Utility function to replace template variables
export async function replaceTemplateVariables(content: string, variables: Record<string, string>): Promise<string> {
  let result = content

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g")
    result = result.replace(regex, value)
  }

  return result
}

// Utility function to extract variables from template content
export async function extractTemplateVariables(content: string): Promise<string[]> {
  const matches = content.matchAll(/\{\{(\w+)\}\}/g)
  return Array.from(matches, (m) => m[1])
}
