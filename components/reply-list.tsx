"use client"

import { IAnswer } from "@/types/Post"
import ReplyCard from "./reply-card";

interface IReply {
  discussionId: number;
  replies: IAnswer[];
  isOwner: boolean;
}

export default function ReplyList({replies, isOwner}: IReply) {
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Replies</h2>
      {replies.map((reply) => (
        <ReplyCard 
          key={reply.id} 
          answer={reply}
          isBestAnswer={reply.isBestAnswer}
          isOwner={isOwner}
          onMarkAsBestAnswer={() => console.log(`Marked reply ${reply.id} as best answer`)}
        />
      ))}
    </div>
  )
}

