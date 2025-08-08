"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { HeadphonesIcon, Plus, Clock, User, AlertTriangle } from "lucide-react"

interface CreateTicketModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerId: number
  customerName: string
}

export function CreateTicketModal({ open, onOpenChange, customerId, customerName }: CreateTicketModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("medium")
  const [assignedTo, setAssignedTo] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [notifyCustomer, setNotifyCustomer] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const categories = [
    { value: "technical", label: "Technical Issue" },
    { value: "billing", label: "Billing & Payment" },
    { value: "service", label: "Service Request" },
    { value: "complaint", label: "Complaint" },
    { value: "installation", label: "Installation" },
    { value: "maintenance", label: "Maintenance" },
    { value: "other", label: "Other" },
  ]

  const staff = [
    { value: "auto", label: "Auto-assign" },
    { value: "john_doe", label: "John Doe (Technical)" },
    { value: "jane_smith", label: "Jane Smith (Billing)" },
    { value: "mike_wilson", label: "Mike Wilson (Support)" },
    { value: "sarah_jones", label: "Sarah Jones (Manager)" },
  ]

  const commonTags = [
    "urgent",
    "network",
    "slow_speed",
    "outage",
    "router",
    "wifi",
    "billing",
    "payment",
    "installation",
    "maintenance",
    "complaint",
  ]

  const handleTagToggle = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Simulate ticket creation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const ticketData = {
        customerId,
        title,
        description,
        category,
        priority,
        assignedTo,
        tags,
        notifyCustomer,
        status: "open",
        createdAt: new Date().toISOString(),
      }

      console.log("Creating support ticket:", ticketData)

      onOpenChange(false)
      // Reset form
      setTitle("")
      setDescription("")
      setCategory("")
      setPriority("medium")
      setAssignedTo("")
      setTags([])
      setNotifyCustomer(true)
    } catch (error) {
      console.error("Error creating ticket:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-blue-100 text-blue-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HeadphonesIcon className="w-5 h-5" />
            Create Support Ticket for {customerName}
          </DialogTitle>
          <DialogDescription>Create a new support ticket to track and resolve customer issues</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ticket Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Ticket Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief description of the issue"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Priority Level</Label>
                  <RadioGroup value={priority} onValueChange={setPriority}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low">Low - General inquiry</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium">Medium - Standard issue</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high">High - Service affecting</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="critical" id="critical" />
                      <Label htmlFor="critical">Critical - Service down</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed description of the issue, steps taken, and any error messages"
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="assigned-to">Assign To</Label>
                  <Select value={assignedTo} onValueChange={setAssignedTo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {staff.map((member) => (
                        <SelectItem key={member.value} value={member.value}>
                          {member.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {commonTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={tags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Click tags to add/remove them</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notify-customer"
                    checked={notifyCustomer}
                    onCheckedChange={(checked) => setNotifyCustomer(checked as boolean)}
                  />
                  <Label htmlFor="notify-customer">Send notification to customer about this ticket</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
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
                  <div className="text-sm text-muted-foreground">Account Status</div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ticket Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <Badge variant="outline" className="capitalize">
                    {category || "Not selected"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Priority:</span>
                  <Badge className={getPriorityColor(priority)}>{priority}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assigned:</span>
                  <span className="text-sm">
                    {assignedTo ? staff.find((s) => s.value === assignedTo)?.label : "Unassigned"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tags:</span>
                  <span className="text-sm">{tags.length} selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Notify Customer:</span>
                  <Badge className={notifyCustomer ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {notifyCustomer ? "Yes" : "No"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {priority === "critical" && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">Critical Priority</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    This ticket will be escalated immediately and requires urgent attention.
                  </p>
                </CardContent>
              </Card>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!title || !description || !category || isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Creating Ticket...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Ticket
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
