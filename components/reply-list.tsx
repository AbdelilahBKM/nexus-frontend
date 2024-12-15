"use client"

import { useState } from "react"
import ReplyCard from "@/components/reply-card"

// Mock data for replies
const mockReplies = [
  {
    id: 1001,
    content: "To implement a binary search tree in Python efficiently, you should consider the following best practices:\n\n1. Use a class to represent the tree nodes.\n2. Implement methods for insertion, deletion, and searching.\n3. Ensure that the tree remains balanced by using self-balancing techniques like AVL or Red-Black trees.\n4. Use recursion for traversal operations.\n\nHere's a basic implementation of a BST node:",
    author: "pythonMaster",
    timestamp: "1h ago",
    upvotes: 15,
    comments: [],
  },
  {
    id: 1002,
    content: "Another important aspect to consider is the time complexity of operations. In a balanced BST, insert, delete, and search operations have an average and worst-case time complexity of O(log n), where n is the number of nodes in the tree.",
    author: "algoExpert",
    timestamp: "30m ago",
    upvotes: 8,
    comments: [],
  },
]

interface ReplyListProps {
  discussionId: number
  bestAnswerId: number | null
}

export default function ReplyList({ discussionId, bestAnswerId }: ReplyListProps) {
  const [replies] = useState(mockReplies)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Replies</h2>
      {replies.map((reply) => (
        <ReplyCard 
          key={reply.id} 
          reply={reply} 
          isBestAnswer={reply.id === bestAnswerId}
          onMarkAsBestAnswer={() => console.log(`Marked reply ${reply.id} as best answer`)}
        />
      ))}
    </div>
  )
}

