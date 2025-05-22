"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { api_url } from "@/utils/globalVariables"
import MarkDownAnswer from "./react-markdown"

export default function NexusAssistantAnswer({ questionId }: { questionId: number }) {
   const [answer, setAnswer] = useState<string | null>(null)
   const [loading, setLoading] = useState<boolean>(true)

   useEffect(() => {
      async function fetchAnswer() {
         try {
            const res = await fetch(`${api_url}/Assistant/SuggestedAnswer/${questionId}`)
            if (!res.ok) return // silently skip if not found or any error

            const data = await res.json()
            if (data?.answer) {
               setAnswer(data.answer)
            }
         } catch {
         } finally {
            setLoading(false)
         }
      }

      fetchAnswer()
   }, [questionId])

   // If no answer is found, return null
   if (!answer && !loading) {
      return null
   }


   return (
      <Card className="border-blue-500 border-2">
         <CardHeader className="flex flex-row items-center gap-2">
            <Sparkles className="text-blue-500" />
            <CardTitle className="text-lg text-blue-700">Nexus Assistant Suggested Answer</CardTitle>
         </CardHeader>
         <CardContent>
            {loading ? (
               <p className="text-muted-foreground">Loading answer...</p>
            ) : answer ? (
               <div className="prose prose-sm max-w-none text-muted-foreground">
                  <MarkDownAnswer answer={answer} />
               </div>
            ) : null}
         </CardContent>
      </Card>
   )
}
