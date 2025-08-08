import { Suspense } from "react"
import { CustomerDetailsClient } from "./customer-details-client"

interface CustomerPageProps {
  params: {
    id: string
  }
}

// Mock customer data - in production this would come from database
const getCustomerData = async (id: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  return {
    id: Number.parseInt(id),
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+254712345678",
    address: "456 Oak Street, Springfield, IL 62701",
    status: "active" as const,
    service_plan: "Premium Plan",
    monthly_fee: 79.99,
    created_at: "2024-03-20T10:30:00Z",
    updated_at: "2024-01-15T14:22:00Z",
    connection_type: "Fiber",
    router_ip: "192.168.1.100",
    mac_address: "00:1B:44:11:3A:B7",
    installation_date: "2024-03-20",
    last_payment: "2024-01-01",
    balance: 0,
    notes: "Premium customer with excellent payment history",
    portal_login_id: "jane_smith_001",
    portal_username: "janesmith",
    portal_password: "temp_password_123",
    router_allocated: "Router-A-001",
    ip_allocated: "192.168.1.100",
    customer_type: "individual" as const,
    payment_method: "mpesa",
    auto_payment: true,
  }
}

export default async function CustomerPage({ params }: CustomerPageProps) {
  const customer = await getCustomerData(params.id)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Suspense fallback={<div>Loading customer details...</div>}>
        <CustomerDetailsClient customer={customer} />
      </Suspense>
    </div>
  )
}
