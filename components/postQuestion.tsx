"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

// Mock data for discussions the user has joined
const joinedDiscussions = [
  { id: "1", name: "Python Programming" },
  { id: "2", name: "Web Development" },
  { id: "3", name: "Data Science" },
]

export default function AskQuestionPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedDiscussion, setSelectedDiscussion] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the question data to your backend
    console.log({ title, content, selectedDiscussion })
    // After successful submission, redirect to the home page or the specific discussion
    router.push("/")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
          <CardDescription>Share your question with the community</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="discussion" className="text-sm font-medium">Select Discussion</label>
              <Select onValueChange={setSelectedDiscussion} required>
                <SelectTrigger id="discussion">
                  <SelectValue placeholder="Choose a discussion" />
                </SelectTrigger>
                <SelectContent>
                  {joinedDiscussions.map((discussion) => (
                    <SelectItem key={discussion.id} value={discussion.id}>
                      {discussion.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Question Title</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter the title of your question"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">Question Details</label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Provide more details about your question"
                rows={5}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Post Question</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

