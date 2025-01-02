import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, MessageSquare, CheckCircle2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import CommentList from "@/components/comment-list"
import CommentEditor from "@/components/comment-editor"
import { IAnswer } from "@/types/Post"
import { formatDate } from "./discussion-card"
import { storage_url } from "@/utils/globalVariables"
import { marked } from "marked"
import IVote from "@/types/Vote"

interface ReplyCardProps {
  answer: IAnswer;
  isBestAnswer: boolean;
  onMarkAsBestAnswer: () => void;
  isOwner: boolean;
}

export default function ReplyCard({ answer, isBestAnswer, onMarkAsBestAnswer, isOwner }: ReplyCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [showCommentEditor, setShowCommentEditor] = useState(false)
  const [vote, setVote] = useState<IVote | null>(null);

  return (
    <Card className={isBestAnswer ? "border-green-500" : ""}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div
            dangerouslySetInnerHTML={{
              __html: marked(answer!.content),
            }}
          />
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
              Posted by u/{answer.postedBy.userName} {formatDate(answer.postedAt.toString())}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <ThumbsUp className="mr-1 h-4 w-4" />
              {answer.reputation}
            </Button>
            <Button variant="ghost" size="sm">
              <ThumbsDown className="mr-1 h-4 w-4" />
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
              <Button variant="outline" size="sm" onClick={onMarkAsBestAnswer}>
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

