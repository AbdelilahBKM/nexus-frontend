"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { marked } from "marked"


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
  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
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
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
          <CardDescription>Share your question with the community</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                  >
                    {id
                      ? joinedDiscussions.find((discussion) => discussion.id === id)?.name
                      : "Select Discussion..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {joinedDiscussions.map((discussion) => (
                          <CommandItem
                            key={discussion.id}
                            value={discussion.name}
                            onSelect={(currentId) => {
                              setId(currentId === id ? "" : currentId)
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                id === discussion.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {discussion.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
                placeholder="Type your question here. Use markdown for formatting. For code blocks, use triple backticks (``). For single line code, use one backtick (`)."
                className="min-h-[400px] resize-y"
                rows={5}
                required
              />
              <div className="markdown-output">
                {/* Render parsed Markdown content */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: marked(content),
                  }}
                />
              </div>
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

