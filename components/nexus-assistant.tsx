"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2, Brain } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { api_url } from "@/utils/globalVariables"

interface Question {
  id: number
  title: string
  content: string
  postedAt: string
}

interface SimilarQuestion {
  simularityId: number
  questionId: number
  score: number
  question: Question
}

interface SimilarityResponse {
  id: number
  questionId: number
  question: Question
  simularityQuestions: SimilarQuestion[]
}

interface NexusAssistantProps {
  questionId: string | number
}

export default function NexusAssistant({ questionId }: NexusAssistantProps) {
  const [similarQuestions, setSimilarQuestions] = useState<SimilarQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
  const fetchSimilarQuestions = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${api_url}/SimilarQuestions/Question/${questionId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch similar questions")
      }

      const data: SimilarityResponse = await response.json()
      console.log("Fetched similar questions:", data)

      if (data && data.simularityQuestions) {
        setSimilarQuestions(data.simularityQuestions)
      } else {
        setSimilarQuestions([])
      }
    } catch (error) {
      console.log("No Simular Questions:", error)
      setSimilarQuestions([])
    } finally {
      setLoading(false)
    }
  }

  if (questionId) {
    fetchSimilarQuestions()
  }
}, [questionId])


  // Don't render anything if there are no similar questions
  if (!loading && (similarQuestions.length === 0 || error)) {
    return null
  }

  return (
    <Card className="bg-muted/50 border-muted">
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Finding similar questions...</span>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="h-5 w-5 text-primary" />
              <h3 className="font-medium">
                Nexus Assistant has found {similarQuestions.length} similar question
                {similarQuestions.length !== 1 ? "s" : ""}:
              </h3>
            </div>
            <ul className="space-y-2 pl-6 list-disc">
              {similarQuestions.map((item, index) => (
                <li key={index}>
                  <Link href={`/question/${item.questionId}`} className="text-primary hover:underline">
                    {item.question.title}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  )
}
