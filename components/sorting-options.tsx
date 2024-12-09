"use client"

import { Button } from "@/components/ui/button"
import { Flame, Clock, HelpCircle } from 'lucide-react'

export default function SortingOptions() {
  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="sm">
        <Flame className="mr-2 h-4 w-4" />
        Trending
      </Button>
      <Button variant="outline" size="sm">
        <Clock className="mr-2 h-4 w-4" />
        Newest
      </Button>
      <Button variant="outline" size="sm">
        <HelpCircle className="mr-2 h-4 w-4" />
        Unanswered
      </Button>
    </div>
  )
}

