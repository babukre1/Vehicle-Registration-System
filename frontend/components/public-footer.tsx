import Link from "next/link"
import { MapPin, Phone, Mail } from "lucide-react"

export function PublicFooter() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Vehicle Registration System</h3>
            <p className="text-sm opacity-90">Simplifying vehicle registration for citizens nationwide.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="opacity-90 hover:opacity-100 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="opacity-90 hover:opacity-100 transition">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/faq" className="opacity-90 hover:opacity-100 transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#contact" className="opacity-90 hover:opacity-100 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="opacity-90 hover:opacity-100 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#terms" className="opacity-90 hover:opacity-100 transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>1-800-VRS-HELP</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@vrs.gov</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>National HQ</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-sm opacity-90">
          <p>&copy; 2025 Vehicle Registration System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}