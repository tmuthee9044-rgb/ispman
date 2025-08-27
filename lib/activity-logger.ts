import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface ActivityLogData {
  level: "INFO" | "WARNING" | "ERROR" | "SUCCESS" | "DEBUG"
  source: string
  category: "admin" | "user" | "system" | "mpesa" | "openvpn" | "radius" | "router"
  message: string
  ip_address?: string
  user_id?: string
  customer_id?: string
  details?: any
  session_id?: string
  user_agent?: string
}

export class ActivityLogger {
  static async log(data: ActivityLogData) {
    try {
      await sql`
        INSERT INTO system_logs (
          level, source, category, message, ip_address, 
          user_id, customer_id, details, session_id, user_agent
        ) VALUES (
          ${data.level}, ${data.source}, ${data.category}, ${data.message}, ${data.ip_address},
          ${data.user_id}, ${data.customer_id}, ${data.details ? JSON.stringify(data.details) : null}, 
          ${data.session_id}, ${data.user_agent}
        )
      `
    } catch (error) {
      console.error("Failed to log activity:", error)
    }
  }

  // Customer activities
  static async logCustomerActivity(action: string, customerId: string, details?: any, request?: Request) {
    const ip = request?.headers.get("x-forwarded-for") || request?.headers.get("x-real-ip") || "unknown"
    const userAgent = request?.headers.get("user-agent") || "unknown"

    await this.log({
      level: "INFO",
      source: "Customer Portal",
      category: "user",
      message: `Customer ${action}`,
      customer_id: customerId,
      ip_address: ip,
      user_agent: userAgent,
      details: details,
    })
  }

  // Admin activities
  static async logAdminActivity(action: string, userId: string, details?: any, request?: Request) {
    const ip = request?.headers.get("x-forwarded-for") || request?.headers.get("x-real-ip") || "unknown"
    const userAgent = request?.headers.get("user-agent") || "unknown"

    await this.log({
      level: "INFO",
      source: "Admin Panel",
      category: "admin",
      message: `Admin ${action}`,
      user_id: userId,
      ip_address: ip,
      user_agent: userAgent,
      details: details,
    })
  }

  // System activities
  static async logSystemActivity(
    action: string,
    level: "INFO" | "WARNING" | "ERROR" | "SUCCESS" = "INFO",
    details?: any,
  ) {
    await this.log({
      level,
      source: "System",
      category: "system",
      message: action,
      details: details,
    })
  }

  // MPESA activities
  static async logMpesaActivity(
    action: string,
    transactionId?: string,
    details?: any,
    level: "INFO" | "WARNING" | "ERROR" | "SUCCESS" = "INFO",
  ) {
    await this.log({
      level,
      source: "M-Pesa API",
      category: "mpesa",
      message: action,
      details: {
        transaction_id: transactionId,
        ...details,
      },
    })
  }

  // Network activities
  static async logNetworkActivity(
    action: string,
    source: string,
    details?: any,
    level: "INFO" | "WARNING" | "ERROR" | "SUCCESS" = "INFO",
  ) {
    await this.log({
      level,
      source,
      category: source.toLowerCase().includes("openvpn")
        ? "openvpn"
        : source.toLowerCase().includes("radius")
          ? "radius"
          : "router",
      message: action,
      details: details,
    })
  }
}
