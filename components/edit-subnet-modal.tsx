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
import { updateSubnet } from "@/app/actions/ip-actions"
import type { IPSubnet } from "@/types"
import { toast } from "sonner"

interface EditSubnetModalProps {
  subnet: IPSubnet
  children: React.ReactNode
}

export default function EditSubnetModal({ subnet, children }: EditSubnetModalProps) {
  const [open, setOpen] = useState(false)
  const [dhcpEnabled, setDhcpEnabled] = useState(subnet.dhcp_enabled)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        setError(null)
        const result = await updateSubnet(formData)

        if (result?.success) {
          toast.success(result.message || "Subnet updated successfully")
          setOpen(false)
        } else {
          setError(result?.message || "Failed to update subnet")
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
          <DialogTitle>Edit Subnet</DialogTitle>
          <DialogDescription>Update the configuration for {subnet.name}.</DialogDescription>
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
              <Input id="name" name="name" defaultValue={subnet.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={subnet.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Network</Label>
            <div className="text-sm text-muted-foreground font-mono">
              {subnet.network}/{subnet.cidr} ({subnet.type.toUpperCase()})
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gateway">Gateway</Label>
              <Input id="gateway" name="gateway" defaultValue={subnet.gateway} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vlan_id">VLAN ID</Label>
              <Input id="vlan_id" name="vlan_id" type="number" defaultValue={subnet.vlan_id} min="1" max="4094" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dns_primary">Primary DNS</Label>
              <Input id="dns_primary" name="dns_primary" defaultValue={subnet.dns_primary} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dns_secondary">Secondary DNS</Label>
              <Input id="dns_secondary" name="dns_secondary" defaultValue={subnet.dns_secondary} />
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
                <Input id="dhcp_start" name="dhcp_start" defaultValue={subnet.dhcp_start} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dhcp_end">DHCP End</Label>
                <Input id="dhcp_end" name="dhcp_end" defaultValue={subnet.dhcp_end} />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={subnet.description} rows={3} />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Subnet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
