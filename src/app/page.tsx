import { FormBuilder } from "@/components/form-builder"
import { Cable } from "lucide-react"
import Link from "next/link"


export default function Home() {
  return (
    <div className="h-full flex flex-col">
      <header className="text-zinc-950 sticky top-0 w-full z-50 h-14 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 flex items-center px-4 border-b border-neutral-100">
        <Link className="flex items-center gap-2" href="/">
          <Cable size={20} />
          <span className="font-bold tracking-tight">Form Builder</span>
        </Link>
      </header>
      <FormBuilder />
    </div>
  )
}
