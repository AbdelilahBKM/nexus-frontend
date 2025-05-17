import type { MessageType } from "./chatbot"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

interface ChatMessageProps {
  message: MessageType
  user: { name: string; email: string } | null
}

export default function ChatMessage({ message, user }: ChatMessageProps) {
  const isUser = message.role === "user"
  const formattedTime = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "numeric",
  }).format(message.timestamp)

  return (
    <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
      {isUser ? (
        <Avatar className="h-8 w-8 mt-0.5">
          <AvatarImage src={user ? `https://avatar.vercel.sh/${user.name}` : undefined} />
          <AvatarFallback>{user ? user.name[0] : "U"}</AvatarFallback>
        </Avatar>
      ) : (
        <Avatar className="h-8 w-8 mt-0.5">
          <AvatarImage src="/Logo/Nexus_Logo.png" alt="Nexus Assistant" />
          <AvatarFallback>NA</AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn("rounded-lg px-4 py-2 max-w-[85%]", isUser ? "bg-primary text-primary-foreground" : "bg-muted")}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        <div className={cn("text-[10px] mt-1", isUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {formattedTime}
        </div>
      </div>
    </div>
  )
}
