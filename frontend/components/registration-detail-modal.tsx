"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StatusBadge } from "@/components/status-badge"
import { Separator } from "@/components/ui/separator"
import { Car, User, Calendar, Hash } from "lucide-react"
import type { VehicleRegistration } from "@/types"

interface RegistrationDetailModalProps {
  registration: VehicleRegistration | null
  open: boolean
  onClose: () => void
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-foreground">{value || "N/A"}</p>
    </div>
  )
}

export function RegistrationDetailModal({ registration, open, onClose }: RegistrationDetailModalProps) {
  if (!registration) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Registration Details</DialogTitle>
            <StatusBadge status={registration.status} />
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">ID:</span>
              <code className="font-mono text-xs bg-background px-2 py-0.5 rounded">
                {registration.id.slice(0, 12)}...
              </code>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Submitted:</span>
              <span className="font-medium">{formatDate(registration.submittedAt)}</span>
            </div>
          </div>

          {registration.rejectionReason && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800">Rejection Reason</p>
              <p className="text-sm text-red-700 mt-1">{registration.rejectionReason}</p>
            </div>
          )}

          {/* Vehicle Details */}
          {registration.vehicle && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Car className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-foreground">Vehicle Information</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <DetailItem label="Plate Number" value={registration.vehicle.plateNumber} />
                <DetailItem label="Make" value={registration.vehicle.make} />
                <DetailItem label="Model" value={registration.vehicle.model} />
                <DetailItem label="Year" value={registration.vehicle.year} />
                <DetailItem label="Color" value={registration.vehicle.color} />
                <DetailItem label="Type" value={registration.vehicle.vehicleType} />
                <DetailItem label="Chassis No." value={registration.vehicle.chassisNumber} />
                <DetailItem label="Engine No." value={registration.vehicle.engineNumber} />
              </div>
            </div>
          )}

          <Separator />

          {/* Owner Details */}
          {registration.owner && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-foreground">Owner Information</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <DetailItem label="Full Name" value={registration.owner.fullName} />
                <DetailItem label="National ID" value={registration.owner.nationalId} />
                <DetailItem label="Phone" value={registration.owner.phoneNumber} />
                <DetailItem label="Email" value={registration.owner.email} />
                <div className="col-span-2">
                  <DetailItem label="Address" value={registration.owner.address} />
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
