"use server"

import { revalidatePath } from "next/cache"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

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
  first_name?: string
  last_name?: string
  customer_email?: string
  customer_phone?: string
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

export async function getMessageTemplates(type?: "email" | "sms") {
  try {
    let query = `
      SELECT id, name, type, category, subject, content, variables, 
             usage_count, active, created_at, updated_at
      FROM message_templates 
      WHERE active = true
    `
    const params: any[] = []

    if (type) {
      query += ` AND type = $1`
      params.push(type)
    }

    query += ` ORDER BY created_at DESC`

    const templates = await sql(query, params)

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

    const result = await sql`
      INSERT INTO message_templates (name, type, category, subject, content, variables)
      VALUES (${name}, ${type}, ${category}, ${type === "email" ? subject : null}, ${content}, ${JSON.stringify(variables)})
      RETURNING id, name, type, category, subject, content, variables, usage_count, active, created_at, updated_at
    `

    revalidatePath("/messages")
    return { success: true, message: "Template created successfully", template: result[0] }
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

    await sql`
      UPDATE message_templates 
      SET name = ${name}, type = ${type}, category = ${category}, 
          subject = ${type === "email" ? subject : null}, content = ${content}, 
          variables = ${JSON.stringify(variables)}, updated_at = NOW()
      WHERE id = ${id}
    `

    revalidatePath("/messages")
    return { success: true, message: "Template updated successfully" }
  } catch (error) {
    console.error("Error updating message template:", error)
    return { success: false, error: "Failed to update template" }
  }
}

export async function deleteMessageTemplate(id: number) {
  try {
    await sql`
      UPDATE message_templates 
      SET active = false, updated_at = NOW()
      WHERE id = ${id}
    `

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
    const templateId = formData.get("template_id") ? Number.parseInt(formData.get("template_id") as string) : null
    const campaignId = formData.get("campaign_id") ? Number.parseInt(formData.get("campaign_id") as string) : null

    // Get customer details for recipients
    const customers = await sql`
      SELECT id, first_name, last_name, email, phone 
      FROM customers 
      WHERE id = ANY(${recipients})
    `

    // Create message records
    const messagePromises = customers.map(async (customer) => {
      const recipient = type === "email" ? customer.email : customer.phone

      return sql`
        INSERT INTO messages (type, recipient, subject, content, template_id, campaign_id, customer_id, status)
        VALUES (${type}, ${recipient}, ${type === "email" ? subject : null}, ${content}, ${templateId}, ${campaignId}, ${customer.id}, 'pending')
        RETURNING id
      `
    })

    const messageResults = await Promise.all(messagePromises)

    // Update template usage count if template was used
    if (templateId) {
      await sql`
        UPDATE message_templates 
        SET usage_count = usage_count + ${recipients.length}
        WHERE id = ${templateId}
      `
    }

    // In a real implementation, you would queue these messages for actual sending
    // For now, we'll mark them as sent
    const messageIds = messageResults.map((result) => result[0].id)
    await sql`
      UPDATE messages 
      SET status = 'sent', sent_at = NOW()
      WHERE id = ANY(${messageIds})
    `

    revalidatePath("/messages")
    return {
      success: true,
      message: `${recipients.length} ${type} message(s) sent successfully`,
      sent_count: recipients.length,
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
    let query = `
      SELECT m.*, c.first_name, c.last_name, c.email as customer_email, c.phone as customer_phone
      FROM messages m
      LEFT JOIN customers c ON m.customer_id = c.id
      WHERE 1=1
    `
    const params: any[] = []
    let paramIndex = 1

    if (filters?.type) {
      query += ` AND m.type = $${paramIndex}`
      params.push(filters.type)
      paramIndex++
    }

    if (filters?.status) {
      query += ` AND m.status = $${paramIndex}`
      params.push(filters.status)
      paramIndex++
    }

    if (filters?.customer_id) {
      query += ` AND m.customer_id = $${paramIndex}`
      params.push(filters.customer_id)
      paramIndex++
    }

    if (filters?.date_from) {
      query += ` AND m.created_at >= $${paramIndex}`
      params.push(filters.date_from)
      paramIndex++
    }

    if (filters?.date_to) {
      query += ` AND m.created_at <= $${paramIndex}`
      params.push(filters.date_to)
      paramIndex++
    }

    query += ` ORDER BY m.created_at DESC LIMIT 100`

    const messages = await sql(query, params)

    return { success: true, messages }
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
    const [totalResult, todayResult, yesterdayResult, deliveryResult] = await Promise.all([
      sql`SELECT COUNT(*) as total FROM messages`,
      sql`SELECT COUNT(*) as today FROM messages WHERE DATE(created_at) = CURRENT_DATE`,
      sql`SELECT COUNT(*) as yesterday FROM messages WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day'`,
      sql`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status IN ('delivered', 'opened') THEN 1 END) as delivered
        FROM messages 
        WHERE sent_at IS NOT NULL
      `,
    ])

    const total = Number.parseInt(totalResult[0].total)
    const today = Number.parseInt(todayResult[0].today)
    const yesterday = Number.parseInt(yesterdayResult[0].yesterday)
    const deliveryStats = deliveryResult[0]
    const deliveryRate = deliveryStats.total > 0 ? (deliveryStats.delivered / deliveryStats.total) * 100 : 0

    const stats = {
      total_messages: total,
      sent_today: today,
      sent_yesterday: yesterday,
      delivery_rate: Math.round(deliveryRate * 10) / 10,
      unread_count: 0, // This would require additional logic
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
