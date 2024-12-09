import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          Nexus
        </Link>
        <div className="flex items-center space-x-4">
          <Input className="w-64" placeholder="Search discussions..." />
          <Button variant="outline">New Discussion</Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

