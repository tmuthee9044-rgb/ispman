import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Fetch all portal settings from system_config table
    const settings = await sql`
      SELECT config_key, config_value, config_type 
      FROM system_config 
      WHERE config_key LIKE 'portal_%'
      ORDER BY config_key
    `

    // Transform flat settings into structured object
    const portalSettings = {
      customer: {
        url: "https://portal.example.com",
        title: "Customer Portal",
        welcomeMessage: "Welcome to your customer portal",
        allowSelfRegistration: true,
        emailVerificationRequired: true,
        adminApprovalRequired: false,
        sessionTimeout: 30,
        httpsOnly: true,
        rateLimiting: true,
        captcha: false,
        caching: true,
        compression: true,
        cdn: false,
        maxFileUpload: 10,
      },
      admin: {
        url: "https://admin.example.com",
        title: "Admin Portal",
        ipWhitelistOnly: false,
        require2FA: true,
        singleSession: true,
        allowedIPs: "",
        sessionTimeout: 15,
        auditLogging: true,
        logFailedLogins: true,
        logDataChanges: true,
        autoBackup: true,
        configBackup: true,
        backupRetention: 30,
      },
      themes: {
        customerTheme: "modern",
        customerPrimaryColor: "#3b82f6",
        customerSecondaryColor: "#64748b",
        customerFont: "inter",
        adminTheme: "dark",
        adminPrimaryColor: "#1f2937",
        adminAccentColor: "#3b82f6",
        adminSidebar: "collapsible",
        customerCSS: "",
        adminCSS: "",
      },
      features: {
        customerFeatures: {
          accountDashboard: true,
          billPayment: true,
          usageStatistics: true,
          serviceManagement: true,
          supportTickets: true,
          paymentHistory: true,
          profileManagement: true,
          referralProgram: false,
          liveChatSupport: false,
          mobileAppDownload: true,
        },
        adminFeatures: {
          customerManagement: true,
          billingFinance: true,
          networkManagement: true,
          supportSystem: true,
          userManagement: true,
          reportsAnalytics: true,
          inventoryManagement: true,
          taskManagement: true,
          hrManagement: true,
          vehicleManagement: false,
        },
        notifications: {
          customerNotifications: {
            billDueReminders: true,
            serviceAlerts: true,
            promotionalOffers: false,
            systemMaintenance: true,
          },
          adminNotifications: {
            systemAlerts: true,
            newCustomerRegistrations: true,
            paymentFailures: true,
            taskAssignments: true,
          },
        },
      },
    }

    // Override with database values if they exist
    settings.forEach((setting) => {
      const keys = setting.config_key.replace("portal_", "").split("_")
      let current = portalSettings

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }

      const lastKey = keys[keys.length - 1]
      if (setting.config_type === "boolean") {
        current[lastKey] = setting.config_value === "true"
      } else if (setting.config_type === "number") {
        current[lastKey] = Number.parseInt(setting.config_value)
      } else {
        current[lastKey] = setting.config_value
      }
    })

    return NextResponse.json(portalSettings)
  } catch (error) {
    console.error("Error fetching portal settings:", error)
    return NextResponse.json({ error: "Failed to fetch portal settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings = await request.json()

    // Flatten the settings object for database storage
    const flattenSettings = (obj: any, prefix = "portal"): Array<{ key: string; value: string; type: string }> => {
      const result: Array<{ key: string; value: string; type: string }> = []

      for (const [key, value] of Object.entries(obj)) {
        const fullKey = `${prefix}_${key}`

        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          result.push(...flattenSettings(value, fullKey))
        } else {
          const type = typeof value === "boolean" ? "boolean" : typeof value === "number" ? "number" : "string"
          result.push({
            key: fullKey,
            value: String(value),
            type,
          })
        }
      }

      return result
    }

    const flatSettings = flattenSettings(settings)

    // Update or insert settings
    for (const setting of flatSettings) {
      await sql`
        INSERT INTO system_config (config_key, config_value, config_type, updated_at)
        VALUES (${setting.key}, ${setting.value}, ${setting.type}, NOW())
        ON CONFLICT (config_key) 
        DO UPDATE SET 
          config_value = EXCLUDED.config_value,
          config_type = EXCLUDED.config_type,
          updated_at = NOW()
      `
    }

    return NextResponse.json({ success: true, message: "Portal settings saved successfully" })
  } catch (error) {
    console.error("Error saving portal settings:", error)
    return NextResponse.json({ error: "Failed to save portal settings" }, { status: 500 })
  }
}
