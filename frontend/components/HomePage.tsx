"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Check, FileText } from "lucide-react"
import { PublicNav } from "./public-nav"
import { PublicFooter } from "./public-footer"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"

export default function PublicHome() {
  const router = useRouter()
  const { user } = useAuth()
  useEffect(() => { if (user) router.push(user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard") }, [user, router])
  return <><PublicNav /><main>
    <section className="border-b border-slate-200 bg-white"><div className="mx-auto grid max-w-7xl gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[1.25fr_.75fr] lg:py-28">
      <div><p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Official digital service</p><h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-slate-950 sm:text-6xl">Register a vehicle with the Federal Republic of Somalia.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">Submit vehicle and ownership information, attach supporting records, and follow the government review process online.</p><div className="mt-10 flex flex-wrap gap-3"><Button asChild size="lg" className="h-12 px-6"><Link href="/register">Begin an application <ArrowRight className="ml-2 h-4 w-4" /></Link></Button><Button asChild size="lg" variant="outline" className="h-12 px-6"><Link href="/login">Sign in</Link></Button></div></div>
      <aside className="border-l-4 border-primary bg-slate-50 p-8 lg:self-end"><FileText className="h-7 w-7 text-primary" /><h2 className="mt-6 text-xl font-semibold text-slate-950">Before you start</h2><ul className="mt-5 space-y-4 text-sm leading-6 text-slate-600">{["Vehicle plate, chassis and engine details", "Owner identity and contact information", "Ownership documents or clear photographs"].map(item => <li key={item} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul></aside>
    </div></section>
    <section className="bg-slate-50 py-20 lg:py-28"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Application process</p><h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">A clear process from submission to decision</h2></div><ol className="mt-14 grid border-y border-slate-200 bg-white md:grid-cols-3">{[["01", "Submit your application", "Enter vehicle and owner details and upload supporting documents."], ["02", "Government review", "An authorised officer checks the information and supporting records."], ["03", "Receive a decision", "Return to your account to see the decision or any required correction."]].map(([n,t,d]) => <li key={n} className="border-b border-slate-200 p-8 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 lg:p-10"><span className="font-mono text-sm text-primary">{n}</span><h3 className="mt-8 text-lg font-semibold text-slate-950">{t}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{d}</p></li>)}</ol></div></section>
  </main><PublicFooter /></>
}
