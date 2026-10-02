"use client"
import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { registrationsApi } from "@/lib/api"
import type { RegistrationAttachment } from "@/types"
import { toast } from "sonner"

export function AttachmentList({ attachments = [] }: { attachments?: RegistrationAttachment[] }) {
  if (!attachments.length) return <p className="text-sm text-muted-foreground">No supporting documents were submitted.</p>
  const openFile = async (id: string) => {
    try { const { url } = await registrationsApi.getAttachmentUrl(id); window.open(url, "_blank", "noopener,noreferrer") }
    catch { toast.error("Unable to open this document") }
  }
  return <div className="divide-y border border-slate-200">{attachments.map(file => <div key={file.id} className="flex items-center justify-between gap-4 p-4"><div className="flex min-w-0 items-center gap-3"><FileText className="h-5 w-5 shrink-0 text-primary" /><div className="min-w-0"><p className="truncate text-sm font-medium">{file.fileName}</p><p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p></div></div><Button variant="ghost" size="sm" onClick={() => openFile(file.id)}><Download className="mr-2 h-4 w-4" />Open</Button></div>)}</div>
}
