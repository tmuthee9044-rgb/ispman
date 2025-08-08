"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, MessageSquare, Send, Clock, User } from "lucide-react"

interface SendMessageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerId: number
  customerName: string
  customerEmail: string
  customerPhone: string
}

export function SendMessageModal({
  open,
  onOpenChange,
  customerId,
  customerName,
  customerEmail,
  customerPhone,
}: SendMessageModalProps) {
  const [messageType, setMessageType] = useState("email")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [template, setTemplate] = useState("")
  const [priority, setPriority] = useState("normal")
  const [scheduleMessage, setScheduleMessage] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const emailTemplates = [
    { value: "payment_reminder", label: "Payment Reminder", subject: "Payment Due Reminder" },
    { value: "service_update", label: "Service Update", subject: "Service Update Notification" },
    { value: "maintenance", label: "Maintenance Notice", subject: "Scheduled Maintenance Notice" },
    { value: "welcome", label: "Welcome Message", subject: "Welcome to Our Service" },
    { value: "custom", label: "Custom Message", subject: "" },
  ]

  const smsTemplates = [
    {
      value: "payment_due",
      label: "Payment Due",
      message: "Your payment of $XX.XX is due in 3 days. Pay now to avoid service interruption.",
    },
    {
      value: "service_active",
      label: "Service Activated",
      message: "Your internet service has been activated. Welcome!",
    },
    {
      value: "maintenance",
      label: "Maintenance Alert",
      message: "Scheduled maintenance on [DATE] from [TIME]. Service may be affected.",
    },
    { value: "custom", label: "Custom SMS", message: "" },
  ]

  const handleTemplateChange = (templateValue: string) => {
    setTemplate(templateValue)

    if (messageType === "email") {
      const selectedTemplate = emailTemplates.find((t) => t.value === templateValue)
      if (selectedTemplate) {
        setSubject(selectedTemplate.subject)
        // Set default message content based on template
        switch (templateValue) {
          case "payment_reminder":
            setMessage(
              `Dear ${customerName},\n\nThis is a friendly reminder that your monthly payment is due soon. Please make your payment to avoid any service interruption.\n\nThank you for choosing our service.`,
            )
            break
          case "service_update":
            setMessage(
              `Dear ${customerName},\n\nWe wanted to inform you about an important update to your service.\n\nIf you have any questions, please don't hesitate to contact us.`,
            )
            break
          case "maintenance":
            setMessage(
              `Dear ${customerName},\n\nWe will be performing scheduled maintenance that may affect your service.\n\nWe apologize for any inconvenience.`,
            )
            break
          case "welcome":
            setMessage(
              `Dear ${customerName},\n\nWelcome to our internet service! We're excited to have you as a customer.\n\nYour service is now active and ready to use.`,
            )
            break
          default:
            setMessage("")
        }
      }
    } else {
      const selectedTemplate = smsTemplates.find((t) => t.value === templateValue)
      if (selectedTemplate) {
        setMessage(selectedTemplate.message)
      }
    }
  }

  const handleSend = async () => {
    setIsLoading(true)
    try {
      // Simulate sending message
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Sending message:", {
        customerId,
        type: messageType,
        subject: messageType === "email" ? subject : undefined,
        message,
        priority,
        scheduled: scheduleMessage,
        scheduleDate: scheduleMessage ? scheduleDate : undefined,
        scheduleTime: scheduleMessage ? scheduleTime : undefined,
      })

      onOpenChange(false)
      // Reset form
      setSubject("")
      setMessage("")
      setTemplate("")
      setPriority("normal")
      setScheduleMessage(false)
      setScheduleDate("")
      setScheduleTime("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {messageType === "email" ? <Mail className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
            Send {messageType === "email" ? "Email" : "SMS"} to {customerName}
          </DialogTitle>
          <DialogDescription>
            Send a {messageType === "email" ? "email" : "SMS"} message to this customer
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Message Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Message Type</Label>
                  <RadioGroup value={messageType} onValueChange={setMessageType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sms" id="sms" />
                      <Label htmlFor="sms" className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        SMS
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="template">Template</Label>
                  <Select value={template} onValueChange={handleTemplateChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {(messageType === "email" ? emailTemplates : smsTemplates).map((tmpl) => (
                        <SelectItem key={tmpl.value} value={tmpl.value}>
                          {tmpl.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {messageType === "email" && (
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter email subject"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      messageType === "email"
                        ? "Enter your email message"
                        : "Enter your SMS message (160 characters max)"
                    }
                    rows={messageType === "email" ? 8 : 4}
                    maxLength={messageType === "sms" ? 160 : undefined}
                  />
                  {messageType === "sms" && (
                    <div className="text-sm text-muted-foreground mt-1">{message.length}/160 characters</div>
                  )}
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="schedule"
                      checked={scheduleMessage}
                      onCheckedChange={(checked) => setScheduleMessage(checked as boolean)}
                    />
                    <Label htmlFor="schedule">Schedule message for later</Label>
                  </div>

                  {scheduleMessage && (
                    <div className="grid grid-cols-2 gap-3 p-3 border rounded-lg bg-muted/20">
                      <div>
                        <Label htmlFor="schedule-date">Date</Label>
                        <Input
                          id="schedule-date"
                          type="date"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="schedule-time">Time</Label>
                        <Input
                          id="schedule-time"
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Recipient Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Customer</div>
                  <div className="font-medium">{customerName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Customer ID</div>
                  <div className="font-medium">#{customerId}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium text-sm">{customerEmail}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div className="font-medium">{customerPhone}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Message Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant="outline" className="capitalize">
                    {messageType}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Priority:</span>
                  <Badge
                    className={
                      priority === "urgent"
                        ? "bg-red-100 text-red-800"
                        : priority === "high"
                          ? "bg-orange-100 text-orange-800"
                          : priority === "low"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                    }
                  >
                    {priority}
                  </Badge>
                </div>
                {scheduleMessage && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scheduled:</span>
                    <div className="text-sm">
                      {scheduleDate} {scheduleTime}
                    </div>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={scheduleMessage ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}>
                    {scheduleMessage ? "Scheduled" : "Send Now"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSend}
              disabled={!message || (messageType === "email" && !subject) || isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {scheduleMessage ? "Schedule Message" : "Send Message"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
