import { notFound } from "next/navigation"
import DiscussionCard from "@/components/discussion-card"
import { Button } from "@/components/ui/button"
import DiscussionPost from "@/components/discussion-post"
import ReplyList from "@/components/reply-list"
import ReplyEditor from "@/components/reply-editor"

interface question {
  id: number
  title: string
  description: string
  tags: string[]
  replies: number
  upvotes: number
  author: string
  timestamp: string
}

// Mock data for discussions (in a real app, this would come from a database)
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
      },
    ],
  },
  // ... other discussions
  {
    id: parseInt("1"),
    title: "Understanding Microservices Architecture",
    content: "I'm trying to grasp the concept of microservices architecture. Can someone explain the key benefits and potential drawbacks compared to monolithic applications?",
    tags: ["microservices", "architecture", "system-design"],
    author: "techExplorer",
    timestamp: "1d ago",
    upvotes: 25,
    replies: [],
  }
]

export default function DiscussionPage({ params }: { params: { id: string } }) {
  const discussion = mockDiscussions.find(d => d.id === parseInt(params.id))

  if (!discussion) {
    notFound()
  }

  if (discussion.questions) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span className="text-4xl">{discussion.avatar || "💬"}</span>
            {discussion.name || discussion.title}
          </h1>
          <Button>Join Discussion</Button>
        </div>
        <div className="space-y-4">
          {discussion.questions.map((question) => (
            <DiscussionCard
              key={question.id}
              question={question}
              discussionId={discussion.id}
              discussionName={discussion.name}
            />
          ))}
        </div>
      </div>
    )
  } else {
    return (
      <div className="space-y-8">
        <DiscussionPost discussion={discussion} />
        <ReplyList discussionId={discussion.id} />
        <ReplyEditor discussionId={discussion.id} />
      </div>
    )
  }
}

