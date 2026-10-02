"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import Image from "next/image";

export function PublicNav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/track", label: "Track Status" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 justify-between items-center py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/somalia-coat-of-arms.png" alt="Federal Republic of Somalia coat of arms" width={48} height={40} className="h-12 w-14 object-contain" priority />
            <span className="hidden border-l border-slate-200 pl-3 sm:block">
              <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Federal Republic of Somalia</span>
              <span className="block text-base font-semibold text-slate-900">Vehicle Registration Service</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-primary border-b-2 border-primary pb-2"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-primary hover:bg-secondary"
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white hidden sm:inline">
                Register Vehicle
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
