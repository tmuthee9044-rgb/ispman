'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// Configuration Actions
export async function getTR069Config() {
  const config = await db.query(`
    SELECT * FROM tr069_configurations 
    WHERE status = 'active' 
    ORDER BY created_at DESC 
    LIMIT 1
  `)
  return config.rows[0] || null
}

export async function updateTR069Config(formData: FormData) {
  const config = {
    acs_server_url: formData.get('acs_server_url') as string,
    acs_username: formData.get('acs_username') as string,
    acs_password: formData.get('acs_password') as string,
    connection_request_username: formData.get('connection_request_username') as string,
    connection_request_password: formData.get('connection_request_password') as string,
    connection_request_port: parseInt(formData.get('connection_request_port') as string) || 7547,
    periodic_inform_enable: formData.get('periodic_inform_enable') === 'true',
    periodic_inform_interval: parseInt(formData.get('periodic_inform_interval') as string) || 3600,
    ssl_enabled: formData.get('ssl_enabled') === 'true',
    ssl_verify: formData.get('ssl_verify') === 'true',
    certificate_path: formData.get('certificate_path') as string,
  }

  // Check if config exists
  const existingConfig = await getTR069Config()
  
  if (existingConfig) {
    await db.query(`
      UPDATE tr069_configurations 
      SET acs_server_url = $1, acs_username = $2, acs_password = $3,
          connection_request_username = $4, connection_request_password = $5,
          connection_request_port = $6, periodic_inform_enable = $7,
          periodic_inform_interval = $8, ssl_enabled = $9, ssl_verify = $10,
          certificate_path = $11, updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
    `, [
      config.acs_server_url, config.acs_username, config.acs_password,
      config.connection_request_username, config.connection_request_password,
      config.connection_request_port, config.periodic_inform_enable,
      config.periodic_inform_interval, config.ssl_enabled, config.ssl_verify,
      config.certificate_path, existingConfig.id
    ])
  } else {
    await db.query(`
      INSERT INTO tr069_configurations (
        acs_server_url, acs_username, acs_password,
        connection_request_username, connection_request_password,
        connection_request_port, periodic_inform_enable,
        periodic_inform_interval, ssl_enabled, ssl_verify, certificate_path
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [
      config.acs_server_url, config.acs_username, config.acs_password,
      config.connection_request_username, config.connection_request_password,
      config.connection_request_port, config.periodic_inform_enable,
      config.periodic_inform_interval, config.ssl_enabled, config.ssl_verify,
      config.certificate_path
    ])
  }

  revalidatePath('/settings/tr069')
  return { success: true, message: 'TR-069 configuration updated successfully' }
}

// Device Actions
export async function getTR069Devices() {
  const devices = await db.query(`
    SELECT d.*, c.name as customer_name
    FROM tr069_devices d
    LEFT JOIN customers c ON d.customer_id = c.id
    ORDER BY d.last_inform DESC NULLS LAST
  `)
  return devices.rows
}

export async function getTR069Device(deviceId: string) {
  const device = await db.query(`
    SELECT d.*, c.name as customer_name
    FROM tr069_devices d
    LEFT JOIN customers c ON d.customer_id = c.id
    WHERE d.device_id = $1
  `, [deviceId])
  return device.rows[0] || null
}

// Task Actions
export async function createTR069Task(formData: FormData) {
  const taskData = {
    device_id: formData.get('device_id') as string,
    task_type: formData.get('task_type') as string,
    parameters: formData.get('parameters') ? JSON.parse(formData.get('parameters') as string) : {},
    scheduled_at: formData.get('scheduled_at') ? new Date(formData.get('scheduled_at') as string) : new Date(),
  }

  const result = await db.query(`
    INSERT INTO tr069_tasks (device_id, task_type, parameters, scheduled_at)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `, [taskData.device_id, taskData.task_type, JSON.stringify(taskData.parameters), taskData.scheduled_at])

  revalidatePath('/settings/tr069')
  return { success: true, taskId: result.rows[0].id, message: 'Task created successfully' }
}

export async function getTR069Tasks(deviceId?: string) {
  let query = `
    SELECT t.*, d.manufacturer, d.model, d.serial_number
    FROM tr069_tasks t
    JOIN tr069_devices d ON t.device_id = d.device_id
  `
  let params: any[] = []

  if (deviceId) {
    query += ' WHERE t.device_id = $1'
    params.push(deviceId)
  }

  query += ' ORDER BY t.created_at DESC'

  const tasks = await db.query(query, params)
  return tasks.rows
}

// Parameter Actions
export async function getDeviceParameters(deviceId: string) {
  const parameters = await db.query(`
    SELECT * FROM tr069_parameters 
    WHERE device_id = $1 
    ORDER BY parameter_name
  `, [deviceId])
  return parameters.rows
}

export async function updateDeviceParameter(deviceId: string, parameterName: string, value: string) {
  await db.query(`
    UPDATE tr069_parameters 
    SET parameter_value = $1, last_updated = CURRENT_TIMESTAMP
    WHERE device_id = $2 AND parameter_name = $3
  `, [value, deviceId, parameterName])

  revalidatePath('/settings/tr069')
  return { success: true, message: 'Parameter updated successfully' }
}
