"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, ArrowLeft } from 'lucide-react'

// Mock notifications data
const initialNotifications = [
  { id: 1, message: "New reply to your question about Python decorators", isRead: false, timestamp: "2 hours ago" },
  { id: 2, message: "Your answer about React hooks was marked as best", isRead: false, timestamp: "1 day ago" },
  { id: 3, message: "New question in Python discussion: 'Understanding list comprehensions'", isRead: true, timestamp: "2 days ago" },
  { id: 4, message: "Reminder: Virtual meetup for JavaScript developers tomorrow", isRead: true, timestamp: "3 days ago" },
  { id: 5, message: "Your discussion post about microservices architecture is trending", isRead: true, timestamp: "5 days ago" },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-primary hover:underline">
            <ArrowLeft className="inline mr-2" size={20} />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold">Notifications</h1>
        </div>
        <Button onClick={markAllAsRead} variant="outline">Mark all as read</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2" />
            Your Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-center text-muted-foreground">No notifications to display.</p>
          ) : (
            <ul className="space-y-4">
              {notifications.map((notification) => (
                <li key={notification.id} className="flex items-start justify-between p-4 hover:bg-accent rounded-lg transition-colors">
                  <div className="flex-1">
                    <p className={`${notification.isRead ? 'text-muted-foreground' : 'font-medium'}`}>
                      {notification.message}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{notification.timestamp}</p>
                  </div>
                  {!notification.isRead && (
                    <div className="ml-4 flex items-center">
                      <Badge variant="secondary">New</Badge>
                      <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)} className="ml-2">
                        Mark as read
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

