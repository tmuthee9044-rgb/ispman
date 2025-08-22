"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { allocateIP } from "@/app/actions/ip-actions"
import type { IPSubnet } from "@/types"
import { toast } from "sonner"

interface AllocateIPModalProps {
  subnets: IPSubnet[]
  children: React.ReactNode
}

export default function AllocateIPModal({ subnets, children }: AllocateIPModalProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        setError(null)
        const result = await allocateIP(formData)

        if (result?.success) {
          toast.success(result.message || "IP address allocated successfully")
          setOpen(false)
        } else {
          setError(result?.message || "Failed to allocate IP address")
        }
      } catch (err) {
        setError("An unexpected error occurred")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Allocate IP Address</DialogTitle>
          <DialogDescription>Assign an IP address to a device or customer.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(new FormData(e.currentTarget))
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="subnet_id">Subnet</Label>
            <Select name="subnet_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Select subnet" />
              </SelectTrigger>
              <SelectContent>
                {subnets.map((subnet) => (
                  <SelectItem key={subnet.id} value={subnet.id.toString()}>
                    {subnet.name} ({subnet.network}/{subnet.cidr})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ip_address">IP Address</Label>
            <Input id="ip_address" name="ip_address" placeholder="e.g., 192.168.1.50" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="device_type">Device Type</Label>
            <Select name="device_type" required>
              <SelectTrigger>
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="router">Router</SelectItem>
                <SelectItem value="customer">Customer Device</SelectItem>
                <SelectItem value="server">Server</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mac_address">MAC Address</Label>
              <Input id="mac_address" name="mac_address" placeholder="e.g., 00:11:22:33:44:55" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hostname">Hostname</Label>
              <Input id="hostname" name="hostname" placeholder="e.g., device-001" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer_id">Customer ID (Optional)</Label>
            <Input id="customer_id" name="customer_id" type="number" placeholder="Link to customer account" />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Allocating..." : "Allocate IP"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
