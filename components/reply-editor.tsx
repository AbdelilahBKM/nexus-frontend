"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import Link from "next/link"
import { IAnswer, IQuestion } from "@/types/Post"
import { api_url } from "@/utils/globalVariables"

interface ReplyEditorProps {
  question: IQuestion;
  setNewAnswer: (answer: IAnswer) => void;
}

export default function ReplyEditor({ question, setNewAnswer }: ReplyEditorProps) {
  const { user_id, access_token } = useSelector((state: RootState) => state.auth);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user_id) return;
    try {
      setLoading(true);
      const response = await fetch(`${api_url}/Post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          title: `Answer to ${question.title}`,
          content: reply,
          postedBy: user_id,
          questionId: question.id,
          postType: 1,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData);
      }
      const data = await response.json();
      setNewAnswer(data);
    } catch (error) {
      console.error("Error posting answer:", error);
    } finally {
      setReply("");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">Your Answer</h2>
      <Textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Your Answer. Use markdown for formatting. For code blocks, use triple backticks (``). For single line code, use one backtick (`)."
        className="min-h-[200px]"
      />
      {user_id ? !question.isClosed ?
        <Button type="submit" disabled={loading}>{loading ? "hang on ..." : "Post Your Answer"}</Button> :
        <p className="text-muted-foreground">This question is closed. You can&apos;t post an answer.</p> :
        <div className="flex items-center space-x-2 text-sm ">
          <p className="text-muted-foreground">You need to be logged in to post an answer.</p>
          <Link href={"/auth"} className="hover:underline" >Login?</Link>
        </div>
      }
    </form>
  )
}

