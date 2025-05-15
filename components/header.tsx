"use client"

import Link from "next/link"
import Image from "next/image"
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
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { loadAuthState, logout } from "@/store/reducers/authReducer"
import { useEffect, useState } from "react"
import { storage_url } from "@/utils/globalVariables"
import INotification from "@/types/Notification"
import { useRouter } from "next/navigation"


export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, username, user_id, profile_pic } = useSelector((state: RootState) => state.auth);
  // const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const unreadCount = notifications.filter(n => !n.isRead).length
  useEffect(() => {
    dispatch(loadAuthState());
    setNotifications([]);
  }, [dispatch]);

  useEffect(() => {
    // const fetchNotifications = async () => {
    //   try {
    //     setLoading(true);
    //     // Fetch notifications from the server
    //     const response = await fetch(`${api_url}/notification/${user_id}`, {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${access_token}`,
    //       },
    //     });
    //     if (!response.ok) {
    //       if (response.status === 401) {
    //         dispatch(logout());
    //       }
    //       const errorData = await response.json();
    //       throw new Error(`${errorData} (Status: ${response.status})`);
    //     }
    //     const data = await response.json();
    //     console.log(data);
    //     setNotifications(data);
    //   } catch (error) {
    //     console.error(error);
    //   } finally {
    //     setLoading(false);
    //   }
    // }
    // if (isAuthenticated) {
    //   fetchNotifications();
    // }
  }, [user_id]);
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">New</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/ask-question">Ask a Question</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/add-discussion">Start a Discussion</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
          {
            isAuthenticated &&
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
          }
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={profile_pic ?
                    `${storage_url}/${profile_pic}` :
                    `https://avatar.vercel.sh/${username}`} />
                  {!profile_pic && <AvatarFallback>{username[0]}</AvatarFallback>}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem >
                  <Button variant="link" onClick={() => {
                    dispatch(logout());
                    router.refresh();
                    }}>
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/auth">Sign In</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

