import type React from "react"
import { Badge } from "@/components/ui/badge"
import type { RegistrationStatus } from "@/types"
import { cn } from "@/lib/utils"
import { Clock, CheckCircle2, XCircle } from "lucide-react"

interface StatusBadgeProps {
  status: RegistrationStatus
  className?: string
  showIcon?: boolean
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const variants: Record<RegistrationStatus, { className: string; label: string; icon: React.ReactNode }> = {
    PENDING: {
      className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
      label: "Pending",
      icon: <Clock className="h-3 w-3" />,
    },
    APPROVED: {
      className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
      label: "Approved",
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    REJECTED: {
      className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
      label: "Rejected",
      icon: <XCircle className="h-3 w-3" />,
    },
  }

  const variant = variants[status]

  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", variant.className, className)}>
      {showIcon && variant.icon}
      {variant.label}
    </Badge>
  )
}
