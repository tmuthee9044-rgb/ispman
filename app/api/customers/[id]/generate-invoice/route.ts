import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get customer and services data
    const customer = await sql`
      SELECT * FROM customers WHERE id = ${params.id}
    `

    const services = await sql`
      SELECT cs.*, sp.name as service_name 
      FROM customer_services cs
      LEFT JOIN service_plans sp ON cs.service_plan_id = sp.id
      WHERE cs.customer_id = ${params.id} AND cs.status = 'active'
    `

    const totalAmount = services.reduce((sum: number, service: any) => sum + (service.monthly_fee || 0), 0)
    const vatAmount = totalAmount * 0.16
    const grandTotal = totalAmount + vatAmount

    // Generate invoice HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .services-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .services-table th, .services-table td { 
              border: 1px solid #ddd; padding: 8px; text-align: left; 
            }
            .services-table th { background-color: #f2f2f2; }
            .totals { text-align: right; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TrustWaves Network</h1>
            <h2>INVOICE</h2>
            <p>Invoice #: INV-${Date.now()}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="invoice-details">
            <div>
              <h3>Bill To:</h3>
              <p>${customer[0]?.name}</p>
              <p>${customer[0]?.email}</p>
              <p>${customer[0]?.phone}</p>
              <p>${customer[0]?.address}</p>
            </div>
            <div>
              <h3>From:</h3>
              <p>TrustWaves Network</p>
              <p>Nairobi, Kenya</p>
              <p>info@trustwavesnetwork.com</p>
            </div>
          </div>

          <table class="services-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Monthly Fee</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${services
                .map(
                  (service: any) => `
                <tr>
                  <td>${service.service_name || "Internet Service"}</td>
                  <td>KES ${service.monthly_fee}</td>
                  <td>${service.status}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>

          <div class="totals">
            <p><strong>Subtotal: KES ${totalAmount.toFixed(2)}</strong></p>
            <p><strong>VAT (16%): KES ${vatAmount.toFixed(2)}</strong></p>
            <p><strong>Total: KES ${grandTotal.toFixed(2)}</strong></p>
          </div>
        </body>
      </html>
    `

    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="invoice-${customer[0]?.name}-${new Date().toISOString().split("T")[0]}.html"`,
      },
    })
  } catch (error) {
    console.error("Error generating invoice:", error)
    return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 })
  }
}
