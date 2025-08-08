"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Upload, Building2, MapPin, Phone, Globe, Palette, FileText, Save, TestTube } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function CompanySettingsPage() {
  const [activeTab, setActiveTab] = useState("basic")
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Settings saved",
        description: "Company settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Company Profile</h2>
          <p className="text-muted-foreground">Manage your company information, branding, and contact details</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="default" className="bg-green-100 text-green-800">
            Configured
          </Badge>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="localization">Localization</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Company Information</span>
              </CardTitle>
              <CardDescription>Basic company details that appear throughout the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name *</Label>
                  <Input id="company-name" placeholder="Your ISP Company Name" defaultValue="TechConnect ISP" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trading-name">Trading Name</Label>
                  <Input id="trading-name" placeholder="Trading or DBA name" defaultValue="TechConnect" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registration-number">Registration Number</Label>
                  <Input
                    id="registration-number"
                    placeholder="Company registration number"
                    defaultValue="RC123456789"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-number">Tax ID/VAT Number</Label>
                  <Input id="tax-number" placeholder="Tax identification number" defaultValue="VAT123456789" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of your company"
                  defaultValue="Leading internet service provider offering high-speed connectivity solutions for homes and businesses."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select defaultValue="telecommunications">
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="telecommunications">Telecommunications</SelectItem>
                      <SelectItem value="internet-services">Internet Services</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-size">Company Size</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">1-50 employees</SelectItem>
                      <SelectItem value="medium">51-200 employees</SelectItem>
                      <SelectItem value="large">201+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founded-year">Founded Year</Label>
                  <Input id="founded-year" type="number" placeholder="2020" defaultValue="2018" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Logo & Branding</span>
              </CardTitle>
              <CardDescription>Upload your company logo and configure branding elements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Company Logo</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <Button variant="outline" size="sm">
                          Upload Logo
                        </Button>
                        <p className="mt-2 text-sm text-gray-500">PNG, JPG up to 2MB (Recommended: 200x80px)</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Favicon</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="mt-2">
                        <Button variant="outline" size="sm">
                          Upload Favicon
                        </Button>
                        <p className="mt-1 text-xs text-gray-500">ICO, PNG 32x32px</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Brand Colors</Label>
                    <div className="mt-2 space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded border"></div>
                        <div className="flex-1">
                          <Label className="text-sm">Primary Color</Label>
                          <Input defaultValue="#2563eb" className="mt-1" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-600 rounded border"></div>
                        <div className="flex-1">
                          <Label className="text-sm">Secondary Color</Label>
                          <Input defaultValue="#4b5563" className="mt-1" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-600 rounded border"></div>
                        <div className="flex-1">
                          <Label className="text-sm">Accent Color</Label>
                          <Input defaultValue="#16a34a" className="mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Document Templates</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Invoice Template</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Template
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full">
                          <TestTube className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Letterhead</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Template
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full">
                          <TestTube className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Receipt Template</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Template
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full">
                          <TestTube className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Contact Information</span>
              </CardTitle>
              <CardDescription>Contact details for customer communications and legal documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-phone">Primary Phone *</Label>
                    <Input id="primary-phone" placeholder="+254 700 000 000" defaultValue="+254 712 345 678" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-phone">Secondary Phone</Label>
                    <Input id="secondary-phone" placeholder="+254 700 000 000" defaultValue="+254 720 987 654" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primary-email">Primary Email *</Label>
                    <Input
                      id="primary-email"
                      type="email"
                      placeholder="info@company.com"
                      defaultValue="info@techconnect.co.ke"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input
                      id="support-email"
                      type="email"
                      placeholder="support@company.com"
                      defaultValue="support@techconnect.co.ke"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://www.company.com"
                      defaultValue="https://www.techconnect.co.ke"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social-facebook">Facebook</Label>
                    <Input
                      id="social-facebook"
                      placeholder="https://facebook.com/company"
                      defaultValue="https://facebook.com/techconnectisp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social-twitter">Twitter/X</Label>
                    <Input
                      id="social-twitter"
                      placeholder="https://twitter.com/company"
                      defaultValue="https://twitter.com/techconnectisp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social-linkedin">LinkedIn</Label>
                    <Input
                      id="social-linkedin"
                      placeholder="https://linkedin.com/company/company"
                      defaultValue="https://linkedin.com/company/techconnect"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Physical Address</span>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street-address">Street Address *</Label>
                    <Input
                      id="street-address"
                      placeholder="123 Main Street"
                      defaultValue="Westlands Business Park, Block A"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" placeholder="City" defaultValue="Nairobi" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/County</Label>
                    <Input id="state" placeholder="State/County" defaultValue="Nairobi County" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal-code">Postal Code</Label>
                    <Input id="postal-code" placeholder="00100" defaultValue="00100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select defaultValue="kenya">
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kenya">Kenya</SelectItem>
                        <SelectItem value="uganda">Uganda</SelectItem>
                        <SelectItem value="tanzania">Tanzania</SelectItem>
                        <SelectItem value="rwanda">Rwanda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Localization Settings</span>
              </CardTitle>
              <CardDescription>Configure regional settings, currency, and language preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-language">Default Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="sw">Swahili</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="kes">
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kes">KES - Kenyan Shilling</SelectItem>
                      <SelectItem value="ugx">UGX - Ugandan Shilling</SelectItem>
                      <SelectItem value="tzs">TZS - Tanzanian Shilling</SelectItem>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="eat">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eat">EAT (UTC+3)</SelectItem>
                      <SelectItem value="cat">CAT (UTC+2)</SelectItem>
                      <SelectItem value="wat">WAT (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="dd/mm/yyyy">
                    <SelectTrigger>
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time-format">Time Format</Label>
                  <Select defaultValue="24h">
                    <SelectTrigger>
                      <SelectValue placeholder="Select time format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24 Hour</SelectItem>
                      <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number-format">Number Format</Label>
                  <Select defaultValue="comma">
                    <SelectTrigger>
                      <SelectValue placeholder="Select number format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comma">1,234.56</SelectItem>
                      <SelectItem value="space">1 234.56</SelectItem>
                      <SelectItem value="period">1.234,56</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="week-start">Week Starts On</Label>
                  <Select defaultValue="monday">
                    <SelectTrigger>
                      <SelectValue placeholder="Select week start" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunday">Sunday</SelectItem>
                      <SelectItem value="monday">Monday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Regional Compliance</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tax-system">Tax System</Label>
                    <Select defaultValue="vat">
                      <SelectTrigger>
                        <SelectValue placeholder="Select tax system" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vat">VAT (Value Added Tax)</SelectItem>
                        <SelectItem value="gst">GST (Goods and Services Tax)</SelectItem>
                        <SelectItem value="sales">Sales Tax</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                    <Input
                      id="tax-rate"
                      type="number"
                      placeholder="16"
                      defaultValue="16"
                      min="0"
                      max="100"
                      step="0.01"
                    />
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
