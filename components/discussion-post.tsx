import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThumbsUp } from 'lucide-react'
import { IQuestion } from "@/types/Post"

interface DiscussionPostProps {
  question: IQuestion;
}

export default function DiscussionPost({ question }: DiscussionPostProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{discussion.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{discussion.content}</p>
        <div className="flex flex-wrap gap-2">
          {discussion.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={`https://avatar.vercel.sh/${discussion.author}`} />
            <AvatarFallback>{discussion.author[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            Posted by u/{discussion.author} {discussion.timestamp}
          </span>
        </div>
        <Button variant="outline" size="sm">
          <ThumbsUp className="mr-2 h-4 w-4" />
          Upvote ({discussion.upvotes})
        </Button>
      </CardFooter>
    </Card>
  )
}

