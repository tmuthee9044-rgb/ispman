"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import {
  Mail,
  MessageSquare,
  Send,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Copy,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react"
import {
  getMessageTemplates,
  createMessageTemplate,
  updateMessageTemplate,
  deleteMessageTemplate,
  sendMessage,
  getMessageHistory,
  getMessageStats,
  type MessageTemplate,
  type Message,
} from "@/app/actions/message-actions"

// Mock customer data
const mockCustomers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+254712345678",
    status: "active",
    plan: "Premium 50Mbps",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+254712345679",
    status: "active",
    plan: "Basic 10Mbps",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "+254712345680",
    status: "suspended",
    plan: "Standard 25Mbps",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    phone: "+254712345681",
    status: "overdue",
    plan: "Premium 50Mbps",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie@example.com",
    phone: "+254712345682",
    status: "active",
    plan: "Enterprise 100Mbps",
  },
]

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState("compose")
  const [messageType, setMessageType] = useState<"email" | "sms">("email")
  const [templates, setTemplates] = useState<MessageTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null)
  const [messageHistory, setMessageHistory] = useState<Message[]>([])
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [stats, setStats] = useState({
    total_messages: 0,
    sent_today: 0,
    sent_yesterday: 0,
    delivery_rate: 0,
    unread_count: 0,
  })

  // Form states
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [templateForm, setTemplateForm] = useState({
    name: "",
    type: "email" as "email" | "sms",
    category: "",
    subject: "",
    content: "",
  })

  useEffect(() => {
    loadTemplates()
    loadMessageHistory()
    loadStats()
  }, [])

  const loadTemplates = async () => {
    const result = await getMessageTemplates()
    if (result.success) {
      setTemplates(result.templates)
    }
  }

  const loadMessageHistory = async () => {
    const result = await getMessageHistory()
    if (result.success) {
      setMessageHistory(result.messages)
    }
  }

  const loadStats = async () => {
    const result = await getMessageStats()
    if (result.success) {
      setStats(result.stats)
    }
  }

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleTemplateSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template)
    setMessageType(template.type)
    setSubject(template.subject || "")
    setContent(template.content)
  }

  const handleSendMessage = async () => {
    if (selectedCustomers.length === 0) {
      toast({
        title: "No recipients selected",
        description: "Please select at least one customer to send the message to.",
        variant: "destructive",
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "Message content required",
        description: "Please enter a message to send.",
        variant: "destructive",
      })
      return
    }

    if (messageType === "email" && !subject.trim()) {
      toast({
        title: "Subject required",
        description: "Please enter a subject for the email.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    try {
      const formData = new FormData()
      formData.append("type", messageType)
      formData.append("recipients", JSON.stringify(selectedCustomers))
      formData.append("subject", subject)
      formData.append("content", content)
      if (selectedTemplate) {
        formData.append("template_id", selectedTemplate.id.toString())
      }

      const result = await sendMessage(formData)

      if (result.success) {
        toast({
          title: "Messages sent successfully",
          description: result.message,
        })

        // Reset form
        setSelectedCustomers([])
        setSubject("")
        setContent("")
        setSelectedTemplate(null)

        // Reload data
        loadMessageHistory()
        loadStats()
      } else {
        toast({
          title: "Failed to send messages",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error sending messages",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleCreateTemplate = async () => {
    if (!templateForm.name.trim() || !templateForm.content.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const formData = new FormData()
      formData.append("name", templateForm.name)
      formData.append("type", templateForm.type)
      formData.append("category", templateForm.category)
      formData.append("subject", templateForm.subject)
      formData.append("content", templateForm.content)

      const result = editingTemplate ? await updateMessageTemplate(formData) : await createMessageTemplate(formData)

      if (result.success) {
        toast({
          title: editingTemplate ? "Template updated" : "Template created",
          description: result.message,
        })

        setIsTemplateModalOpen(false)
        setEditingTemplate(null)
        setTemplateForm({
          name: "",
          type: "email",
          category: "",
          subject: "",
          content: "",
        })

        loadTemplates()
      } else {
        toast({
          title: "Failed to save template",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error saving template",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTemplate = async (id: number) => {
    try {
      const result = await deleteMessageTemplate(id)

      if (result.success) {
        toast({
          title: "Template deleted",
          description: result.message,
        })
        loadTemplates()
      } else {
        toast({
          title: "Failed to delete template",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error deleting template",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      suspended: "secondary",
      overdue: "destructive",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "default"}>{status}</Badge>
  }

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "opened":
        return <Eye className="h-4 w-4 text-blue-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsTemplateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_messages.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent Today</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sent_today}</div>
            <p className="text-xs text-muted-foreground">+{stats.sent_today - stats.sent_yesterday} from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.delivery_rate}%</div>
            <p className="text-xs text-muted-foreground">Successful deliveries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unread_count}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Message Composition */}
            <Card>
              <CardHeader>
                <CardTitle>Send Message</CardTitle>
                <CardDescription>Send SMS or email messages to customers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Button
                    variant={messageType === "email" ? "default" : "outline"}
                    onClick={() => setMessageType("email")}
                    className="flex-1"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                  <Button
                    variant={messageType === "sms" ? "default" : "outline"}
                    onClick={() => setMessageType("sms")}
                    className="flex-1"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    SMS
                  </Button>
                </div>

                <div>
                  <Label htmlFor="template-select">Use Template (Optional)</Label>
                  <Select
                    onValueChange={(value) => {
                      const template = templates.find((t) => t.id.toString() === value)
                      if (template) handleTemplateSelect(template)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates
                        .filter((t) => t.type === messageType)
                        .map((template) => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.name}
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
                  <Label htmlFor="content">Message Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={messageType === "email" ? "Enter email content..." : "Enter SMS content..."}
                    rows={6}
                  />
                  {messageType === "sms" && (
                    <p className="text-xs text-muted-foreground mt-1">{content.length}/160 characters</p>
                  )}
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={isSending || selectedCustomers.length === 0}
                  className="w-full"
                >
                  {isSending ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send to {selectedCustomers.length} customer{selectedCustomers.length !== 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Customer Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Recipients</CardTitle>
                <CardDescription>Choose customers to send the message to</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {filteredCustomers.map((customer) => (
                      <div key={customer.id} className="flex items-center space-x-2 p-2 border rounded">
                        <Checkbox
                          checked={selectedCustomers.includes(customer.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCustomers([...selectedCustomers, customer.id])
                            } else {
                              setSelectedCustomers(selectedCustomers.filter((id) => id !== customer.id))
                            }
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{customer.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {messageType === "email" ? customer.email : customer.phone}
                          </p>
                          <p className="text-xs text-muted-foreground">{customer.plan}</p>
                        </div>
                        {getStatusBadge(customer.status)}
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{selectedCustomers.length} selected</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const allIds = filteredCustomers.map((c) => c.id)
                      setSelectedCustomers(selectedCustomers.length === allIds.length ? [] : allIds)
                    }}
                  >
                    {selectedCustomers.length === filteredCustomers.length ? "Deselect All" : "Select All"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message History</CardTitle>
              <CardDescription>View all sent messages and their delivery status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Subject/Content</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messageHistory.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>
                        <Badge variant={message.type === "email" ? "default" : "secondary"}>
                          {message.type === "email" ? (
                            <Mail className="mr-1 h-3 w-3" />
                          ) : (
                            <MessageSquare className="mr-1 h-3 w-3" />
                          )}
                          {message.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{message.recipient}</TableCell>
                      <TableCell className="max-w-xs truncate">{message.subject || message.content}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {getMessageStatusIcon(message.status)}
                          <span className="capitalize">{message.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>{message.sent_at ? new Date(message.sent_at).toLocaleString() : "-"}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
              <CardDescription>Manage reusable message templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge variant={template.type === "email" ? "default" : "secondary"}>
                          {template.type.toUpperCase()}
                        </Badge>
                      </div>
                      <CardDescription>{template.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-3">
                        {template.subject && `${template.subject} - `}
                        {template.content}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <span>Used {template.usage_count} times</span>
                        <span>{template.variables.length} variables</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingTemplate(template)
                            setTemplateForm({
                              name: template.name,
                              type: template.type,
                              category: template.category,
                              subject: template.subject || "",
                              content: template.content,
                            })
                            setIsTemplateModalOpen(true)
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleTemplateSelect(template)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteTemplate(template.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Template Modal */}
      <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? "Edit Template" : "Create New Template"}</DialogTitle>
            <DialogDescription>
              Create reusable message templates with variables like {"{"}
              {"{"} customer_name {"}"}
              {"}"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                  placeholder="e.g., Welcome Message"
                />
              </div>
              <div>
                <Label htmlFor="template-type">Type</Label>
                <Select
                  value={templateForm.type}
                  onValueChange={(value: "email" | "sms") => setTemplateForm({ ...templateForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="template-category">Category</Label>
              <Select
                value={templateForm.category}
                onValueChange={(value) => setTemplateForm({ ...templateForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="promotional">Promotional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {templateForm.type === "email" && (
              <div>
                <Label htmlFor="template-subject">Subject</Label>
                <Input
                  id="template-subject"
                  value={templateForm.subject}
                  onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                  placeholder="Email subject line"
                />
              </div>
            )}

            <div>
              <Label htmlFor="template-content">Content</Label>
              <Textarea
                id="template-content"
                value={templateForm.content}
                onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                placeholder="Message content with variables like {{customer_name}}"
                rows={8}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use {"{"}
                {"{"} variable_name {"}"}
                {"}"} for dynamic content
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate}>{editingTemplate ? "Update Template" : "Create Template"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
