import { notFound } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ThumbsUp, MessageSquare, CheckCircle2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ReplyList from "@/components/reply-list"
import ReplyEditor from "@/components/reply-editor"

// Mock data for questions (in a real app, this would come from a database)
const mockQuestions = [
  {
    id: 101,
    title: "Best practices for implementing a binary search tree in Python",
    content: "I'm working on a project that requires efficient data retrieval. Can someone explain the best way to implement a binary search tree in Python? I'm particularly interested in understanding the trade-offs between different implementation approaches and how to ensure the tree remains balanced for optimal performance.",
    tags: ["data-structures", "python", "algorithms"],
    replies: 5,
    upvotes: 12,
    author: "codeWizard42",
    timestamp: "2h ago",
    discussionId: 1,
    discussionName: "Python Programming",
    isAnswered: true,
    bestAnswerId: 1001
  },
  {
    id: 102,
    title: "Understanding Python decorators",
    content: "I'm having trouble grasping the concept of decorators in Python. Can someone provide a clear explanation with examples? I've seen them used in various codebases, but I'm not sure when and how to implement them effectively in my own projects.",
    tags: ["python", "decorators", "advanced"],
    replies: 3,
    upvotes: 8,
    author: "pythonLearner",
    timestamp: "4h ago",
    discussionId: 1,
    discussionName: "Python Programming",
    isAnswered: false,
    bestAnswerId: null
  },
]

export default function QuestionPage({ params }: { params: { id: string } }) {
  const question = mockQuestions.find(q => q.id === parseInt(params.id))

  if (!question) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <Link 
        href={`/discussion/${question.discussionId}`}
        className="text-sm text-muted-foreground hover:underline"
      >
        ← Back to {question.discussionName}
      </Link>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{question.title}</CardTitle>
            {question.isAnswered && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This question has been answered</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{question.content}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <ThumbsUp className="mr-1 h-4 w-4" />
              {question.upvotes}
            </Button>
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span>{question.replies}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={`https://avatar.vercel.sh/${question.author}`} />
              <AvatarFallback>{question.author[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              Posted by u/{question.author} {question.timestamp}
            </span>
          </div>
        </CardFooter>
      </Card>
      <ReplyList discussionId={question.id} bestAnswerId={question.bestAnswerId} />
      <ReplyEditor discussionId={question.id} />
    </div>
  )
}

