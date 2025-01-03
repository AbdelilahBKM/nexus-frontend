import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThumbsUp } from 'lucide-react'
import { IQuestion } from "@/types/Post"
import { formatDate } from "./discussion-card"

interface DiscussionPostProps {
  question: IQuestion;
}

export default function DiscussionPost({ question }: DiscussionPostProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{question.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{question.content}</p>
        {/* <div className="flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div> */}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={`https://avatar.vercel.sh/${question.postedBy.userName}`} />
            <AvatarFallback>{question.postedBy.userName[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            Posted by u/{question.postedBy.userName} {formatDate(question.postedAt.toString())}
          </span>
        </div>
        <Button variant="outline" size="sm">
          <ThumbsUp className="mr-2 h-4 w-4" />
          Upvote ({question.reputation})
        </Button>
      </CardFooter>
    </Card>
  )
}

