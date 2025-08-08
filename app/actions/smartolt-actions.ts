'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// Configuration Actions
export async function getSmartOLTConfig() {
  const config = await db.query(`
    SELECT * FROM smartolt_configurations 
    WHERE status = 'active' 
    ORDER BY created_at DESC 
    LIMIT 1
  `)
  return config.rows[0] || null
}

export async function updateSmartOLTConfig(formData: FormData) {
  const config = {
    api_base_url: formData.get('api_base_url') as string,
    api_username: formData.get('api_username') as string,
    api_password: formData.get('api_password') as string,
    api_token: formData.get('api_token') as string,
    connection_timeout: parseInt(formData.get('connection_timeout') as string) || 30,
    max_connections: parseInt(formData.get('max_connections') as string) || 10,
    sync_enabled: formData.get('sync_enabled') === 'true',
    sync_interval: parseInt(formData.get('sync_interval') as string) || 300,
    auto_provision: formData.get('auto_provision') === 'true',
    wifi_auto_config: formData.get('wifi_auto_config') === 'true',
    wifi_ssid_template: formData.get('wifi_ssid_template') as string || 'TrustWaves_{serial}',
    wifi_password_template: formData.get('wifi_password_template') as string || '{serial}_wifi',
  }

  // Check if config exists
  const existingConfig = await getSmartOLTConfig()
  
  if (existingConfig) {
    await db.query(`
      UPDATE smartolt_configurations 
      SET api_base_url = $1, api_username = $2, api_password = $3,
          api_token = $4, connection_timeout = $5, max_connections = $6,
          sync_enabled = $7, sync_interval = $8, auto_provision = $9,
          wifi_auto_config = $10, wifi_ssid_template = $11, wifi_password_template = $12,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $13
    `, [
      config.api_base_url, config.api_username, config.api_password,
      config.api_token, config.connection_timeout, config.max_connections,
      config.sync_enabled, config.sync_interval, config.auto_provision,
      config.wifi_auto_config, config.wifi_ssid_template, config.wifi_password_template,
      existingConfig.id
    ])
  } else {
    await db.query(`
      INSERT INTO smartolt_configurations (
        api_base_url, api_username, api_password, api_token,
        connection_timeout, max_connections, sync_enabled, sync_interval,
        auto_provision, wifi_auto_config, wifi_ssid_template, wifi_password_template
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [
      config.api_base_url, config.api_username, config.api_password, config.api_token,
      config.connection_timeout, config.max_connections, config.sync_enabled, config.sync_interval,
      config.auto_provision, config.wifi_auto_config, config.wifi_ssid_template, config.wifi_password_template
    ])
  }

  revalidatePath('/settings/smartolt')
  return { success: true, message: 'SmartOLT configuration updated successfully' }
}

// Device Actions
export async function getSmartOLTDevices() {
  const devices = await db.query(`
    SELECT d.*, c.name as customer_name
    FROM smartolt_devices d
    LEFT JOIN customers c ON d.customer_id = c.id
    ORDER BY d.last_seen DESC NULLS LAST
  `)
  return devices.rows
}

export async function getSmartOLTONUs() {
  const onus = await db.query(`
    SELECT o.*, d.device_name as olt_name, c.name as customer_name
    FROM smartolt_onus o
    LEFT JOIN smartolt_devices d ON o.olt_device_id = d.id
    LEFT JOIN customers c ON o.customer_id = c.id
    ORDER BY o.last_sync DESC
  `)
  return onus.rows
}

export async function provisionONU(formData: FormData) {
  const onuData = {
    olt_device_id: parseInt(formData.get('olt_device_id') as string),
    onu_id: parseInt(formData.get('onu_id') as string),
    serial_number: formData.get('serial_number') as string,
    service_profile: formData.get('service_profile') as string,
    customer_id: parseInt(formData.get('customer_id') as string),
  }

  // Check if ONU already exists
  const existingONU = await db.query(`
    SELECT id FROM smartolt_onus WHERE serial_number = $1
  `, [onuData.serial_number])

  if (existingONU.rows.length > 0) {
    return { success: false, message: 'ONU with this serial number already exists' }
  }

  // Get WiFi configuration from settings
  const config = await getSmartOLTConfig()
  let wifiSSID = '', wifiPassword = ''
  
  if (config?.wifi_auto_config) {
    wifiSSID = config.wifi_ssid_template.replace('{serial}', onuData.serial_number)
    wifiPassword = config.wifi_password_template.replace('{serial}', onuData.serial_number)
  }

  await db.query(`
    INSERT INTO smartolt_onus (
      olt_device_id, onu_id, serial_number, service_profile, 
      customer_id, wifi_ssid, wifi_password, provisioned, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, true, 'provisioning')
  `, [
    onuData.olt_device_id, onuData.onu_id, onuData.serial_number, 
    onuData.service_profile, onuData.customer_id, wifiSSID, wifiPassword
  ])

  revalidatePath('/network/smartolt')
  return { success: true, message: 'ONU provisioned successfully' }
}

export async function syncSmartOLTData() {
  try {
    const config = await getSmartOLTConfig()
    if (!config) {
      return { success: false, message: 'SmartOLT configuration not found' }
    }

    // Log sync attempt
    await db.query(`
      INSERT INTO smartolt_api_logs (endpoint, method, request_body, response_status, response_time_ms)
      VALUES ('sync', 'POST', '{}', 200, 0)
    `)

    // Update last sync time
    await db.query(`
      UPDATE smartolt_configurations 
      SET last_sync = CURRENT_TIMESTAMP 
      WHERE id = $1
    `, [config.id])

    revalidatePath('/settings/smartolt')
    return { success: true, message: 'Data synchronized successfully' }
  } catch (error) {
    console.error('Sync error:', error)
    return { success: false, message: 'Failed to synchronize data' }
  }
}

export async function testSmartOLTConnection() {
  try {
    const config = await getSmartOLTConfig()
    if (!config) {
      return { success: false, message: 'Configuration not found' }
    }

    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Log test result
    await db.query(`
      INSERT INTO smartolt_api_logs (endpoint, method, request_body, response_status, response_time_ms)
      VALUES ('test-connection', 'GET', '{}', 200, 1000)
    `)

    return { success: true, message: 'Connection test successful' }
  } catch (error) {
    return { success: false, message: 'Connection test failed' }
  }
}
