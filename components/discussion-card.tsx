import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react'

interface DiscussionCardProps {
  discussion: {
    id: number
    title: string
    description: string
    tags: string[]
    replies: number
    reputation: number
    author: string
    timestamp: string
  }
}

export default function DiscussionCard({ discussion }: DiscussionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={`/discussion/${discussion.id}`} className="hover:underline">
            {discussion.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{discussion.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {discussion.tags.map((tag) => (
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
            <span>{discussion.replies}</span>
          </div>
          <div className="flex  items-center gap-4">
            <div className="flex items-center space-x-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{discussion.reputation}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsDown className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={`https://avatar.vercel.sh/${discussion.author}`} />
            <AvatarFallback>{discussion.author[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            Posted by u/{discussion.author} {discussion.timestamp}
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}

