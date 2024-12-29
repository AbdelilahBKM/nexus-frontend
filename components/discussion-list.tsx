"use client"

import { useEffect, useState } from "react"
import DiscussionCard from "@/components/discussion-card"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import Link from "next/link"
import IDiscussion from "@/types/Discussion"
import { Ghost } from "lucide-react"
import { api_url, storage_url } from "@/utils/globalVariables"
import LoadingScreen from "./loading-screen"


export default function DiscussionList() {
  const [discussions, setDiscussions] = useState<IDiscussion[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchDiscussions = async () => {
      try{
        setLoading(true);
        const response = await fetch(`${api_url}/Discussion`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error);
        }
        const data = await response.json();
        setDiscussions(data);
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchDiscussions();
  }, []);
  
  if (loading) return <LoadingScreen />
  return (
    <div className="space-y-8">
      {discussions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-lg">
          <Ghost className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold text-muted-foreground">No discussions yet</h2>
          <p className="text-muted-foreground">Be the first to start a discussion!</p>
        </div>
      ) :
        discussions.map((discussion) => (
          <div key={discussion.id} className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
            <Avatar className="w-10 h-10">
                <AvatarImage src={`${storage_url}/${discussion.d_Profile}`} alt={discussion.d_Name} />
                <AvatarFallback>{discussion.d_Name[0]}</AvatarFallback>
              </Avatar>
              Latest Questions in
              <Link href={`/discussion/${discussion.id}`}>
                <span className="hover:underline cursor-pointer">{discussion.d_Name}</span>
              </Link>
            </h2>
            {discussion.questions.map((question) => (
              <DiscussionCard
                key={question.id}
                discussion={discussion}
              />
            ))}
          </div>
        ))}
    </div>
  )
}

