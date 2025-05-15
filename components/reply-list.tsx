"use client"

import { IAnswer } from "@/types/Post"
import ReplyCard from "./reply-card";
import { api_url } from "@/utils/globalVariables";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
interface IReply {
  discussionId: number;
  replies: IAnswer[];
  isOwner: boolean;
}

export default function ReplyList({replies, isOwner}: IReply) {
  const router = useRouter();
  const { access_token } = useSelector((state: RootState) => state.auth);
  const onMarkAsBestAnswer = async (answerId: number) => {
    try{
      const response = await fetch(`${api_url}/Post/MarkAsBestAnswer/${answerId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
        }
      });
      if(!response.ok) {
        const data = await response.json();
        throw new Error(data);
      }
      router.refresh();
    } catch (error) {
      console.error("Error marking as best answer:", error);
    }
  }
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Replies</h2>
      {replies.map((reply) => (
        <ReplyCard 
          key={reply.id}
          answer={reply}
          isBestAnswer={reply.isBestAnswer}
          isOwner={isOwner}
          onMarkAsBestAnswer={onMarkAsBestAnswer}
        />
      ))}
    </div>
  )
}

