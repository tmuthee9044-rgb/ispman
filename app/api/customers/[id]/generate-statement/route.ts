import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get customer data
    const customer = await sql`
      SELECT * FROM customers WHERE id = ${params.id}
    `

    // Get payment history
    const payments = await sql`
      SELECT * FROM payments 
      WHERE customer_id = ${params.id} 
      ORDER BY created_at DESC 
      LIMIT 12
    `

    // Generate PDF content (simplified HTML for PDF generation)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Financial Statement</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .customer-info { margin-bottom: 20px; }
            .payments-table { width: 100%; border-collapse: collapse; }
            .payments-table th, .payments-table td { 
              border: 1px solid #ddd; padding: 8px; text-align: left; 
            }
            .payments-table th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TrustWaves Network</h1>
            <h2>Financial Statement</h2>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="customer-info">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${customer[0]?.name}</p>
            <p><strong>Email:</strong> ${customer[0]?.email}</p>
            <p><strong>Phone:</strong> ${customer[0]?.phone}</p>
            <p><strong>Current Balance:</strong> KES ${customer[0]?.balance || 0}</p>
          </div>

          <h3>Payment History</h3>
          <table class="payments-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${payments
                .map(
                  (payment) => `
                <tr>
                  <td>${new Date(payment.created_at).toLocaleDateString()}</td>
                  <td>KES ${payment.amount}</td>
                  <td>${payment.payment_method}</td>
                  <td>${payment.status}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `

    // In a real implementation, you'd use a PDF library like puppeteer
    // For now, return the HTML content as a downloadable file
    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="statement-${customer[0]?.name}-${new Date().toISOString().split("T")[0]}.html"`,
      },
    })
  } catch (error) {
    console.error("Error generating statement:", error)
    return NextResponse.json({ error: "Failed to generate statement" }, { status: 500 })
  }
}
