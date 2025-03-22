import Image from 'next/image'
import { Loader2 } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 top-0 flex flex-col items-center justify-center bg-background">
      <div className="relative w-32 h-32 mb-8 animate-pulse">
        <Image
          src="/Logo/Nexus_Logo.png"
          alt="Nexus Logo"
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-xl font-semibold text-primary">Loading...</span>
      </div>
      <p className="mt-4 text-muted-foreground">Please wait while we prepare your experience</p>
    </div>
  )
}

