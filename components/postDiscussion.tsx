"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X, Smile } from 'lucide-react'
import { api_url } from "@/utils/globalVariables"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { AlertDestructive } from "./alerts/AlertDestructive"
import { AlertDefault } from "./alerts/AlertDefault"

const emojiOptions = ["🐍", "🌐", "🔒", "📊", "🤖", "💻", "🚀", "🧠", "📱", "🎨", "🔬", "🧪"]

export default function AddDiscussionPage() {
    const dispatch = useDispatch();
    const { user_id, access_token } = useSelector((state: RootState) => state.auth);
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [emoji, setEmoji] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const [sucessMsg, setSucessMsg] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setSucessMsg("");
        if (!title || !description || !emoji) {
            setErrorMsg("Please fill out all fields");
            return;
        }
        try {
            const response = await fetch(`${api_url}/Discussion`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    d_Name: title,
                    d_Description: description,
                    d_Emoji: emoji,
                    ownerId: user_id 
                }),
            });
            if(!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
                throw new Error("An error occurred while creating the discussion: " + errorData);
            }
            setSucessMsg("Discussion created successfully");
        } catch (error) {
            console.error(error);
            setErrorMsg("An error occurred while creating the discussion");
        } finally {
            setTitle("");
            setDescription("");
            setEmoji("");
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {errorMsg && <AlertDestructive message={errorMsg} />}
            {sucessMsg && <AlertDefault message={sucessMsg} />}
            <Card>
                <CardHeader>
                    <CardTitle>Create a New Discussion</CardTitle>
                    <CardDescription>Start a new topic for the Nexus community</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="emoji">Discussion Emoji</Label>
                            <div className="flex items-center space-x-2">
                                <div className="w-12 h-12 flex items-center justify-center text-2xl border rounded-md">
                                    {emoji || <Smile className="text-muted-foreground" />}
                                </div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline">Select Emoji</Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64">
                                        <div className="grid grid-cols-6 gap-2">
                                            {emojiOptions.map((e) => (
                                                <button
                                                    key={e}
                                                    className="text-2xl p-2 hover:bg-accent rounded"
                                                    onClick={() => setEmoji(e)}
                                                    type="button"
                                                >
                                                    {e}
                                                </button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Discussion Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter the title of your discussion"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Provide more details about your discussion topic"
                                rows={5}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Create Discussion</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

