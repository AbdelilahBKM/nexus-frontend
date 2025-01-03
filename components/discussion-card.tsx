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

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

export default function DiscussionCard({ discussion }: DiscussionCardProps) {
  const [latestQuestions, setLatestQuestions] = useState<IQuestion[]>([]);
  useEffect(() => {
    if (discussion.questions.length > 0) {
      const allQuestions = [...discussion.questions].sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setLatestQuestions(allQuestions.slice(0, 3)); // Always ensure only the top 3 are set
    }
  }, [discussion.questions]);

  useEffect(() => {
    console.log("Latest questions?",latestQuestions);
  }, [latestQuestions]);
  return latestQuestions.length == 0  ? (<p>Nothing New</p>): (
    latestQuestions.map((latestQuestion) => (
      <Card  key={latestQuestion.id} className="space-y-4">
      <CardHeader>
        <Link href={`/discussion/${discussion.d_Name}`} className="text-sm text-muted-foreground hover:underline">
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
            <AvatarImage src={`https://avatar.vercel.sh/${latestQuestion.postedBy ? latestQuestion.postedBy.userName : "username"}`} />
            <AvatarFallback>{latestQuestion.postedBy.userName}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            Posted by
            <Link
              href={`/user/${latestQuestion.postedBy.userName}`}
              className="cursor-pointer hover:underline"> u/{latestQuestion.postedBy.userName}</Link>
            {" On the " + formatDate(latestQuestion.created_at.toString())}
          </span>
        </div>
      </CardFooter>
    </Card>
    ))
  )
}

