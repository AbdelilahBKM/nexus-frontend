"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import useAuth from "@/hooks/authHook"

// Types for our chat messages
type MessageType = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function AiAssistantPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "welcome",
      content: "Hi there! I'm Nexus Assistant. How can I help you with your IT learning journey today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Suggested questions
  const suggestedQuestions = [
    "How do I get started with Python?",
    "What are the best resources for learning JavaScript?",
    "Can you explain microservices architecture?",
    "How do I join a discussion?",
    "What's the difference between SQL and NoSQL databases?",
  ]

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Focus input on page load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate API call to get bot response
    setTimeout(
      () => {
        const botResponse: MessageType = {
          id: (Date.now() + 1).toString(),
          content: getBotResponse(input),
          role: "assistant",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleQuestionClick = (question: string) => {
    setInput(question)
    inputRef.current?.focus()
  }

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        content: "Hi there! I'm Nexus Assistant. How can I help you with your IT learning journey today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-primary hover:underline">
            <ArrowLeft className="inline mr-2" size={20} />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold">AI Assistant</h1>
        </div>
        <Button onClick={clearChat} variant="outline">
          Clear Chat
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main chat area */}
        <Card className="md:col-span-2 shadow-md">
          <CardHeader className="bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/Logo/Nexus_Logo.png" alt="Nexus Assistant" />
                <AvatarFallback>NA</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Nexus Assistant</CardTitle>
                <CardDescription className="text-primary-foreground/80">Your IT learning companion</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px] p-4">
              <div className="flex flex-col gap-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    {message.role === "user" ? (
                      <Avatar className="h-8 w-8 mt-0.5">
                        <AvatarImage src={`https://avatar.vercel.sh/${"john"}`} />
                        <AvatarFallback>{"J"}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-8 w-8 mt-0.5">
                        <AvatarImage src="/Logo/Nexus_Logo.png" alt="Nexus Assistant" />
                        <AvatarFallback>NA</AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`rounded-lg px-4 py-2 max-w-[85%] ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <div
                        className={`text-[10px] mt-1 ${
                          message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 mt-0.5">
                      <AvatarImage src="/Logo/Nexus_Logo.png" alt="Nexus Assistant" />
                      <AvatarFallback>NA</AvatarFallback>
                    </Avatar>
                    <div className="flex gap-1 items-center h-8 px-3 py-2 rounded-md bg-muted">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t p-4">
            <div className="flex gap-2 w-full">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="min-h-[60px] resize-none"
              />
              <Button onClick={handleSendMessage} disabled={!input.trim()} size="icon" className="h-[60px] w-[60px]">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Sidebar with suggested questions and info */}
        <Card className="shadow-md h-fit">
          <CardHeader>
            <CardTitle>Suggested Questions</CardTitle>
            <CardDescription>Click on any question to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto py-2 text-sm font-normal"
                  onClick={() => handleQuestionClick(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start border-t">
            <p className="text-sm text-muted-foreground mb-2">
              The AI Assistant can help you with general IT questions and guide you to relevant discussions on Nexus.
            </p>
            <p className="text-sm text-muted-foreground">
              For complex questions, consider posting in a discussion to get help from the community.
            </p>
          </CardFooter>
        </Card>
      </div>

      <style jsx global>{`
        .typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: currentColor;
          opacity: 0.6;
          animation: typing 1.4s infinite both;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 100% {
            opacity: 0.2;
            transform: translateY(0);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  )
}

// Mock function to generate bot responses
function getBotResponse(input: string): string {
  const lowerInput = input.toLowerCase()

  if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
    return "Hello! How can I help you with your IT learning today?"
  }

  if (lowerInput.includes("python")) {
    return "Python is a popular programming language for beginners and experts alike. What specific aspect of Python would you like to learn about? I can help with syntax, libraries, or point you to relevant discussions."
  }

  if (lowerInput.includes("javascript") || lowerInput.includes("js")) {
    return "JavaScript is the language of the web! Are you interested in frontend frameworks like React or backend with Node.js? We have active discussions on both topics."
  }

  if (lowerInput.includes("how to") || lowerInput.includes("help")) {
    return "I'd be happy to help! Could you provide more details about what you're trying to accomplish? I can guide you to relevant discussions or provide basic information."
  }

  if (lowerInput.includes("discussion") || lowerInput.includes("join")) {
    return "You can join discussions by clicking on them in the sidebar. If you're looking for a specific topic, try using the search feature or browse the suggested discussions."
  }

  return "That's an interesting question! While I don't have a specific answer right now, you might want to post this in one of our discussion groups to get insights from the community. Would you like me to help you find a relevant discussion?"
}
