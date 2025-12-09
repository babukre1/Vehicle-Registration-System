"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { LayoutDashboard, FileText, LogOut, User, Menu, ChevronLeft, Car, Shield } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { ProtectedRoute } from "./protected-route"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/types"

interface AppLayoutProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

export function AppLayout({ children, requiredRole }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const citizenNavItems: NavItem[] = [
    { href: "/dashboard", label: "My Registrations", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/submit-registration", label: "New Registration", icon: <FileText className="h-5 w-5" /> },
  ]

  const adminNavItems: NavItem[] = [
    { href: "/admin/dashboard", label: "All Registrations", icon: <LayoutDashboard className="h-5 w-5" /> },
  ]

  const navItems = user?.role === "ADMIN" ? adminNavItems : citizenNavItems

  const NavLinks = ({ onItemClick }: { onItemClick?: () => void }) => (
    <nav className="flex flex-col gap-1 px-3 py-4">
      <span className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {user?.role === "ADMIN" ? "Administration" : "Navigation"}
      </span>
      {navItems.map((item) => (
        <button
          key={item.href}
          onClick={() => {
            router.push(item.href)
            onItemClick?.()
          }}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
            pathname === item.href
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {item.icon}
          {!collapsed && <span>{item.label}</span>}
        </button>
      ))}
    </nav>
  )

  return (
    <ProtectedRoute requiredRole={requiredRole}>
      <div className="flex min-h-screen bg-muted/30">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden border-r border-border bg-card transition-all duration-300 md:flex md:flex-col",
            collapsed ? "w-[72px]" : "w-[260px]",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Car className="h-5 w-5" />
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">VRS</span>
                  <span className="text-xs text-muted-foreground">Portal</span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            </Button>
          </div>
          <div className="flex-1">
            <NavLinks />
          </div>
          {/* User info at bottom of sidebar */}
          {!collapsed && (
            <div className="border-t border-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1 truncate">
                  <p className="truncate text-sm font-medium text-foreground">{user?.fullName}</p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 px-4 md:px-6">
            <div className="flex items-center gap-4">
              {/* Mobile Menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] p-0">
                  <div className="flex h-16 items-center gap-3 border-b border-border px-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Car className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">VRS</span>
                      <span className="text-xs text-muted-foreground">Portal</span>
                    </div>
                  </div>
                  <NavLinks onItemClick={() => setMobileOpen(false)} />
                </SheetContent>
              </Sheet>
              <div>
                <h1 className="text-base font-semibold text-foreground">Vehicle Registration System</h1>
                <p className="hidden text-xs text-muted-foreground sm:block">
                  {user?.role === "ADMIN" ? "Administrator Portal" : "Citizen Portal"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={cn(
                  "hidden sm:inline-flex gap-1.5",
                  user?.role === "ADMIN"
                    ? "border-primary/30 bg-primary/5 text-primary"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700",
                )}
              >
                <Shield className="h-3 w-3" />
                {user?.role}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="hidden sm:inline font-medium">{user?.fullName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-foreground">{user?.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
