"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddVehicleModal } from "@/components/add-vehicle-modal"
import { VehicleDetailsModal } from "@/components/vehicle-details-modal"
import { MaintenanceModal } from "@/components/maintenance-modal"
import { FuelLogModal } from "@/components/fuel-log-modal"
import { BusFareModal } from "@/components/bus-fare-modal"
import { Car, Truck, Bus, Plus, Search, Filter, MoreHorizontal, Fuel, Wrench, MapPin, Calendar, DollarSign, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

interface Vehicle {
  id: number
  registration: string
  make: string
  model: string
  year: number
  type: "car" | "truck" | "bus" | "motorcycle"
  status: "active" | "maintenance" | "inactive"
  driver: string
  mileage: number
  fuel_consumption: number
  last_service: string
  next_service: string
  insurance_expiry: string
  location: string
}

const mockVehicles: Vehicle[] = [
  {
    id: 1,
    registration: "KCA 123A",
    make: "Toyota",
    model: "Hiace",
    year: 2020,
    type: "bus",
    status: "active",
    driver: "John Kamau",
    mileage: 45000,
    fuel_consumption: 12.5,
    last_service: "2024-01-10",
    next_service: "2024-04-10",
    insurance_expiry: "2024-12-31",
    location: "Nairobi CBD",
  },
  {
    id: 2,
    registration: "KBZ 456B",
    make: "Isuzu",
    model: "NPR",
    year: 2019,
    type: "truck",
    status: "maintenance",
    driver: "Peter Mwangi",
    mileage: 78000,
    fuel_consumption: 8.2,
    last_service: "2024-01-05",
    next_service: "2024-04-05",
    insurance_expiry: "2024-11-15",
    location: "Workshop",
  },
  {
    id: 3,
    registration: "KCD 789C",
    make: "Nissan",
    model: "Note",
    year: 2021,
    type: "car",
    status: "active",
    driver: "Mary Wanjiku",
    mileage: 25000,
    fuel_consumption: 15.8,
    last_service: "2024-01-15",
    next_service: "2024-04-15",
    insurance_expiry: "2025-01-20",
    location: "Westlands",
  },
]

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles)
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(mockVehicles)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)
  const [showFuelModal, setShowFuelModal] = useState(false)
  const [showBusFareModal, setShowBusFareModal] = useState(false)

  const stats = {
    total: vehicles.length,
    active: vehicles.filter((v) => v.status === "active").length,
    maintenance: vehicles.filter((v) => v.status === "maintenance").length,
    inactive: vehicles.filter((v) => v.status === "inactive").length,
  }

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "car":
        return <Car className="h-4 w-4" />
      case "truck":
        return <Truck className="h-4 w-4" />
      case "bus":
        return <Bus className="h-4 w-4" />
      default:
        return <Car className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
      case "inactive":
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterVehicles(term, statusFilter, typeFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    filterVehicles(searchTerm, status, typeFilter)
  }

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type)
    filterVehicles(searchTerm, statusFilter, type)
  }

  const filterVehicles = (search: string, status: string, type: string) => {
    let filtered = vehicles

    if (search) {
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.registration.toLowerCase().includes(search.toLowerCase()) ||
          vehicle.make.toLowerCase().includes(search.toLowerCase()) ||
          vehicle.model.toLowerCase().includes(search.toLowerCase()) ||
          vehicle.driver.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status !== "all") {
      filtered = filtered.filter((vehicle) => vehicle.status === status)
    }

    if (type !== "all") {
      filtered = filtered.filter((vehicle) => vehicle.type === type)
    }

    setFilteredVehicles(filtered)
  }

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setShowDetailsModal(true)
  }

  const handleMaintenanceClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setShowMaintenanceModal(true)
  }

  const handleFuelClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setShowFuelModal(true)
  }

  const handleBusFareClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setShowBusFareModal(true)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vehicle Management</h2>
          <p className="text-muted-foreground">Manage your fleet vehicles, maintenance, and operations</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Fleet size</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">On the road</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.maintenance}</div>
            <p className="text-xs text-muted-foreground">In workshop</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">Out of service</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Vehicles</CardTitle>
          <CardDescription>Search and filter your vehicle fleet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by registration, make, model, or driver..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="type-filter">Type</Label>
              <Select value={typeFilter} onValueChange={handleTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="bus">Bus</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle List */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Fleet</CardTitle>
          <CardDescription>Manage your vehicles and their operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Mileage</TableHead>
                  <TableHead>Fuel (L/100km)</TableHead>
                  <TableHead>Next Service</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No vehicles found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell onClick={() => handleVehicleClick(vehicle)}>
                        <div className="flex items-center space-x-3">
                          {getVehicleIcon(vehicle.type)}
                          <div>
                            <div className="font-medium">{vehicle.registration}</div>
                            <div className="text-sm text-muted-foreground">
                              {vehicle.make} {vehicle.model} ({vehicle.year})
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{vehicle.driver}</TableCell>
                      <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                      <TableCell>{vehicle.mileage.toLocaleString()} km</TableCell>
                      <TableCell>{vehicle.fuel_consumption}</TableCell>
                      <TableCell>{new Date(vehicle.next_service).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{vehicle.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMaintenanceClick(vehicle)}
                          >
                            <Wrench className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFuelClick(vehicle)}
                          >
                            <Fuel className="h-3 w-3" />
                          </Button>
                          {vehicle.type === "bus" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleBusFareClick(vehicle)}
                            >
                              <DollarSign className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddVehicleModal open={showAddModal} onOpenChange={setShowAddModal} />
      
      {selectedVehicle && (
        <>
          <VehicleDetailsModal
            open={showDetailsModal}
            onOpenChange={setShowDetailsModal}
            vehicle={selectedVehicle}
          />
          <MaintenanceModal
            open={showMaintenanceModal}
            onOpenChange={setShowMaintenanceModal}
            vehicle={selectedVehicle}
          />
          <FuelLogModal
            open={showFuelModal}
            onOpenChange={setShowFuelModal}
            vehicle={selectedVehicle}
          />
          <BusFareModal
            open={showBusFareModal}
            onOpenChange={setShowBusFareModal}
            vehicle={selectedVehicle}
          />
        </>
      )}
    </div>
  )
}
