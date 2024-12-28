import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp, CheckCircle2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import IDiscussion from "@/types/Discussion"
import { useEffect, useState } from "react"
import { IQuestion } from "@/types/Post"

interface DiscussionCardProps {
  discussion: IDiscussion
}

export default function DiscussionCard({ discussion }: DiscussionCardProps) {
  const [latestQuestion, setLatestQuestion] = useState<IQuestion | null>(null);
  useEffect(() => {
    const latestQuestions = discussion.questions.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    setLatestQuestion(latestQuestions[0]);
  }, [discussion]);
  return !latestQuestion ? (<p>Nothing New</p>): (
    <Card>
      <CardHeader>
        <Link href={`/discussion/${discussion.id}`} className="text-sm text-muted-foreground hover:underline">
          {discussion.d_Name}
        </Link>
        <div className="flex items-center justify-between">
          <CardTitle>
            <Link href={`/question/${latestQuestion.id}`} className="hover:underline">
              {latestQuestion.title}
            </Link>
          </CardTitle>
          {latestQuestion.isAnswered && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>This question has been answered</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
      {/* <CardContent>
        <p className="text-muted-foreground">{question.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent> */}
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <MessageSquare className="w-4 h-4" />
            <span>{latestQuestion.answers.length}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{latestQuestion.reputation}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={`https://avatar.vercel.sh/${latestQuestion.postedBy.userName}`} />
            <AvatarFallback>{latestQuestion.postedBy.userName}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            Posted by
            <Link
              href={`/user/${latestQuestion.postedBy.userName}`}
              className="cursor-pointer hover:underline"> u/{latestQuestion.postedBy.userName}</Link>
            {" " + latestQuestion.created_at}
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}

