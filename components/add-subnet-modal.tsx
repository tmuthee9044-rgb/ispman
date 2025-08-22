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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createSubnet } from "@/app/actions/ip-actions"
import { toast } from "sonner"

interface AddSubnetModalProps {
  children: React.ReactNode
}

export default function AddSubnetModal({ children }: AddSubnetModalProps) {
  const [open, setOpen] = useState(false)
  const [dhcpEnabled, setDhcpEnabled] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        setError(null)
        const result = await createSubnet(formData)

        if (result?.success) {
          toast.success(result.message || "Subnet created successfully")
          setOpen(false)
          setDhcpEnabled(false)
        } else {
          setError(result?.message || "Failed to create subnet")
        }
      } catch (err) {
        setError("An unexpected error occurred")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Subnet</DialogTitle>
          <DialogDescription>Create a new IP subnet for your network infrastructure.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(new FormData(e.currentTarget))
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Subnet Name</Label>
              <Input id="name" name="name" placeholder="e.g., Main Network" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">IP Version</Label>
              <Select name="type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select IP version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ipv4">IPv4</SelectItem>
                  <SelectItem value="ipv6">IPv6</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="network">Network Address</Label>
              <Input id="network" name="network" placeholder="e.g., 192.168.1.0" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cidr">CIDR</Label>
              <Input id="cidr" name="cidr" type="number" placeholder="e.g., 24" min="1" max="128" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gateway">Gateway</Label>
              <Input id="gateway" name="gateway" placeholder="e.g., 192.168.1.1" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vlan_id">VLAN ID (Optional)</Label>
              <Input id="vlan_id" name="vlan_id" type="number" placeholder="e.g., 10" min="1" max="4094" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dns_primary">Primary DNS</Label>
              <Input id="dns_primary" name="dns_primary" placeholder="e.g., 8.8.8.8" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dns_secondary">Secondary DNS</Label>
              <Input id="dns_secondary" name="dns_secondary" placeholder="e.g., 8.8.4.4" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="dhcp_enabled" name="dhcp_enabled" checked={dhcpEnabled} onCheckedChange={setDhcpEnabled} />
            <Label htmlFor="dhcp_enabled">Enable DHCP</Label>
          </div>

          {dhcpEnabled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dhcp_start">DHCP Start</Label>
                <Input id="dhcp_start" name="dhcp_start" placeholder="e.g., 192.168.1.100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dhcp_end">DHCP End</Label>
                <Input id="dhcp_end" name="dhcp_end" placeholder="e.g., 192.168.1.200" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Brief description of this subnet..." rows={3} />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Subnet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
