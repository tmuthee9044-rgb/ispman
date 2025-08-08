"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Activity, Wifi, Zap, Play, Pause, RotateCcw, TrendingUp, TrendingDown, Signal, Clock } from "lucide-react"

interface LiveSpeedMonitorProps {
  customerId: number
}

interface SpeedData {
  download: number
  upload: number
  ping: number
  jitter: number
  packetLoss: number
  signalStrength: number
  timestamp: Date
}

export function LiveSpeedMonitor({ customerId }: LiveSpeedMonitorProps) {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [isRunningSpeedTest, setIsRunningSpeedTest] = useState(false)
  const [currentSpeed, setCurrentSpeed] = useState<SpeedData>({
    download: 0,
    upload: 0,
    ping: 0,
    jitter: 0,
    packetLoss: 0,
    signalStrength: 0,
    timestamp: new Date(),
  })
  const [speedHistory, setSpeedHistory] = useState<SpeedData[]>([])
  const [averageSpeed, setAverageSpeed] = useState({ download: 0, upload: 0 })

  // Customer's plan details (would come from props or API in real app)
  const planDetails = {
    name: "Premium Internet 100Mbps",
    maxDownload: 100,
    maxUpload: 25,
    planPrice: 79.99,
  }

  // Simulate realistic speed variations
  const generateSpeedData = (): SpeedData => {
    const baseDownload = planDetails.maxDownload * (0.85 + Math.random() * 0.15) // 85-100% of plan speed
    const baseUpload = planDetails.maxUpload * (0.8 + Math.random() * 0.2) // 80-100% of plan speed

    return {
      download: Math.round(baseDownload * 10) / 10,
      upload: Math.round(baseUpload * 10) / 10,
      ping: Math.round(8 + Math.random() * 12), // 8-20ms
      jitter: Math.round(1 + Math.random() * 4), // 1-5ms
      packetLoss: Math.round(Math.random() * 0.5 * 100) / 100, // 0-0.5%
      signalStrength: Math.round(85 + Math.random() * 15), // 85-100%
      timestamp: new Date(),
    }
  }

  // Start/stop monitoring
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isMonitoring) {
      interval = setInterval(() => {
        const newData = generateSpeedData()
        setCurrentSpeed(newData)

        setSpeedHistory((prev) => {
          const updated = [...prev, newData].slice(-20) // Keep last 20 readings

          // Calculate averages
          const avgDown = updated.reduce((sum, data) => sum + data.download, 0) / updated.length
          const avgUp = updated.reduce((sum, data) => sum + data.upload, 0) / updated.length
          setAverageSpeed({
            download: Math.round(avgDown * 10) / 10,
            upload: Math.round(avgUp * 10) / 10,
          })

          return updated
        })
      }, 2000) // Update every 2 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isMonitoring])

  const handleStartMonitoring = () => {
    setIsMonitoring(true)
    const initialData = generateSpeedData()
    setCurrentSpeed(initialData)
    setSpeedHistory([initialData])
  }

  const handleStopMonitoring = () => {
    setIsMonitoring(false)
  }

  const handleSpeedTest = async () => {
    setIsRunningSpeedTest(true)

    // Simulate speed test progression
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      const testData = generateSpeedData()
      setCurrentSpeed(testData)
    }

    setIsRunningSpeedTest(false)
  }

  const getQualityBadge = (speed: number, maxSpeed: number) => {
    const percentage = (speed / maxSpeed) * 100
    if (percentage >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (percentage >= 70) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
    if (percentage >= 50) return <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>
  }

  const getPingQuality = (ping: number) => {
    if (ping <= 20) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (ping <= 50) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
    if (ping <= 100) return <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Live Speed Monitor
            </CardTitle>
            <CardDescription>Real-time internet speed monitoring for Customer #{customerId}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSpeedTest} disabled={isRunningSpeedTest}>
              {isRunningSpeedTest ? (
                <>
                  <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Run Speed Test
                </>
              )}
            </Button>
            <Button
              onClick={isMonitoring ? handleStopMonitoring : handleStartMonitoring}
              variant={isMonitoring ? "destructive" : "default"}
            >
              {isMonitoring ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Stop Monitoring
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Monitoring
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Speed Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingDown className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{currentSpeed.download}</div>
              <div className="text-sm text-muted-foreground">Mbps Download</div>
              <Progress value={(currentSpeed.download / planDetails.maxDownload) * 100} className="mt-2" />
              {getQualityBadge(currentSpeed.download, planDetails.maxDownload)}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{currentSpeed.upload}</div>
              <div className="text-sm text-muted-foreground">Mbps Upload</div>
              <Progress value={(currentSpeed.upload / planDetails.maxUpload) * 100} className="mt-2" />
              {getQualityBadge(currentSpeed.upload, planDetails.maxUpload)}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{currentSpeed.ping}</div>
              <div className="text-sm text-muted-foreground">ms Ping</div>
              <div className="mt-2">{getPingQuality(currentSpeed.ping)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Signal className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{currentSpeed.signalStrength}%</div>
              <div className="text-sm text-muted-foreground">Signal Strength</div>
              <Progress value={currentSpeed.signalStrength} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Connection Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Connection Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan:</span>
                <span className="font-medium">{planDetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Download:</span>
                <span className="font-medium">{planDetails.maxDownload} Mbps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Upload:</span>
                <span className="font-medium">{planDetails.maxUpload} Mbps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Fee:</span>
                <span className="font-medium">${planDetails.planPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge className={isMonitoring ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {isMonitoring ? "Monitoring" : "Idle"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Download:</span>
                <span className="font-medium">{averageSpeed.download} Mbps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Upload:</span>
                <span className="font-medium">{averageSpeed.upload} Mbps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jitter:</span>
                <span className="font-medium">{currentSpeed.jitter} ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Packet Loss:</span>
                <span className="font-medium">{currentSpeed.packetLoss}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-medium">{currentSpeed.timestamp.toLocaleTimeString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Speed History Chart */}
        {speedHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Speed History</CardTitle>
              <CardDescription>Real-time speed measurements over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-end justify-between gap-1">
                {speedHistory.map((data, index) => (
                  <div key={index} className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className="bg-blue-500 rounded-t min-w-[4px]"
                      style={{
                        height: `${(data.download / planDetails.maxDownload) * 100}%`,
                        minHeight: "4px",
                      }}
                      title={`Download: ${data.download} Mbps`}
                    />
                    <div
                      className="bg-green-500 rounded-b min-w-[4px]"
                      style={{
                        height: `${(data.upload / planDetails.maxUpload) * 100}%`,
                        minHeight: "4px",
                      }}
                      title={`Upload: ${data.upload} Mbps`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Download</span>
                <span>Upload</span>
              </div>
            </CardContent>
          </Card>
        )}

        {!isMonitoring && speedHistory.length === 0 && (
          <div className="text-center py-8">
            <Wifi className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Speed Monitoring Inactive</h3>
            <p className="text-muted-foreground mb-4">Click "Start Monitoring" to begin real-time speed tracking</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
