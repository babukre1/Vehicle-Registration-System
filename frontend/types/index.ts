// User and Auth types
export type UserRole = "CITIZEN" | "ADMIN"

export interface User {
  id: string
  email: string
  fullName: string
  phoneNumber?: string
  role: UserRole
}

export interface AuthResponse {
  user: User
  accessToken: string
}

// Vehicle types
export type VehicleType = "Sedan" | "SUV" | "Truck" | "Van" | "Motorcycle" | "Bus" | "Other"

export interface Vehicle {
  id: string
  plateNumber: string
  make: string
  model: string
  year: number
  color: string
  chassisNumber: string
  engineNumber: string
  vehicleType: string
}

// Owner types
export interface Owner {
  id: string
  fullName: string
  nationalId: string
  phoneNumber: string
  email?: string
  address: string
}

// Registration types
export type RegistrationStatus = "PENDING" | "APPROVED" | "REJECTED"

export interface VehicleRegistration {
  id: string
  registrationNumber?: string
  status: RegistrationStatus
  submittedAt: string
  reviewedAt?: string
  rejectionReason?: string
  userId: string
  vehicleId: string
  ownerId: string
  user?: User
  vehicle?: Vehicle
  owner?: Owner
}

// API Request types
export interface RegisterRequest {
  email: string
  password: string
  fullName: string
  phoneNumber?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface CreateRegistrationRequest {
  userId: string
  vehicle: Omit<Vehicle, "id">
  owner: Omit<Owner, "id">
}

export interface UpdateStatusRequest {
  status: "APPROVED" | "REJECTED"
  rejectionReason?: string
}
