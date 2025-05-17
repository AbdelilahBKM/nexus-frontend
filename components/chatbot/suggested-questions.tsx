"use client"

import { Button } from "@/components/ui/button"

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void
}

const questions = [
  "How do I get started with Python?",
  "What are the best resources for learning JavaScript?",
  "Can you explain microservices architecture?",
  "How do I join a discussion?",
  "What's the difference between SQL and NoSQL databases?",
]

export default function SuggestedQuestions({ onQuestionClick }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-col gap-2">
      {questions.map((question, index) => (
        <Button
          key={index}
          variant="outline"
          className="justify-start h-auto py-2 text-sm font-normal"
          onClick={() => onQuestionClick(question)}
        >
          {question}
        </Button>
      ))}
    </div>
  )
}
