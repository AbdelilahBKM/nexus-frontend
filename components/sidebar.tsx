"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, Home, PlusCircle, Compass, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { api_url, storage_url } from "@/utils/globalVariables"
import IDiscussion from "@/types/Discussion"
import { IJoining } from "@/types/Joining"
import { loadAuthState } from "@/store/reducers/authReducer"

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [joinedDiscussions, setJoinedDiscussions] = useState<IDiscussion[]>([])
  const [suggestedDiscussions, setSuggestedDiscussions] = useState<IDiscussion[]>([])
  const pathname = usePathname()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(loadAuthState());
  }, [dispatch]);
  const { user_id, access_token } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // Fetch joined discussions
    const fetchJoinedDiscussions = async () => {
      if (!user_id) return

      try {
        const response = await fetch(`${api_url}/Joining/ByUser/${user_id}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
            ContentType: "application/json",
            Accept: "application/json",
          },
        })

        if (response.ok) {
          const Joining: IJoining[] = await response.json()
          const discussions: IDiscussion[] = Joining.map((j: IJoining) => j.discussion)
          setJoinedDiscussions(discussions)
        }
      } catch (error) {
        console.error("Error fetching joined discussions:", error)
      }
    }

    // Fetch suggested discussions
    const fetchSuggestedDiscussions = async () => {
      try {
        const response = await fetch(`${api_url}/Discussion/suggested`, {
          headers: user_id
            ? {
                Authorization: `Bearer ${access_token}`,
              }
            : {},
        })

        if (response.ok) {
          const data = await response.json()
          setSuggestedDiscussions(data)
        }
      } catch (error) {
        console.error("Error fetching suggested discussions:", error)
      }
    }

    fetchJoinedDiscussions()
    if(access_token){
      fetchSuggestedDiscussions()
    }
  }, [user_id, access_token])


  return (
    <div
      className={cn(
        "flex flex-col border-r bg-background h-screen sticky top-0 transition-all duration-300",
        collapsed ? "w-[80px]" : "w-[280px]",
      )}
    >
      <div className="flex items-center justify-end p-5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6 py-4">
          <div className="px-4 py-2">
            <h2 className={cn("mb-4 text-lg font-semibold tracking-tight", collapsed && "sr-only")}>Navigation</h2>
            <div className="space-y-3">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start py-6",
                  collapsed ? "px-2" : "px-4",
                  pathname === "/" && "bg-accent",
                )}
                asChild
              >
                <Link href="/">
                  <Home className={cn("h-5 w-5", !collapsed && "mr-3")} />
                  {!collapsed && <span>Home</span>}
                </Link>
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start py-6",
                  collapsed ? "px-2" : "px-4",
                  pathname === "/profile" && "bg-accent",
                )}
                asChild
              >
                <Link href="/profile">
                  <User className={cn("h-5 w-5", !collapsed && "mr-3")} />
                  {!collapsed && <span>Profile</span>}
                </Link>
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start py-6",
                  collapsed ? "px-2" : "px-4",
                  pathname === "/settings" && "bg-accent",
                )}
                asChild
              >
                <Link href="/settings">
                  <Settings className={cn("h-5 w-5", !collapsed && "mr-3")} />
                  {!collapsed && <span>Settings</span>}
                </Link>
              </Button>
            </div>
          </div>

          <Separator className="mx-4" />

          <div className="px-4 py-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className={cn("text-lg font-semibold tracking-tight", collapsed && "sr-only")}>Discussions</h2>
              {!collapsed && (
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/add-discussion">
                    <PlusCircle className="h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {joinedDiscussions.map((discussion: IDiscussion) => (
                <Button
                  key={discussion.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start py-5",
                    collapsed ? "px-2" : "px-4",
                    pathname === `/discussion/${discussion.id}` && "bg-accent",
                  )}
                  asChild
                >
                  <Link href={`/discussion/${discussion.d_Name}`}>
                    <Avatar className={cn("h-7 w-7", !collapsed && "mr-3")}>
                      <AvatarImage 
                      src={discussion.d_Profile ? `${storage_url}/${discussion.d_Profile}`: undefined} 
                      alt={discussion.d_Name} />
                      <AvatarFallback>{discussion.d_Name[0]}</AvatarFallback>
                    </Avatar>
                    {!collapsed && <span className="truncate">{discussion.d_Name}</span>}
                  </Link>
                </Button>
              ))}
              {collapsed && (
                <Button variant="ghost" className="w-full justify-center py-5 px-2" asChild>
                  <Link href="/add-discussion">
                    <PlusCircle className="h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <Separator className="mx-4" />

          <div className="px-4 py-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className={cn("text-lg font-semibold tracking-tight", collapsed && "sr-only")}>Suggested</h2>
              {!collapsed && (
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/">
                    <Compass className="h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {suggestedDiscussions.map((discussion) => (
                <Button
                  key={discussion.id}
                  variant="ghost"
                  className={cn("w-full justify-start py-5", collapsed ? "px-2" : "px-4")}
                  asChild
                >
                  <Link href={`/discussion/${discussion.d_Name}`}>
                    <Avatar className={cn("h-7 w-7", !collapsed && "mr-3")}>
                      <AvatarImage src={discussion.d_Profile ?? undefined} alt={discussion.d_Name} />
                      <AvatarFallback>{discussion.d_Name[0]}</AvatarFallback>
                    </Avatar>
                    {!collapsed && <span className="truncate">{discussion.d_Name}</span>}
                  </Link>
                </Button>
              ))}
              {collapsed && (
                <Button variant="ghost" className="w-full justify-center py-5 px-2" asChild>
                  <Link href="/">
                    <Compass className="h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

