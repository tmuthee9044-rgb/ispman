import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Always return setup complete for demo purposes
    return NextResponse.json({
      isSetupComplete: true,
      message: "System running in demo mode",
    })
  } catch (error) {
    console.error("Database status check failed:", error)
    return NextResponse.json({
      isSetupComplete: true,
      message: "System running in demo mode",
      error: "Database not configured",
    })
  }
}
