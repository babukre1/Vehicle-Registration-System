"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Plus, Eye, RefreshCw, Loader2, FileX, Car } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { RegistrationDetailModal } from "@/components/registration-detail-modal"
import { StatusBadge } from "@/components/status-badge"
import { registrationsApi } from "@/lib/api"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import type { VehicleRegistration } from "@/types"

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function DashboardPage() {
  const [registrations, setRegistrations] = useState<VehicleRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRegistration, setSelectedRegistration] = useState<VehicleRegistration | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const fetchRegistrations = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const data = await registrationsApi.list({ userId: user.id })
      const userRegistrations = data.filter((r) => r.userId === user.id || r.user?.id === user.id)
      setRegistrations(userRegistrations)
    } catch (error) {
      toast.error("Failed to load registrations")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchRegistrations()
  }, [fetchRegistrations])

  const handleViewDetails = async (record: VehicleRegistration) => {
    try {
      const fullDetails = await registrationsApi.getById(record.id)
      setSelectedRegistration(fullDetails)
      setModalOpen(true)
    } catch (error) {
      toast.error("Failed to load registration details")
      console.error(error)
    }
  }

  return (
    <AppLayout requiredRole="CITIZEN">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Registrations</h1>
            <p className="text-sm text-muted-foreground mt-1">View and manage your vehicle registration submissions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchRegistrations} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={() => router.push("/submit-registration")}>
              <Plus className="mr-2 h-4 w-4" />
              New Registration
            </Button>
          </div>
        </div>

        {/* Content */}
        <Card className="border shadow-sm">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading your registrations...</p>
                </div>
              </div>
            ) : registrations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                  <FileX className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No registrations yet</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-sm">
                  Get started by submitting your first vehicle registration application
                </p>
                <Button onClick={() => router.push("/submit-registration")}>
                  <Car className="mr-2 h-4 w-4" />
                  Register Your Vehicle
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold">Plate Number</TableHead>
                    <TableHead className="font-semibold hidden md:table-cell">Vehicle</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold hidden sm:table-cell">Submitted</TableHead>
                    <TableHead className="font-semibold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((registration) => (
                    <TableRow key={registration.id} className="group">
                      <TableCell>
                        <div className="font-medium text-foreground">{registration.vehicle?.plateNumber}</div>
                        <div className="text-xs text-muted-foreground md:hidden">
                          {registration.vehicle?.make} {registration.vehicle?.model}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-foreground">
                          {registration.vehicle?.make} {registration.vehicle?.model}
                        </div>
                        <div className="text-xs text-muted-foreground">{registration.vehicle?.year}</div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={registration.status} />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {formatDate(registration.submittedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(registration)}
                          className="opacity-70 group-hover:opacity-100"
                        >
                          <Eye className="h-4 w-4 mr-1.5" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <RegistrationDetailModal
          registration={selectedRegistration}
          open={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setSelectedRegistration(null)
          }}
        />
      </div>
    </AppLayout>
  )
}
