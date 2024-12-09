"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface CommentEditorProps {
  replyId: number
  onSubmit: () => void
}

export default function CommentEditor({ replyId, onSubmit }: CommentEditorProps) {
  const [comment, setComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send the comment to the server
    console.log(`Submitting comment for reply ${replyId}:`, comment)
    setComment("")
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        className="w-full"
      />
      <Button type="submit" size="sm">
        Submit Comment
      </Button>
    </form>
  )
}

