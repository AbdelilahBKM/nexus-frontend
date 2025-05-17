"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Bot, X, Send, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import ChatMessage from "./chat-message"
import SuggestedQuestions from "./suggested-questions"
import useAuth from "@/hooks/authHook"

// Types for our chat messages
export type MessageType = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
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
  const { username, email, user_id } = useAuth()

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, isMinimized])

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
      1000 + Math.random() * 2000,
    ) // Random delay between 1-3 seconds
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

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (isMinimized) setIsMinimized(false)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
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
    <>
      {/* Chat toggle button */}
      <Button onClick={toggleChat} className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50" size="icon">
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </Button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed bottom-24 right-6 w-[380px] rounded-lg border bg-card shadow-xl z-40 overflow-hidden",
              "md:w-[420px]",
              isMinimized ? "h-[60px]" : "h-[550px]",
            )}
          >
            {/* Chat header */}
            <div className="flex items-center justify-between border-b px-4 py-3 bg-primary text-primary-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/Logo/Nexus_Logo.png" alt="Nexus Assistant" />
                  <AvatarFallback>NA</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">Nexus Assistant</h3>
                  {!isMinimized && <p className="text-xs opacity-80">Ask me anything about IT</p>}
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/80"
                  onClick={toggleMinimize}
                >
                  {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                {!isMinimized && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/80"
                    onClick={clearChat}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </Button>
                )}
              </div>
            </div>
            

            {/* Chat body - only render if not minimized */}
            {!isMinimized && (
              <>
                <ScrollArea className="h-[390px] p-4">
                  <div className="flex flex-col gap-4">
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} user={{ name: username, email }} />
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

                {/* Suggested questions - show only if no messages from user yet */}
                {messages.length === 1 && (
                  <div className="px-4 py-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
                    <SuggestedQuestions onQuestionClick={handleQuestionClick} />
                  </div>
                )}

                {/* Chat input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message..."
                      className="min-h-[60px] resize-none"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!input.trim()}
                      size="icon"
                      className="h-[60px] w-[60px]"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
    </>
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
