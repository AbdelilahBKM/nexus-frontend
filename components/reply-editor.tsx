"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ReplyEditorProps {
  discussionId: number
}

export default function ReplyEditor({ discussionId }: ReplyEditorProps) {
  const [reply, setReply] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send the reply to the server
    console.log(`Submitting reply for discussion ${discussionId}:`, reply)
    setReply("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">Your Answer</h2>
      <Textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Write your answer here..."
        className="min-h-[200px]"
      />
      <Button type="submit">Post Your Answer</Button>
    </form>
  )
}

