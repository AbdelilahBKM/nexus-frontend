"use client"
import { notFound, useParams } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ThumbsUp, MessageSquare, CheckCircle2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ReplyList from "@/components/reply-list"
import ReplyEditor from "@/components/reply-editor"
import NotFound from "@/components/not-found"
import { useEffect, useState } from "react"
import { IQuestion } from "@/types/Post"
import { api_url } from "@/utils/globalVariables"
import LoadingScreen from "@/components/loading-screen"
import { formatDate } from "@/components/discussion-card"



export default function QuestionPage() {
  const params = useParams();
  const questionId = params.id;
  const [question, setQuestion] = useState<IQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api_url}/Post/${questionId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch question");
        }
        const data = await response.json();
        setQuestion(data);
      } catch (error) {
        console.error("Error fetching question:", error);
        setQuestion(null);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!loading && !question) {
    return <NotFound />
  }

  return (
    <div className="space-y-6">
      <Link 
        href={`/discussion/${question?.discussion?.d_Name}`}
        className="text-sm text-muted-foreground hover:underline"
      >
        ← Back to {question?.discussion?.d_Name}
      </Link>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{question?.title}</CardTitle>
            {question?.isAnswered && (
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
          <p className="mb-4">{question?.content}</p>
          {/* <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div> */}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <ThumbsUp className="mr-1 h-4 w-4" />
              {question?.reputation}
            </Button>
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span>{question?.answers.length}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={`https://avatar.vercel.sh/${question?.postedBy.userName}`} />
              <AvatarFallback>{question?.postedBy.userName}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              Posted by u/{question?.postedBy.userName} {question && formatDate(question.postedAt.toString())}
            </span>
          </div>
        </CardFooter>
      </Card>
      {question && <ReplyList 
      discussionId={question.id} 
      bestAnswerId={question.answers.filter(answer => answer.isBestAnswer)[0].id} />
      }
      {question && <ReplyEditor discussionId={question.id} />}
    </div>
  )
}

