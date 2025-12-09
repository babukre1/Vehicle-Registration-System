"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, CheckCircle, XCircle, Loader2, AlertCircle, Car, User, FileText } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { StatusBadge } from "@/components/status-badge"
import { registrationsApi } from "@/lib/api"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import type { VehicleRegistration } from "@/types"

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function DetailItem({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-medium text-foreground">{value || "N/A"}</p>
    </div>
  )
}

export default function ReviewRegistrationPage() {
  const [registration, setRegistration] = useState<VehicleRegistration | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()

  const registrationId = params.id as string

  const fetchRegistration = useCallback(async () => {
    setLoading(true)
    try {
      const data = await registrationsApi.getById(registrationId)
      setRegistration(data)
    } catch (error) {
      toast.error("Failed to load registration details")
      console.error(error)
      router.push("/admin/dashboard")
    } finally {
      setLoading(false)
    }
  }, [registrationId, router])

  useEffect(() => {
    if (registrationId) {
      fetchRegistration()
    }
  }, [registrationId, fetchRegistration])

  const handleApprove = async () => {
    setActionLoading(true)
    try {
      const updated = await registrationsApi.updateStatus(registrationId, { status: "APPROVED" })
      setRegistration(updated)
      toast.success("Registration approved successfully")
    } catch (error) {
      toast.error("Failed to approve registration")
      console.error(error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason")
      return
    }

    setActionLoading(true)
    try {
      const updated = await registrationsApi.updateStatus(registrationId, {
        status: "REJECTED",
        rejectionReason: rejectionReason.trim(),
      })
      setRegistration(updated)
      setRejectModalOpen(false)
      setRejectionReason("")
      toast.success("Registration rejected")
    } catch (error) {
      toast.error("Failed to reject registration")
      console.error(error)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <AppLayout requiredRole="ADMIN">
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading registration details...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!registration) {
    return (
      <AppLayout requiredRole="ADMIN">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Registration not found</AlertDescription>
        </Alert>
      </AppLayout>
    )
  }

  const isAdmin = user?.role === "ADMIN"
  const isPending = registration.status === "PENDING"

  return (
    <AppLayout requiredRole="ADMIN">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/admin/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Review Registration</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                <span className="font-mono">{registration.id.slice(0, 12)}...</span>
              </p>
            </div>
          </div>
          <StatusBadge status={registration.status} className="self-start sm:self-auto" />
        </div>

        {/* Rejection Alert */}
        {registration.rejectionReason && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Rejection Reason</AlertTitle>
            <AlertDescription>{registration.rejectionReason}</AlertDescription>
          </Alert>
        )}

        {/* Summary Card */}
        <Card className="border shadow-sm">
          <CardContent className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <DetailItem label="Submitted At" value={formatDate(registration.submittedAt)} />
              <DetailItem label="Registration Number" value={registration.registrationNumber || "Not assigned"} />
              <DetailItem
                label="Reviewed At"
                value={registration.reviewedAt ? formatDate(registration.reviewedAt) : "Not reviewed"}
              />
              <DetailItem label="Applicant" value={registration.user?.fullName} />
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Details */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Car className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Vehicle Details</CardTitle>
                <CardDescription>Information about the vehicle being registered</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <DetailItem
                label="Plate Number"
                value={<span className="font-mono font-semibold">{registration.vehicle?.plateNumber}</span>}
              />
              <DetailItem label="Make" value={registration.vehicle?.make} />
              <DetailItem label="Model" value={registration.vehicle?.model} />
              <DetailItem label="Year" value={registration.vehicle?.year} />
              <DetailItem label="Color" value={registration.vehicle?.color} />
              <DetailItem label="Vehicle Type" value={registration.vehicle?.vehicleType} />
              <DetailItem
                label="Chassis Number"
                value={<span className="font-mono text-xs">{registration.vehicle?.chassisNumber}</span>}
              />
              <DetailItem
                label="Engine Number"
                value={<span className="font-mono text-xs">{registration.vehicle?.engineNumber}</span>}
              />
            </div>
          </CardContent>
        </Card>

        {/* Owner Details */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Owner Details</CardTitle>
                <CardDescription>Information about the vehicle owner</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <DetailItem label="Full Name" value={registration.owner?.fullName} />
              <DetailItem
                label="National ID"
                value={<span className="font-mono">{registration.owner?.nationalId}</span>}
              />
              <DetailItem label="Phone Number" value={registration.owner?.phoneNumber} />
              <DetailItem label="Email" value={registration.owner?.email} />
              <DetailItem label="Address" value={registration.owner?.address} className="col-span-2" />
            </div>
          </CardContent>
        </Card>

        {/* Citizen Details */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Submitter Details</CardTitle>
                <CardDescription>The citizen who submitted this application</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <DetailItem label="Full Name" value={registration.user?.fullName} />
              <DetailItem label="Email" value={registration.user?.email} />
              <DetailItem label="Phone Number" value={registration.user?.phoneNumber} />
            </div>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        {isAdmin && isPending && (
          <Card className="border-2 border-primary/20 bg-primary/5 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Review Decision</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Review the details above and approve or reject this registration
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setRejectModalOpen(true)}
                    disabled={actionLoading}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Approve
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reject Modal */}
        <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Registration</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this registration application.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="rejectionReason" className="text-foreground font-medium">
                Rejection Reason
              </Label>
              <Textarea
                id="rejectionReason"
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter the reason for rejection..."
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim() || actionLoading}>
                {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Confirm Rejection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
