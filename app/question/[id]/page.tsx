"use client"
import { notFound, useParams } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ThumbsUp, MessageSquare, CheckCircle2, FilePenLine, CircleX, ThumbsDown } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ReplyList from "@/components/reply-list"
import ReplyEditor from "@/components/reply-editor"
import NotFound from "@/components/not-found"
import { useEffect, useState } from "react"
import { IAnswer, IQuestion } from "@/types/Post"
import { api_url } from "@/utils/globalVariables"
import LoadingScreen from "@/components/loading-screen"
import { formatDate } from "@/components/discussion-card"
import { marked } from "marked"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import IVote from "@/types/Vote"



export default function QuestionPage() {
  const params = useParams();
  const questionId = params.id;
  const { user_id, access_token } = useSelector((state: RootState) => state.auth);
  const [question, setQuestion] = useState<IQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [vote, setVote] = useState<IVote | null>(null);
  const [reputation, setReputation] = useState(0);
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [newAnswer, setNewAnswer] = useState<IAnswer| null>(null);
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
        setReputation(data.reputation);
        setAnswers(data.answers);
      } catch (error) {
        console.error("Error fetching question:", error);
        setQuestion(null);
      } finally {
        setLoading(false);
      }
    };
    const fetchVotes = async () => {
      try {
          const response = await fetch(`${api_url}/Vote/${questionId}/${user_id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });
          if(!response.ok) {
            if(response.status === 404) {
              setVote(null);
            } else {
              throw new Error("Failed to fetch votes");
            }
          }
          const data = await response.json();
          setVote(data);
      } catch (error) {
        console.error("Error fetching votes:", error);
      }
    }
    fetchQuestion();
    if(user_id) {
      fetchVotes();
    }
  }, [user_id, questionId]);

  useEffect(() => {
    if (question) {
      setIsOwner(question.postedBy.id === user_id);
    }
  }, [question]);

  useEffect(() => {
    if (newAnswer) {
      setAnswers((prev) => [...prev, newAnswer]);
    }
  }, [newAnswer]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!loading && !question) {
    return <NotFound />
  }

  const handleUpvote = async () => {
    if (vote?.voteType === 0) {
      setVote(null);
      setReputation((prev) => prev - 1);
      try{
        const response = await fetch(`${api_url}/Vote/${questionId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to upvote");
        }
        setVote(null);
      } catch (error) {
        console.error("Error upvoting:", error);
      }
    } else {
      const newVote: IVote = {
        postId: question!.id,
        userId: user_id,
        voteType: 0,
      }
      setVote(newVote);
      try{
        const response = await fetch(`${api_url}/Vote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
          },
          body: JSON.stringify(newVote)
        });
        if (!response.ok) {
          throw new Error("Failed to upvote");
          setVote(null);
        }
        setReputation((prev) => prev + 1);
        const data = await response.json();
        console.log(data);
        setVote(data);
      } catch (error) {
        console.error("Error upvoting:", error);
      }
    }
  };

  const handleDownVote = async () => {
    if (vote?.voteType === 1) {
      setVote(null);
      setReputation((prev) => prev + 1);
      try{
        const response = await fetch(`${api_url}/Vote/${questionId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to downvote");
        }
        setVote(null);
      } catch (error) {
        console.error("Error downvoting:", error);
      }
    } else {
      const newVote: IVote = {
        postId: question!.id,
        userId: user_id,
        voteType: 1,
      }
      setVote(newVote);
      try{
        const response = await fetch(`${api_url}/Vote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
          },
          body: JSON.stringify(newVote)
        });
        if (!response.ok) {
          throw new Error("Failed to downvote");
          setVote(null);
        }
        setReputation((prev) => prev - 1);
        const data = await response.json();
        console.log(data);
        setVote(data);
      } catch (error) {
        console.error("Error downvoting:", error);
      }
    }
  };

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
            {isOwner && (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <FilePenLine />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" className="flex items-center space-x-1">
                  <CircleX />
                  Close
                </Button>
              </div>
            )}
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
          <div className="mb-4">
            <div
              dangerouslySetInnerHTML={{
                __html: marked(question!.content),
              }}
            />
          </div>
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
            <Button onClick={user_id ? handleUpvote : () => {}} variant="ghost" size="sm">
              <ThumbsUp
                className={"mr-1 h-4 w-4 " + (vote?.voteType == 0 && "fill-current text-blue-500")} />
            </Button>
            <p>{reputation}</p>
            <Button onClick={user_id ? handleDownVote: () => {}} variant="ghost" size="sm">
              <ThumbsDown
                className={"mr-1 h-4 w-4 " + (vote?.voteType == 1 && "fill-current text-orange-500")} />
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
              Posted by <Link className="hover:underline" href={`/user/${question!.postedBy.userName}`}>u/{question?.postedBy.userName}</Link> {question && formatDate(question.postedAt.toString())}
            </span>
          </div>
        </CardFooter>
      </Card>
      {question && question.id && <ReplyList
        discussionId={question.id}
        replies={answers} 
        isOwner={isOwner}
        />
      }
      {question && question.id  && <ReplyEditor question={question} newAnswer={newAnswer} setNewAnswer={setNewAnswer} />}
    </div>
  )
}

