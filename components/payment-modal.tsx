"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { processPayment } from "@/app/actions/customer-service-actions"
import { format } from "date-fns"
import { CreditCard, Smartphone, Building2, Banknote, CalendarIcon, DollarSign, Clock, CheckCircle } from "lucide-react"
import { formatCurrency } from "@/lib/currency"

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerId: number
  customerName: string
  currentBalance: number
}

export function PaymentModal({ open, onOpenChange, customerId, customerName, currentBalance }: PaymentModalProps) {
  const [paymentType, setPaymentType] = useState("service")
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState("")
  const [reference, setReference] = useState("")
  const [mpesaNumber, setMpesaNumber] = useState("")
  const [airtelNumber, setAirtelNumber] = useState("")
  const [bankAccount, setBankAccount] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [paymentDate, setPaymentDate] = useState<Date>(new Date())
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const paymentTypes = [
    { value: "service", label: "Service Payment", description: "Regular monthly service payment" },
    { value: "advance", label: "Advance Payment", description: "Payment for future months" },
    { value: "penalty", label: "Penalty Payment", description: "Late payment fees or penalties" },
    { value: "refund", label: "Refund", description: "Refund to customer account" },
  ]

  const paymentMethods = [
    {
      value: "mpesa",
      label: "M-Pesa",
      icon: Smartphone,
      description: "Mobile money payment",
      fee: 0.5,
    },
    {
      value: "airtel",
      label: "Airtel Money",
      icon: Smartphone,
      description: "Airtel mobile money",
      fee: 0.5,
    },
    {
      value: "bank",
      label: "Bank Transfer",
      icon: Building2,
      description: "Direct bank transfer",
      fee: 2.0,
    },
    {
      value: "cash",
      label: "Cash",
      icon: Banknote,
      description: "Cash payment at office",
      fee: 0,
    },
    {
      value: "card",
      label: "Credit/Debit Card",
      icon: CreditCard,
      description: "Card payment",
      fee: 2.5,
    },
  ]

  const selectedMethod = paymentMethods.find((m) => m.value === method)
  const paymentAmount = Number.parseFloat(amount) || 0
  const processingFee = selectedMethod ? (paymentAmount * selectedMethod.fee) / 100 : 0
  const totalAmount = paymentAmount + processingFee

  const generateReference = () => {
    const prefix = method.toUpperCase().substring(0, 3)
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    setReference(`${prefix}${timestamp}${random}`)
  }

  const handleSubmit = async () => {
    if (!amount || !method || !paymentType) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("customer_id", customerId.toString())
      formData.append("amount", totalAmount.toString())
      formData.append("method", method)
      formData.append("reference", reference)
      formData.append("payment_type", paymentType)
      formData.append("payment_date", paymentDate.toISOString())
      formData.append("notes", notes)

      if (method === "mpesa") {
        formData.append("mpesa_number", mpesaNumber)
      } else if (method === "airtel") {
        formData.append("airtel_number", airtelNumber)
      } else if (method === "bank") {
        formData.append("bank_account", bankAccount)
      } else if (method === "card") {
        formData.append("card_number", cardNumber)
        formData.append("expiry_date", expiryDate)
        formData.append("cvv", cvv)
      }

      const result = await processPayment(formData)

      if (result.success) {
        onOpenChange(false)
        // Reset form
        setAmount("")
        setMethod("")
        setReference("")
        setMpesaNumber("")
        setAirtelNumber("")
        setBankAccount("")
        setCardNumber("")
        setExpiryDate("")
        setCvv("")
        setNotes("")
      }
    } catch (error) {
      console.error("Error processing payment:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Process Payment for {customerName}</DialogTitle>
          <DialogDescription>Record a new payment for this customer</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Payment Type</Label>
                  <RadioGroup value={paymentType} onValueChange={setPaymentType}>
                    {paymentTypes.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={type.value} id={type.value} />
                        <Label htmlFor={type.value} className="cursor-pointer">
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="payment-date">Payment Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {paymentDate ? format(paymentDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={paymentDate}
                        onSelect={(date) => date && setPaymentDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes about this payment"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  {paymentMethods.map((paymentMethod) => (
                    <Card
                      key={paymentMethod.value}
                      className={`cursor-pointer transition-all ${
                        method === paymentMethod.value ? "ring-2 ring-primary border-primary" : "hover:shadow-sm"
                      }`}
                      onClick={() => setMethod(paymentMethod.value)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <paymentMethod.icon className="w-5 h-5" />
                          <div className="flex-1">
                            <div className="font-medium">{paymentMethod.label}</div>
                            <div className="text-sm text-muted-foreground">{paymentMethod.description}</div>
                          </div>
                          <Badge variant="outline">{paymentMethod.fee}% fee</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {method === "mpesa" && (
                  <div className="space-y-3 p-3 border rounded-lg bg-green-50/50">
                    <div>
                      <Label htmlFor="mpesa-number">M-Pesa Number</Label>
                      <Input
                        id="mpesa-number"
                        value={mpesaNumber}
                        onChange={(e) => setMpesaNumber(e.target.value)}
                        placeholder="254712345678"
                      />
                    </div>
                  </div>
                )}

                {method === "airtel" && (
                  <div className="space-y-3 p-3 border rounded-lg bg-red-50/50">
                    <div>
                      <Label htmlFor="airtel-number">Airtel Number</Label>
                      <Input
                        id="airtel-number"
                        value={airtelNumber}
                        onChange={(e) => setAirtelNumber(e.target.value)}
                        placeholder="254712345678"
                      />
                    </div>
                  </div>
                )}

                {method === "bank" && (
                  <div className="space-y-3 p-3 border rounded-lg bg-blue-50/50">
                    <div>
                      <Label htmlFor="bank-account">Bank Account</Label>
                      <Input
                        id="bank-account"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        placeholder="Account number or reference"
                      />
                    </div>
                  </div>
                )}

                {method === "card" && (
                  <div className="space-y-3 p-3 border rounded-lg bg-purple-50/50">
                    <div>
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input
                        id="card-number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="expiry-date">Expiry Date</Label>
                        <Input
                          id="expiry-date"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="reference">Reference Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="reference"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Payment reference"
                    />
                    <Button variant="outline" onClick={generateReference}>
                      Generate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Current Balance:</span>
                    <span className={currentBalance < 0 ? "text-red-600" : "text-green-600"}>
                      {formatCurrency(currentBalance)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Amount:</span>
                    <span>{formatCurrency(paymentAmount)}</span>
                  </div>
                  {processingFee > 0 && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Processing Fee ({selectedMethod?.fee}%):</span>
                      <span>{formatCurrency(processingFee)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>New Balance:</span>
                    <span className={currentBalance + paymentAmount < 0 ? "text-red-600" : "text-green-600"}>
                      {formatCurrency(currentBalance + paymentAmount)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!amount || !method || !paymentType || isLoading}
                  className="w-full mt-4"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Process Payment
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
