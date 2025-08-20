"use server"

import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

const sql = neon(process.env.DATABASE_URL!)

export async function getCompanySettings() {
  try {
    const settings = await sql`
      SELECT key, value 
      FROM system_config 
      WHERE key LIKE 'company_%' OR key LIKE 'branding_%' OR key LIKE 'contact_%' OR key LIKE 'localization_%'
      ORDER BY key
    `

    // Convert array of key-value pairs to object
    const settingsObject: Record<string, any> = {}
    settings.forEach((setting: any) => {
      try {
        // Try to parse as JSON first, fallback to string
        settingsObject[setting.key] = JSON.parse(setting.value)
      } catch {
        settingsObject[setting.key] = setting.value
      }
    })

    return settingsObject
  } catch (error) {
    console.error("Error fetching company settings:", error)
    return {}
  }
}

export async function updateCompanySettings(formData: FormData) {
  try {
    const settings = [
      // Basic Info
      { key: "company_name", value: formData.get("company_name") as string },
      { key: "company_trading_name", value: formData.get("trading_name") as string },
      { key: "company_registration_number", value: formData.get("registration_number") as string },
      { key: "company_tax_number", value: formData.get("tax_number") as string },
      { key: "company_description", value: formData.get("description") as string },
      { key: "company_industry", value: formData.get("industry") as string },
      { key: "company_size", value: formData.get("company_size") as string },
      { key: "company_founded_year", value: formData.get("founded_year") as string },

      // Branding
      { key: "branding_primary_color", value: formData.get("primary_color") as string },
      { key: "branding_secondary_color", value: formData.get("secondary_color") as string },
      { key: "branding_accent_color", value: formData.get("accent_color") as string },

      // Contact Info
      { key: "contact_primary_phone", value: formData.get("primary_phone") as string },
      { key: "contact_secondary_phone", value: formData.get("secondary_phone") as string },
      { key: "contact_primary_email", value: formData.get("primary_email") as string },
      { key: "contact_support_email", value: formData.get("support_email") as string },
      { key: "contact_website", value: formData.get("website") as string },
      { key: "contact_facebook", value: formData.get("social_facebook") as string },
      { key: "contact_twitter", value: formData.get("social_twitter") as string },
      { key: "contact_linkedin", value: formData.get("social_linkedin") as string },
      { key: "contact_street_address", value: formData.get("street_address") as string },
      { key: "contact_city", value: formData.get("city") as string },
      { key: "contact_state", value: formData.get("state") as string },
      { key: "contact_postal_code", value: formData.get("postal_code") as string },
      { key: "contact_country", value: formData.get("country") as string },

      // Localization
      { key: "localization_language", value: formData.get("default_language") as string },
      { key: "localization_currency", value: formData.get("currency") as string },
      { key: "localization_timezone", value: formData.get("timezone") as string },
      { key: "localization_date_format", value: formData.get("date_format") as string },
      { key: "localization_time_format", value: formData.get("time_format") as string },
      { key: "localization_number_format", value: formData.get("number_format") as string },
      { key: "localization_week_start", value: formData.get("week_start") as string },
      { key: "localization_tax_system", value: formData.get("tax_system") as string },
      { key: "localization_tax_rate", value: formData.get("tax_rate") as string },
    ]

    // Update or insert each setting
    for (const setting of settings) {
      if (setting.value) {
        await sql`
          INSERT INTO system_config (key, value, created_at) 
          VALUES (${setting.key}, ${setting.value}, CURRENT_TIMESTAMP)
          ON CONFLICT (key) 
          DO UPDATE SET value = ${setting.value}, created_at = CURRENT_TIMESTAMP
        `
      }
    }

    revalidatePath("/settings/company")
    return { success: true, message: "Company settings updated successfully" }
  } catch (error) {
    console.error("Error updating company settings:", error)
    return { success: false, message: "Failed to update company settings" }
  }
}

export async function getContentData(type: "terms" | "privacy") {
  try {
    const result = await sql`
      SELECT value FROM system_config 
      WHERE key = ${`content_${type}`}
    `

    if (result.length > 0) {
      return JSON.parse(result[0].value)
    }

    return null
  } catch (error) {
    console.error(`Error fetching ${type} content:`, error)
    return null
  }
}

export async function updateContentData(type: "terms" | "privacy", content: any) {
  try {
    const contentWithTimestamp = {
      ...content,
      lastUpdated: new Date().toLocaleDateString(),
    }

    await sql`
      INSERT INTO system_config (key, value, created_at) 
      VALUES (${`content_${type}`}, ${JSON.stringify(contentWithTimestamp)}, CURRENT_TIMESTAMP)
      ON CONFLICT (key) 
      DO UPDATE SET value = ${JSON.stringify(contentWithTimestamp)}, created_at = CURRENT_TIMESTAMP
    `

    revalidatePath("/settings/company")
    return {
      success: true,
      message: `${type === "terms" ? "Terms of Service" : "Privacy Policy"} updated successfully`,
    }
  } catch (error) {
    console.error(`Error updating ${type} content:`, error)
    return { success: false, message: `Failed to update ${type === "terms" ? "Terms of Service" : "Privacy Policy"}` }
  }
}

export async function uploadFile(formData: FormData, type: "logo" | "favicon" | "template") {
  try {
    // This would integrate with your file storage solution (e.g., Vercel Blob, AWS S3)
    // For now, we'll simulate the upload and store the file path in system_config

    const file = formData.get("file") as File
    if (!file) {
      return { success: false, message: "No file provided" }
    }

    // Simulate file upload - in production, upload to your storage service
    const fileName = `${type}_${Date.now()}_${file.name}`
    const filePath = `/uploads/${fileName}`

    // Store file path in system_config
    await sql`
      INSERT INTO system_config (key, value, created_at) 
      VALUES (${`file_${type}`}, ${filePath}, CURRENT_TIMESTAMP)
      ON CONFLICT (key) 
      DO UPDATE SET value = ${filePath}, created_at = CURRENT_TIMESTAMP
    `

    revalidatePath("/settings/company")
    return { success: true, message: `${type} uploaded successfully`, filePath }
  } catch (error) {
    console.error(`Error uploading ${type}:`, error)
    return { success: false, message: `Failed to upload ${type}` }
  }
}
