import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IAnswer } from "@/types/Post"
import { formatDate } from "./discussion-card"
import { storage_url } from "@/utils/globalVariables"

interface CommentListProps {
  comments: IAnswer[]
}

export default function CommentList({ comments }: CommentListProps) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start space-x-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={
              comment.postedBy.profilePicture ?
              `${storage_url}/${comment.postedBy.profilePicture}` :
              `https://avatar.vercel.sh/${comment.postedBy.userName}`} />
            {!comment.postedBy.profilePicture && <AvatarFallback>{comment.postedBy.userName[0]}</AvatarFallback>}
          </Avatar>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">u/{comment.postedBy.userName}</span>
              <span className="text-sm text-muted-foreground">{formatDate(comment.postedAt.toString())}</span>
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

