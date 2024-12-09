"use client"

import { useState } from "react"
import DiscussionCard from "@/components/discussion-card"
import { Button } from "@/components/ui/button"

// Mock data for discussions
const mockDiscussions = [
  {
    id: 1,
    title: "Best practices for implementing a binary search tree",
    description: "I'm working on a project that requires efficient data retrieval. Can someone explain the best way to implement a binary search tree in Python?",
    tags: ["data-structures", "python", "algorithms"],
    replies: 5,
    reputation: 12,
    author: "codeWizard42",
    timestamp: "2h ago",
  },
  {
    id: 2,
    title: "Securing AWS Lambda functions",
    description: "What are some recommended strategies for securing AWS Lambda functions in a production environment?",
    tags: ["aws", "security", "serverless"],
    replies: 3,
    reputation: 8,
    author: "cloudNinja",
    timestamp: "4h ago",
  },
  // Add more mock discussions here
]

export default function DiscussionList() {
  const [discussions, setDiscussions] = useState(mockDiscussions)

  const loadMore = () => {
    // In a real application, this would fetch more discussions from an API
    console.log("Loading more discussions...")
  }

  return (
    <div className="space-y-4">
      {discussions.map((discussion) => (
        <DiscussionCard key={discussion.id} discussion={discussion} />
      ))}
      <div className="text-center">
        <Button onClick={loadMore}>Load More</Button>
      </div>
    </div>
  )
}

