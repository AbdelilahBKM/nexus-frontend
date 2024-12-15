import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, MessageSquare, CheckCircle2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import CommentList from "@/components/comment-list"
import CommentEditor from "@/components/comment-editor"

interface ReplyCardProps {
  reply: {
    id: number
    content: string
    author: string
    timestamp: string
    upvotes: number
    comments: {
      id: number
      content: string
      author: string
      timestamp: string
    }[]
  }
  isBestAnswer: boolean
  onMarkAsBestAnswer: () => void
}

export default function ReplyCard({ reply, isBestAnswer, onMarkAsBestAnswer }: ReplyCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [showCommentEditor, setShowCommentEditor] = useState(false)

  return (
    <Card className={isBestAnswer ? "border-green-500" : ""}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <p>{reply.content}</p>
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
              <AvatarImage src={`https://avatar.vercel.sh/${reply.author}`} />
              <AvatarFallback>{reply.author[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              Posted by u/{reply.author} {reply.timestamp}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <ThumbsUp className="mr-1 h-4 w-4" />
              {reply.upvotes}
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
              {reply.comments.length}
            </Button>
            {!isBestAnswer && (
              <Button variant="outline" size="sm" onClick={onMarkAsBestAnswer}>
                Mark as Best Answer
              </Button>
            )}
          </div>
        </div>
        {showComments && (
          <>
            <CommentList comments={reply.comments} />
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
                replyId={reply.id}
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

