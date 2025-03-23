import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, MessageSquare, CheckCircle2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import CommentList from "@/components/comment-list"
import CommentEditor from "@/components/comment-editor"
import { IAnswer } from "@/types/Post"
import { formatDate } from "./discussion-card"
import { api_url, storage_url } from "@/utils/globalVariables"
import IVote from "@/types/Vote"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import Link from "next/link"
import SanitizedHTML from "./sanitized-html"

interface ReplyCardProps {
  answer: IAnswer;
  isBestAnswer: boolean;
  onMarkAsBestAnswer: (id: number) => void;
  isOwner: boolean;
}

export default function ReplyCard({ answer, isBestAnswer, onMarkAsBestAnswer, isOwner }: ReplyCardProps) {
  const { user_id, access_token } = useSelector((state: RootState) => state.auth);
  const [showComments, setShowComments] = useState(false);
  const [showCommentEditor, setShowCommentEditor] = useState(false);
  const [vote, setVote] = useState<IVote | null>(null);
  const [reputation, setReputation] = useState(answer.reputation);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await fetch(`${api_url}/Vote/${answer.id}/${user_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
        if (!response.ok) {
          if (response.status === 404) {
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
    };
    fetchVotes();
    setReputation(answer.reputation);
  }, [answer.id, user_id]);

  const handleUpvote = async () => {
    if (vote?.voteType === 0) {
      setVote(null);
      setReputation((prev) => prev - 1);
      try {
        const response = await fetch(`${api_url}/Vote/${vote.id}`, {
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
        postId: answer.id,
        userId: user_id,
        voteType: 0,
      }
      setVote(newVote);
      try {
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
      try {
        const response = await fetch(`${api_url}/Vote/${vote.id}`, {
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
        postId: answer!.id,
        userId: user_id,
        voteType: 1,
      }
      setVote(newVote);
      try {
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
    <Card className={isBestAnswer ? "border-green-500" : ""}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <SanitizedHTML content={answer.content || ""} />
          {isBestAnswer && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Best Answer</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={
                answer.postedBy.profilePicture ?
                  `${storage_url}/${answer.postedBy.profilePicture}` :
                  `https://avatar.vercel.sh/${answer.postedBy.userName}`} />
              {!answer.postedBy.profilePicture && <AvatarFallback>{answer.postedBy.userName[0]}</AvatarFallback>}
            </Avatar>
            <span className="text-sm text-muted-foreground">
              Posted by <Link className="hover:underline" href={`/user/${answer.postedBy.userName}`}>u/{answer.postedBy.userName}</Link>  {formatDate(answer.postedAt.toString())}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={user_id ? handleUpvote : () => { }} variant="ghost" size="sm">
              <ThumbsUp
                className={"mr-1 h-4 w-4 " + (vote?.voteType == 0 && "fill-current text-blue-500")} />
            </Button>
            <p>{reputation}</p>
            <Button onClick={user_id ? handleDownVote : () => { }} variant="ghost" size="sm">
              <ThumbsDown
                className={"mr-1 h-4 w-4 " + (vote?.voteType == 1 && "fill-current text-orange-500")} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquare className="mr-1 h-4 w-4" />
              {answer.replies.length}
            </Button>
            {!isBestAnswer && isOwner && (
              <Button variant="outline" size="sm" onClick={() => onMarkAsBestAnswer(answer.id)}>
                Mark as Best Answer
              </Button>
            )}
          </div>
        </div>
        {showComments && (
          <>
            <CommentList comments={answer.replies} />
            {!showCommentEditor && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCommentEditor(true)}
              >
                Add a comment
              </Button>
            )}
            {showCommentEditor && (
              <CommentEditor
                replyId={answer.id}
                onSubmit={() => {
                  setShowCommentEditor(false)
                  // In a real application, you would add the new comment to the list
                }}
              />
            )}
          </>
        )}
      </CardFooter>
    </Card>
  )
}

