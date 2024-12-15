import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp } from 'lucide-react'

interface DiscussionCardProps {
  question: {
    id: number
    title: string
    avatar: string
    description: string
    tags: string[]
    replies: number
    upvotes: number
    author: string
    timestamp: string
  }
  discussionId: number
  discussionName: string
}

export default function DiscussionCard({ question, discussionId, discussionName }: DiscussionCardProps) {
  return (
    <Card>
      <CardHeader>
        <Link href={`/discussion/${discussionId}`} className="text-sm text-muted-foreground hover:underline">
          {discussionName}
        </Link>
        <CardTitle>
          <Link href={`/question/${question.id}`} className="hover:underline">
            {question.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{question.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <MessageSquare className="w-4 h-4" />
            <span>{question.replies}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{question.upvotes}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={`https://avatar.vercel.sh/${question.author}`} />
            <AvatarFallback>{question.author[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            Posted by 
            <Link href={`user/${question.author}`} className="hover:underline cursor-pointer">u/{question.author}</Link> 
            {question.timestamp}
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}

