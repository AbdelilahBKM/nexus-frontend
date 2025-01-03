"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { X, ImageIcon } from 'lucide-react'
import { api_url } from "@/utils/globalVariables"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { AlertDestructive } from "./alerts/AlertDestructive"
import { AlertDefault } from "./alerts/AlertDefault"
import Image from "next/image"

export default function AddDiscussionPage() {
    const { user_id, access_token } = useSelector((state: RootState) => state.auth);
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [errorMsg, setErrorMsg] = useState("")
    const [successMsg, setSuccessMsg] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const storeImage = async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        if (file.size > 10 * 1024 * 1024) {
            setErrorMsg('File size exceeds the limit of 10MB.');
            return;
        }
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                setErrorMsg('Invalid file type. Please upload a valid image.');
                return;
        }
        try {
            const response = await fetch(`${api_url}/upload/upload-image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const result = await response.json();
            const filePath = result.filePath;
            console.log('Uploaded image:', result);
            return filePath;
        } catch (error) {
            console.error(error);
            setErrorMsg("An error occurred while uploading the image");
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");
        if (!title || !description || !image) {
            setErrorMsg("Please fill out all fields and upload an image");
            return;
        }
        try {
            const filePath = await storeImage(image);
            if(!filePath) {
                return;
            }
            const response = await fetch(`${api_url}/Discussion`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    d_Name: title,
                    d_Description: description,
                    d_Profile: filePath,
                    ownerId: user_id
                }),
            });
            if(!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
                throw new Error("An error occurred while creating the discussion: " + errorData);
            }
            const discussion = await response.json();
            const createJoining = await fetch(`${api_url}/Joining`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    userId: user_id,
                    discussionId: discussion.id
                }),
            });
            if(!createJoining.ok) {
                const errorData = await createJoining.json();
                console.log(errorData);
                throw new Error("An error occurred while joining the discussion: " + errorData);
            }
            setSuccessMsg("Discussion created successfully");
            // Optionally, redirect to the new discussion page or discussions list
            // router.push('/discussions');
        } catch (error) {
            console.error(error);
            setErrorMsg("An error occurred while creating the discussion");
        } finally {
            setTitle("");
            setDescription("");
            setImage(null);
            setImagePreview(null);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {errorMsg && <AlertDestructive message={errorMsg} />}
            {successMsg && <AlertDefault message={successMsg} />}
            <Card>
                <CardHeader>
                    <CardTitle>Create a New Discussion</CardTitle>
                    <CardDescription>Start a new topic for the Nexus community</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="image">Discussion Image</Label>
                            <div className="flex items-center space-x-2">
                                <div className="w-32 h-32 flex items-center justify-center border rounded-md overflow-hidden">
                                    {imagePreview ? (
                                        <Image src={imagePreview} alt="Discussion image" width={128} height={128} objectFit="cover" />
                                    ) : (
                                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    ref={fileInputRef}
                                />
                                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                    Upload Image
                                </Button>
                                {image && (
                                    <Button type="button" variant="ghost" onClick={() => { setImage(null); setImagePreview(null); }}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
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

