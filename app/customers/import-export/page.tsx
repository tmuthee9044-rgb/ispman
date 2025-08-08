"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Download, FileText, AlertCircle, CheckCircle, Clock, Users, Database, ArrowRight, Settings, RefreshCw } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

export default function ImportExportPage() {
  const [activeTab, setActiveTab] = useState("import")
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importProgress, setImportProgress] = useState(0)
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [mappingConfig, setMappingConfig] = useState({
    name: "customer_name",
    email: "email",
    phone: "phone_number",
    address: "address",
    plan: "service_plan",
    status: "status",
    balance: "account_balance",
    portal_username: "login_id",
  })

  const splynxFields = [
    "customer_name",
    "email",
    "phone_number",
    "address",
    "service_plan",
    "status",
    "account_balance",
    "login_id",
    "password",
    "ip_address",
    "mac_address",
    "connection_date",
    "last_payment",
    "monthly_fee",
    "notes",
  ]

  const systemFields = [
    { key: "name", label: "Customer Name", required: true },
    { key: "email", label: "Email Address", required: true },
    { key: "phone", label: "Phone Number", required: true },
    { key: "address", label: "Physical Address", required: false },
    { key: "plan", label: "Service Plan", required: false },
    { key: "status", label: "Account Status", required: false },
    { key: "balance", label: "Account Balance", required: false },
    { key: "portal_username", label: "Portal Login ID", required: true },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImportFile(file)
      toast({
        title: "File selected",
        description: `Selected ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
      })
    }
  }

  const handleImport = async () => {
    if (!importFile) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)
    setImportProgress(0)

    try {
      // Simulate import process
      for (let i = 0; i <= 100; i += 10) {
        setImportProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      toast({
        title: "Import completed",
        description: "Customer data has been successfully imported from Splynx",
      })
    } catch (error) {
      toast({
        title: "Import failed",
        description: "An error occurred during the import process",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    setExportProgress(0)

    try {
      // Simulate export process
      for (let i = 0; i <= 100; i += 20) {
        setExportProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      // Generate CSV content
      const csvContent = [
        ["Name", "Email", "Phone", "Address", "Plan", "Status", "Balance", "Portal Login ID"],
        ["John Doe", "john@example.com", "+254712345678", "123 Main St", "Premium", "Active", "0.00", "john001"],
        ["Jane Smith", "jane@example.com", "+254712345679", "456 Oak Ave", "Standard", "Active", "-49.99", "jane002"],
      ]
        .map((row) => row.join(","))
        .join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `customers_export_${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)

      toast({
        title: "Export completed",
        description: "Customer data has been exported successfully",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "An error occurred during the export process",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const previewData = [
    {
      customer_name: "John Doe",
      email: "john@example.com",
      phone_number: "+254712345678",
      service_plan: "Premium Internet",
      status: "Active",
      account_balance: "0.00",
      login_id: "john001",
    },
    {
      customer_name: "Jane Smith",
      email: "jane@example.com",
      phone_number: "+254712345679",
      service_plan: "Standard Internet",
      status: "Active",
      account_balance: "-49.99",
      login_id: "jane002",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customer Import/Export</h2>
          <p className="text-muted-foreground">Migrate customers from Splynx or export current customer data</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          <Database className="mr-1 h-3 w-3" />
          Splynx Compatible
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="import">Import from Splynx</TabsTrigger>
          <TabsTrigger value="export">Export Customers</TabsTrigger>
          <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Import Customer Data</span>
                </CardTitle>
                <CardDescription>Upload a CSV file exported from Splynx to migrate customer data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="import-file">Select CSV File</Label>
                  <Input id="import-file" type="file" accept=".csv" onChange={handleFileUpload} />
                  {importFile && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{importFile.name}</span>
                      <span>({(importFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Import Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="skip-duplicates" defaultChecked />
                      <Label htmlFor="skip-duplicates">Skip duplicate customers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="update-existing" />
                      <Label htmlFor="update-existing">Update existing customers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="create-portal-accounts" defaultChecked />
                      <Label htmlFor="create-portal-accounts">Create portal accounts automatically</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="send-welcome-emails" />
                      <Label htmlFor="send-welcome-emails">Send welcome emails to new customers</Label>
                    </div>
                  </div>
                </div>

                {isImporting && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Importing customers...</span>
                      <span>{importProgress}%</span>
                    </div>
                    <Progress value={importProgress} className="w-full" />
                  </div>
                )}

                <Button onClick={handleImport} disabled={!importFile || isImporting} className="w-full">
                  {isImporting ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Start Import
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Import Requirements</CardTitle>
                <CardDescription>Ensure your CSV file meets these requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">CSV Format</div>
                      <div className="text-muted-foreground">File must be in CSV format with headers</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">Required Fields</div>
                      <div className="text-muted-foreground">customer_name, email, phone_number, login_id</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">Portal Login ID</div>
                      <div className="text-muted-foreground">Unique identifier for customer payments</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">File Size Limit</div>
                      <div className="text-muted-foreground">Maximum 50MB per file</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Sample CSV Format</Label>
                  <div className="bg-muted p-3 rounded-md text-sm font-mono">
                    customer_name,email,phone_number,login_id
                    <br />
                    John Doe,john@example.com,+254712345678,john001
                    <br />
                    Jane Smith,jane@example.com,+254712345679,jane002
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {importFile && (
            <Card>
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>Preview of the data that will be imported</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Service Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Portal Login ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.customer_name}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.phone_number}</TableCell>
                        <TableCell>{row.service_plan}</TableCell>
                        <TableCell>
                          <Badge variant={row.status === "Active" ? "default" : "secondary"}>{row.status}</Badge>
                        </TableCell>
                        <TableCell className="font-mono">{row.login_id}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Export Customer Data</span>
                </CardTitle>
                <CardDescription>Export current customer data to CSV format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Export Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="export-all" defaultChecked />
                      <Label htmlFor="export-all">Export all customers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="export-active-only" />
                      <Label htmlFor="export-active-only">Active customers only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-services" defaultChecked />
                      <Label htmlFor="include-services">Include service information</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-payments" />
                      <Label htmlFor="include-payments">Include payment history</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All time</SelectItem>
                      <SelectItem value="last-30">Last 30 days</SelectItem>
                      <SelectItem value="last-90">Last 90 days</SelectItem>
                      <SelectItem value="last-year">Last year</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isExporting && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Exporting customers...</span>
                      <span>{exportProgress}%</span>
                    </div>
                    <Progress value={exportProgress} className="w-full" />
                  </div>
                )}

                <Button onClick={handleExport} disabled={isExporting} className="w-full">
                  {isExporting ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export to CSV
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Statistics</CardTitle>
                <CardDescription>Current customer database statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold">1,247</div>
                    <div className="text-sm text-muted-foreground">Total Customers</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">1,156</div>
                    <div className="text-sm text-muted-foreground">Active</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">67</div>
                    <div className="text-sm text-muted-foreground">Suspended</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-red-600">24</div>
                    <div className="text-sm text-muted-foreground">Inactive</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Export Fields</Label>
                  <div className="text-sm text-muted-foreground">
                    The following fields will be included in the export:
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <div>• Customer Name</div>
                    <div>• Email Address</div>
                    <div>• Phone Number</div>
                    <div>• Physical Address</div>
                    <div>• Service Plan</div>
                    <div>• Account Status</div>
                    <div>• Account Balance</div>
                    <div>• Portal Login ID</div>
                    <div>• Registration Date</div>
                    <div>• Last Payment</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mapping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Field Mapping Configuration</span>
              </CardTitle>
              <CardDescription>
                Map Splynx fields to system fields for accurate data import
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">System Fields</Label>
                  {systemFields.map((field) => (
                    <div key={field.key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{field.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {field.required ? "Required" : "Optional"}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">Splynx Fields Mapping</Label>
                  {systemFields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={`mapping-${field.key}`}>{field.label}</Label>
                      <Select
                        value={mappingConfig[field.key as keyof typeof mappingConfig]}
                        onValueChange={(value) =>
                          setMappingConfig((prev) => ({ ...prev, [field.key]: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Splynx field" />
                        </SelectTrigger>
                        <SelectContent>
                          {splynxFields.map((splynxField) => (
                            <SelectItem key={splynxField} value={splynxField}>
                              {splynxField}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset to Default
                </Button>
                <Button>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Save Mapping
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portal Login ID Configuration</CardTitle>
              <CardDescription>
                Configure how portal login IDs are generated and used for payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Login ID Format</Label>
                <Select defaultValue="custom">
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Use existing from Splynx</SelectItem>
                    <SelectItem value="name-number">firstname + number (john001)</SelectItem>
                    <SelectItem value="email-prefix">email prefix (john@example)</SelectItem>
                    <SelectItem value="phone-suffix">phone last 6 digits</SelectItem>
                    <SelectItem value="auto-increment">Auto increment (CUST001)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prefix">Login ID Prefix (Optional)</Label>
                <Input id="prefix" placeholder="e.g., CUST, TC, etc." />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-blue-900">Payment Integration</div>
                    <div className="text-blue-700 mt-1">
                      The Portal Login ID will be used as the account number for all payment platforms including M-Pesa,
                      Airtel Money, and bank transfers. Ensure IDs are unique and easy for customers to remember.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
