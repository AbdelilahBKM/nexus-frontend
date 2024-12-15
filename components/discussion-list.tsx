"use client"

import { useState } from "react"
import DiscussionCard from "@/components/discussion-card"
import { Button } from "@/components/ui/button"
import { Avatar } from "@radix-ui/react-avatar"
import Link from "next/link"

// Mock data for discussions
const mockDiscussions = [
  {
    id: 1,
    name: "Python Programming",
    avatar: "🐍",
    questions: [
      {
        id: 101,
        title: "Best practices for implementing a binary search tree in Python",
        description: "I'm working on a project that requires efficient data retrieval. Can someone explain the best way to implement a binary search tree in Python?",
        tags: ["data-structures", "python", "algorithms"],
        replies: 5,
        upvotes: 12,
        author: "codeWizard42",
        timestamp: "2h ago",
        isAnswered: false,
      },
      {
        id: 102,
        title: "Understanding Python decorators",
        description: "I'm having trouble grasping the concept of decorators in Python. Can someone provide a clear explanation with examples?",
        tags: ["python", "decorators", "advanced"],
        replies: 3,
        upvotes: 8,
        author: "pythonLearner",
        timestamp: "4h ago",
        isAnswered: false,
      },
    ],
  },
  {
    id: 2,
    name: "Web Development",
    avatar: "🌐",
    questions: [
      {
        id: 201,
        title: "Best practices for React hooks",
        description: "I'm new to React hooks and want to understand the best practices for using them in my projects. Any advice?",
        tags: ["react", "hooks", "javascript"],
        replies: 7,
        upvotes: 15,
        author: "reactEnthusiast",
        timestamp: "1h ago",
        isAnswered: true,
      },
    ],
  },
  {
    id: 3,
    name: "Cybersecurity",
    avatar: "🔒",
    questions: [
      {
        id: 301,
        title: "Understanding SQL injection attacks",
        description: "Can someone explain how SQL injection attacks work and how to prevent them in web applications?",
        tags: ["security", "sql-injection", "web-security"],
        replies: 4,
        upvotes: 10,
        author: "securityNovice",
        timestamp: "3h ago",
        isAnswered: true,
      },
    ],
  },
]

export default function DiscussionList() {
  const [discussions] = useState(mockDiscussions)

  return (
    <div className="space-y-8">
      {discussions.map((discussion) => (
        <div key={discussion.id} className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Avatar className="text-3xl">{discussion.avatar}</Avatar>
            Latest Questions in  
            <Link href={`/discussion/${discussion.id}`}>
              <span className="hover:underline cursor-pointer">{discussion.name}</span>
            </Link>
          </h2>
          {discussion.questions.map((question) => (
            <DiscussionCard 
              key={question.id} 
              question={question} 
              discussionId={discussion.id}
              discussionName={discussion.name}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

