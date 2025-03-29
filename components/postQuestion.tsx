"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Editor } from 'primereact/editor';
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
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import IDiscussion from "@/types/Discussion"
import { api_url } from "@/utils/globalVariables"
import LoadingScreen from "./loading-screen"
import { IJoining } from "@/types/Joining"
import { AlertDestructive } from "./alerts/AlertDestructive"
import { AlertDefault } from "./alerts/AlertDefault"
import { Label } from "./ui/label"


export default function AskQuestionPage() {
  const { user_id, access_token } = useSelector((state: RootState) => state.auth);
  const searchParams = useSearchParams();
  const discussionName = searchParams.get("discussion");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedDiscussion, setSelectedDiscussion] = useState<IDiscussion>();
  const [errorMessages, setErrorMessages] = useState<string>("");
  const [successMessages, setSuccessMessages] = useState<string>("");
  const [listDiscussion, setListDiscussion] = useState<IDiscussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        console.log("Fetching discussions...");
        setLoading(true);
        const response = await fetch(`${api_url}/Joining/ByUser/${user_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
          }
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to fetch discussions.");
        }
        const data: IJoining[] = await response.json();
        console.log(data);
        const ListDiscussions = data.map((joining: IJoining) => joining.discussion);
        setListDiscussion(ListDiscussions);
      } catch (error) {
        console.error("Error fetching discussions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDiscussions();
  }, [user_id, access_token]);

  useEffect(() => {
    if (discussionName) {
      setSelectedDiscussion(listDiscussion.find((discussion: IDiscussion) => discussion.d_Name === discussionName));
    }
  }, [listDiscussion, discussionName]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages("");
    setSuccessMessages("");
    if (!selectedDiscussion || !title || !content) {
      setErrorMessages("Please select a discussion to post your question.");
      return;
    }
    try{
      const response = await fetch(`${api_url}/Post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
        },
        body: JSON.stringify({
          Title: title,
          Content: content,
          postedBy: user_id,
          discussionId: selectedDiscussion.id,
          postType: 0
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to post question.");
      }
      const data = await response.json();
      console.log(data);
      setSuccessMessages("Successfully posted question.");
      router.push(`/question/${data.id}`);
    } catch (error) {
      console.error("Error posting question:", error);
      setErrorMessages("Failed to post question. Please try again.");
    }
  }
  
  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {errorMessages && <AlertDestructive message={errorMessages} />}
      {successMessages && <AlertDefault message={successMessages} />}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Ask a Question</CardTitle>
          <CardDescription>Get help from the community by asking a clear, specific question</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="discussion" className="text-base font-medium">
                Select Discussion
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    {selectedDiscussion
                      ? listDiscussion.find((d) => d.id === selectedDiscussion.id)?.d_Name
                      : "Select a discussion..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search discussions..." />
                    <CommandList>
                      <CommandEmpty>No discussion found.</CommandEmpty>
                      <CommandGroup>
                        {listDiscussion.map((discussion) => (
                          <CommandItem
                            key={discussion.id}
                            value={discussion.d_Name}
                            onSelect={() => {
                              setSelectedDiscussion(discussion)
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedDiscussion?.id === discussion.id ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {discussion.d_Name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground">Choose the most relevant discussion for your question</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">
                Question Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., How to implement binary search in Python?"
                className="text-base"
              />
              <p className="text-sm text-muted-foreground">
                Be specific and imagine you're asking a question to another person
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-base font-medium">
                Question Details
              </Label>
              <Editor value={content} onTextChange={(e) => setContent(e.htmlValue || "")} style={{ height: '320px' }} />
              <p className="text-sm text-muted-foreground">
                Include all the information someone would need to answer your question
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
              <Button type="submit">Post Question</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

