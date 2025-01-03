"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  }, [user_id]);

  useEffect(() => {
    if (discussionName) {
      setSelectedDiscussion(listDiscussion.find((discussion: IDiscussion) => discussion.d_Name === discussionName));
    }
  }, [listDiscussion]);
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
    <div className="container mx-auto px-4 py-8">
      {errorMessages && <AlertDestructive message={errorMessages} />}
      {successMessages && <AlertDefault message={successMessages} />}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
          <CardDescription>Share your question with the community</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                  >
                    {id
                      ? listDiscussion.find((discussion) => discussion.id === id)?.d_Name
                      : "Select Discussion..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandList>
                      <CommandEmpty>Join a discussion to ask a question.</CommandEmpty>
                      <CommandGroup>
                        {listDiscussion.map((discussion) => (
                          <CommandItem
                            key={discussion.id}
                            value={discussion.d_Name}
                            onSelect={(currentValue) => {
                              const selectedDiscussion = listDiscussion.find(d => d.d_Name === currentValue);
                              setId(selectedDiscussion ? selectedDiscussion.id : 0);
                              setSelectedDiscussion(selectedDiscussion);
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                id === discussion.id ? "opacity-100" : "opacity-0"
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
            </div>
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Question Title</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter the title of your question"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">Question Details</label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your question here. Use markdown for formatting. For code blocks, use triple backticks (``). For single line code, use one backtick (`)."
                className="min-h-[400px] resize-y"
                rows={5}
                required
              />
              {/* Render parsed Markdown content */}
              {/* <div className="markdown-output">
                <div
                  dangerouslySetInnerHTML={{
                    __html: marked(content),
                  }}
                />
              </div> */}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Post Question</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

