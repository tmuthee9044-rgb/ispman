"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  DollarSign,
  TrendingUp,
  Users,
  Target,
  Download,
  Calendar,
  FileText,
  BarChart3,
  PieChartIcon,
  Calculator,
} from "lucide-react"

export default function RevenueReportPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")
  const [selectedReport, setSelectedReport] = useState("overview")

  // Sample data for different reports
  const revenueData = [
    { month: "Jan", revenue: 32000, expenses: 18000, profit: 14000 },
    { month: "Feb", revenue: 35000, expenses: 19500, profit: 15500 },
    { month: "Mar", revenue: 42000, expenses: 22000, profit: 20000 },
    { month: "Apr", revenue: 38000, expenses: 20500, profit: 17500 },
    { month: "May", revenue: 45000, expenses: 23000, profit: 22000 },
    { month: "Jun", revenue: 48000, expenses: 24500, profit: 23500 },
  ]

  const profitLossData = {
    revenue: {
      serviceRevenue: 285000,
      installationFees: 15000,
      equipmentSales: 8000,
      otherIncome: 2000,
      total: 310000,
    },
    expenses: {
      operatingExpenses: 125000,
      salaries: 85000,
      utilities: 25000,
      maintenance: 18000,
      marketing: 12000,
      depreciation: 15000,
      other: 8000,
      total: 288000,
    },
    netIncome: 22000,
  }

  const balanceSheetData = {
    assets: {
      currentAssets: {
        cash: 45000,
        accountsReceivable: 32000,
        inventory: 18000,
        prepaidExpenses: 5000,
        total: 100000,
      },
      fixedAssets: {
        equipment: 250000,
        vehicles: 85000,
        buildings: 150000,
        accumulatedDepreciation: -65000,
        total: 420000,
      },
      totalAssets: 520000,
    },
    liabilities: {
      currentLiabilities: {
        accountsPayable: 25000,
        accrualExpenses: 15000,
        shortTermDebt: 20000,
        total: 60000,
      },
      longTermLiabilities: {
        longTermDebt: 180000,
        total: 180000,
      },
      totalLiabilities: 240000,
    },
    equity: {
      paidInCapital: 200000,
      retainedEarnings: 80000,
      total: 280000,
    },
  }

  const trialBalanceData = [
    { account: "Cash", accountCode: "1001", debit: 45000, credit: 0 },
    { account: "Accounts Receivable", accountCode: "1002", debit: 32000, credit: 0 },
    { account: "Inventory", accountCode: "1003", debit: 18000, credit: 0 },
    { account: "Equipment", accountCode: "1501", debit: 250000, credit: 0 },
    { account: "Accumulated Depreciation", accountCode: "1502", debit: 0, credit: 65000 },
    { account: "Accounts Payable", accountCode: "2001", debit: 0, credit: 25000 },
    { account: "Long Term Debt", accountCode: "2501", debit: 0, credit: 180000 },
    { account: "Paid-in Capital", accountCode: "3001", debit: 0, credit: 200000 },
    { account: "Retained Earnings", accountCode: "3002", debit: 0, credit: 80000 },
    { account: "Service Revenue", accountCode: "4001", debit: 0, credit: 285000 },
    { account: "Operating Expenses", accountCode: "5001", debit: 125000, credit: 0 },
    { account: "Salaries Expense", accountCode: "5002", debit: 85000, credit: 0 },
  ]

  const ledgerAccounts = [
    {
      account: "Service Revenue",
      code: "4001",
      balance: 285000,
      type: "Revenue",
      transactions: [
        { date: "2024-01-15", description: "Monthly service fees", debit: 0, credit: 47500, balance: 47500 },
        { date: "2024-02-15", description: "Monthly service fees", debit: 0, credit: 48200, balance: 95700 },
        { date: "2024-03-15", description: "Monthly service fees", debit: 0, credit: 49800, balance: 145500 },
      ],
    },
    {
      account: "Operating Expenses",
      code: "5001",
      balance: 125000,
      type: "Expense",
      transactions: [
        { date: "2024-01-10", description: "Office rent", debit: 8000, credit: 0, balance: 8000 },
        { date: "2024-01-15", description: "Utilities", debit: 4200, credit: 0, balance: 12200 },
        { date: "2024-02-10", description: "Office rent", debit: 8000, credit: 0, balance: 20200 },
      ],
    },
  ]

  const expenseBreakdown = [
    { name: "Salaries", value: 85000, color: "#8884d8" },
    { name: "Operating", value: 125000, color: "#82ca9d" },
    { name: "Utilities", value: 25000, color: "#ffc658" },
    { name: "Maintenance", value: 18000, color: "#ff7300" },
    { name: "Marketing", value: 12000, color: "#00ff00" },
    { name: "Other", value: 23000, color: "#ff0000" },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Financial Reports</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-40">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>

      <Tabs value={selectedReport} onValueChange={setSelectedReport} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="profit-loss" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            P&L
          </TabsTrigger>
          <TabsTrigger value="balance-sheet" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Balance Sheet
          </TabsTrigger>
          <TabsTrigger value="trial-balance" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Trial Balance
          </TabsTrigger>
          <TabsTrigger value="ledger" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Ledger
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${profitLossData.revenue.total.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12.5% from last period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <TrendingUp className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${profitLossData.expenses.total.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+8.2% from last period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                <Target className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${profitLossData.netIncome.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+18.7% from last period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7.1%</div>
                <p className="text-xs text-muted-foreground">Industry average: 6.2%</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Expenses Trend</CardTitle>
                <CardDescription>Monthly comparison over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
                    expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
                    profit: { label: "Profit", color: "hsl(var(--chart-3))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} />
                      <Line type="monotone" dataKey="expenses" stroke="var(--color-expenses)" strokeWidth={2} />
                      <Line type="monotone" dataKey="profit" stroke="var(--color-profit)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Distribution of expenses by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: { label: "Amount", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expenseBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profit-loss" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss Statement</CardTitle>
              <CardDescription>For the period ending {new Date().toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-green-600">Revenue</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Service Revenue</span>
                      <span>${profitLossData.revenue.serviceRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Installation Fees</span>
                      <span>${profitLossData.revenue.installationFees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Equipment Sales</span>
                      <span>${profitLossData.revenue.equipmentSales.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Income</span>
                      <span>${profitLossData.revenue.otherIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total Revenue</span>
                      <span>${profitLossData.revenue.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-red-600">Expenses</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Operating Expenses</span>
                      <span>${profitLossData.expenses.operatingExpenses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Salaries & Benefits</span>
                      <span>${profitLossData.expenses.salaries.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Utilities</span>
                      <span>${profitLossData.expenses.utilities.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maintenance</span>
                      <span>${profitLossData.expenses.maintenance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marketing</span>
                      <span>${profitLossData.expenses.marketing.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Depreciation</span>
                      <span>${profitLossData.expenses.depreciation.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Expenses</span>
                      <span>${profitLossData.expenses.other.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total Expenses</span>
                      <span>${profitLossData.expenses.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Net Income</span>
                    <span className="text-green-600">${profitLossData.netIncome.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balance-sheet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Balance Sheet</CardTitle>
              <CardDescription>As of {new Date().toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">Assets</h3>

                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Current Assets</h4>
                    <div className="space-y-1 ml-4">
                      <div className="flex justify-between">
                        <span>Cash</span>
                        <span>${balanceSheetData.assets.currentAssets.cash.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Accounts Receivable</span>
                        <span>${balanceSheetData.assets.currentAssets.accountsReceivable.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Inventory</span>
                        <span>${balanceSheetData.assets.currentAssets.inventory.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prepaid Expenses</span>
                        <span>${balanceSheetData.assets.currentAssets.prepaidExpenses.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Total Current Assets</span>
                        <span>${balanceSheetData.assets.currentAssets.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Fixed Assets</h4>
                    <div className="space-y-1 ml-4">
                      <div className="flex justify-between">
                        <span>Equipment</span>
                        <span>${balanceSheetData.assets.fixedAssets.equipment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vehicles</span>
                        <span>${balanceSheetData.assets.fixedAssets.vehicles.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Buildings</span>
                        <span>${balanceSheetData.assets.fixedAssets.buildings.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Accumulated Depreciation</span>
                        <span>
                          (${Math.abs(balanceSheetData.assets.fixedAssets.accumulatedDepreciation).toLocaleString()})
                        </span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Total Fixed Assets</span>
                        <span>${balanceSheetData.assets.fixedAssets.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total Assets</span>
                    <span>${balanceSheetData.assets.totalAssets.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-red-600">Liabilities & Equity</h3>

                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Current Liabilities</h4>
                    <div className="space-y-1 ml-4">
                      <div className="flex justify-between">
                        <span>Accounts Payable</span>
                        <span>${balanceSheetData.liabilities.currentLiabilities.accountsPayable.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Accrued Expenses</span>
                        <span>${balanceSheetData.liabilities.currentLiabilities.accrualExpenses.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Short-term Debt</span>
                        <span>${balanceSheetData.liabilities.currentLiabilities.shortTermDebt.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Total Current Liabilities</span>
                        <span>${balanceSheetData.liabilities.currentLiabilities.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Long-term Liabilities</h4>
                    <div className="space-y-1 ml-4">
                      <div className="flex justify-between">
                        <span>Long-term Debt</span>
                        <span>${balanceSheetData.liabilities.longTermLiabilities.longTermDebt.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Total Long-term Liabilities</span>
                        <span>${balanceSheetData.liabilities.longTermLiabilities.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between font-medium border-t pt-2 mb-6">
                    <span>Total Liabilities</span>
                    <span>${balanceSheetData.liabilities.totalLiabilities.toLocaleString()}</span>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium mb-2 text-green-600">Equity</h4>
                    <div className="space-y-1 ml-4">
                      <div className="flex justify-between">
                        <span>Paid-in Capital</span>
                        <span>${balanceSheetData.equity.paidInCapital.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Retained Earnings</span>
                        <span>${balanceSheetData.equity.retainedEarnings.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Total Equity</span>
                        <span>${balanceSheetData.equity.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total Liabilities & Equity</span>
                    <span>
                      $
                      {(balanceSheetData.liabilities.totalLiabilities + balanceSheetData.equity.total).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trial-balance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trial Balance</CardTitle>
              <CardDescription>As of {new Date().toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Code</TableHead>
                      <TableHead>Account Name</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trialBalanceData.map((account, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono">{account.accountCode}</TableCell>
                        <TableCell className="font-medium">{account.account}</TableCell>
                        <TableCell className="text-right">
                          {account.debit > 0 ? `$${account.debit.toLocaleString()}` : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {account.credit > 0 ? `$${account.credit.toLocaleString()}` : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold border-t-2">
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell className="text-right">
                        ${trialBalanceData.reduce((sum, acc) => sum + acc.debit, 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ${trialBalanceData.reduce((sum, acc) => sum + acc.credit, 0).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ledger" className="space-y-4">
          <div className="grid gap-4">
            {ledgerAccounts.map((ledger, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">{ledger.account}</CardTitle>
                      <CardDescription>Account Code: {ledger.code}</CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge variant={ledger.type === "Revenue" ? "default" : "secondary"}>{ledger.type}</Badge>
                      <div className="text-lg font-bold mt-1">${ledger.balance.toLocaleString()}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Debit</TableHead>
                          <TableHead className="text-right">Credit</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ledger.transactions.map((transaction, txIndex) => (
                          <TableRow key={txIndex}>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell className="text-right">
                              {transaction.debit > 0 ? `$${transaction.debit.toLocaleString()}` : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              {transaction.credit > 0 ? `$${transaction.credit.toLocaleString()}` : "-"}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ${transaction.balance.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
