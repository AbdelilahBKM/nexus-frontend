"use client"

import { useState } from "react"
import ReplyCard from "@/components/reply-card"

// Mock data for replies
const mockReplies = [
  {
    id: 1,
    content: "Microservices architecture offers better scalability and flexibility compared to monolithic applications. Each service can be developed, deployed, and scaled independently. However, it introduces complexity in terms of service communication and data consistency.",
    author: "archGuru",
    timestamp: "12h ago",
    upvotes: 15,
    comments: [
      {
        id: 101,
        content: "Great explanation! Could you elaborate on how to handle data consistency across services?",
        author: "curious_dev",
        timestamp: "10h ago",
      },
    ],
  },
  {
    id: 2,
    content: "One key benefit of microservices is the ability to use different technologies for different services. This allows teams to choose the best tool for each specific task. However, be cautious of over-engineering and creating too many small services, as it can lead to increased operational complexity.",
    author: "techSage",
    timestamp: "8h ago",
    upvotes: 10,
    comments: [],
  },
]

interface ReplyListProps {
  discussionId: number
}

export default function ReplyList({ discussionId }: ReplyListProps) {
  const [replies, setReplies] = useState(mockReplies)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Replies</h2>
      {replies.map((reply) => (
        <ReplyCard key={reply.id} reply={reply} />
      ))}
    </div>
  )
}

