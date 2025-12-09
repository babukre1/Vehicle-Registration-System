"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Car, User, Loader2, ArrowLeft } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { registrationsApi } from "@/lib/api"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { CreateRegistrationRequest } from "@/types"

const vehicleTypes = ["Sedan", "SUV", "Truck", "Van", "Motorcycle", "Bus", "Other"]

export default function SubmitRegistrationPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  // Vehicle fields
  const [plateNumber, setPlateNumber] = useState("")
  const [vehicleType, setVehicleType] = useState("")
  const [make, setMake] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [color, setColor] = useState("")
  const [chassisNumber, setChassisNumber] = useState("")
  const [engineNumber, setEngineNumber] = useState("")

  // Owner fields
  const [ownerFullName, setOwnerFullName] = useState("")
  const [nationalId, setNationalId] = useState("")
  const [ownerPhoneNumber, setOwnerPhoneNumber] = useState("")
  const [ownerEmail, setOwnerEmail] = useState("")
  const [address, setAddress] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("User not authenticated")
      return
    }

    // Validation
    if (!plateNumber || !vehicleType || !make || !model || !year || !color || !chassisNumber || !engineNumber) {
      toast.error("Please fill in all vehicle information fields")
      return
    }

    if (!ownerFullName || !nationalId || !ownerPhoneNumber || !address) {
      toast.error("Please fill in all required owner information fields")
      return
    }

    const yearNum = Number.parseInt(year)
    if (isNaN(yearNum) || yearNum < 1900) {
      toast.error("Please enter a valid year (1900 or later)")
      return
    }

    setLoading(true)
    try {
      const payload: CreateRegistrationRequest = {
        userId: user.id,
        vehicle: {
          plateNumber,
          make,
          model,
          year: yearNum,
          color,
          chassisNumber,
          engineNumber,
          vehicleType,
        },
        owner: {
          fullName: ownerFullName,
          nationalId,
          phoneNumber: ownerPhoneNumber,
          email: ownerEmail || undefined,
          address,
        },
      }

      await registrationsApi.create(payload)
      toast.success("Registration submitted successfully!")
      router.push("/dashboard")
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || "Failed to submit registration. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout requiredRole="CITIZEN">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="mb-4 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-foreground">New Vehicle Registration</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete the form below to submit a new vehicle registration application
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Information */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Car className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Vehicle Information</CardTitle>
                  <CardDescription>Enter the details of the vehicle to be registered</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="plateNumber">
                    Plate Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="plateNumber"
                    placeholder="e.g., SOM-40011"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleType">
                    Vehicle Type <span className="text-destructive">*</span>
                  </Label>
                  <Select value={vehicleType} onValueChange={setVehicleType}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="make">
                    Make <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="make"
                    placeholder="e.g., Toyota"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">
                    Model <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="model"
                    placeholder="e.g., Corolla"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">
                    Year <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="e.g., 2019"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    min={1900}
                    max={new Date().getFullYear() + 1}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">
                    Color <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="color"
                    placeholder="e.g., Blue"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chassisNumber">
                    Chassis Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="chassisNumber"
                    placeholder="e.g., TYT-CHS-40011"
                    value={chassisNumber}
                    onChange={(e) => setChassisNumber(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="engineNumber">
                    Engine Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="engineNumber"
                    placeholder="e.g., TYT-ENG-40011"
                    value={engineNumber}
                    onChange={(e) => setEngineNumber(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Owner Information */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Owner Information</CardTitle>
                  <CardDescription>Enter the vehicle owner details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ownerFullName">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="ownerFullName"
                    placeholder="e.g., Ahmed Hussein Ali"
                    value={ownerFullName}
                    onChange={(e) => setOwnerFullName(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationalId">
                    National ID <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nationalId"
                    placeholder="e.g., SO-NID-100250"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerPhoneNumber">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="ownerPhoneNumber"
                    placeholder="e.g., +252619556677"
                    value={ownerPhoneNumber}
                    onChange={(e) => setOwnerPhoneNumber(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerEmail">
                    Email <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    placeholder="e.g., owner@example.com"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">
                    Address <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    rows={3}
                    placeholder="e.g., Hodan District, Mogadishu"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[140px]">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Registration"
              )}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
