"use client"

import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

// Mock notifications data
const notifications = [
  { id: 1, message: "New reply to your question", isRead: false },
  { id: 2, message: "Your answer was marked as best", isRead: false },
  { id: 3, message: "New question in Python discussion", isRead: true },
]


export default function Header() {
  const { user, logout } = useAuth()
  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-4">
          <Image
            src="/Logo/Nexus_Logo.png"
            alt="Nexus Logo"
            width={40}
            height={40}
          />
          <span className="text-2xl font-bold">Nexus</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Input className="w-64 hidden md:block" placeholder="Search discussions..." />
          <Button variant="outline" asChild className="hidden sm:inline-flex">
            <Link href="/ask-question">Ask a Question</Link>
          </Button>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex items-start py-2">
                  <div className="flex-1">
                    <p className={`text-sm ${notification.isRead ? 'text-muted-foreground' : 'font-medium'}`}>
                      {notification.message}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <Badge variant="secondary" className="ml-2">New</Badge>
                  )}
                </DropdownMenuItem>
              ))}
              {notifications.length === 0 && (
                <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
              )}
              <DropdownMenuItem asChild className="justify-center font-medium">
                <Link href="/notifications">View all notifications</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={`https://avatar.vercel.sh/${user.name}`} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/auth">Login</Link>
              </Button>
              <Button asChild className="hidden sm:inline-flex">
                <Link href="/auth">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

