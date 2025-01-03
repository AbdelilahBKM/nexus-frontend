"use client";
import { notFound, useParams } from "next/navigation"
import DiscussionCard, { formatDate } from "@/components/discussion-card"
import { Button } from "@/components/ui/button"
import DiscussionPost from "@/components/discussion-post"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import IDiscussion from "@/types/Discussion";
import { useEffect, useState } from "react";
import { api_url, storage_url } from "@/utils/globalVariables";
import NotFound from "@/components/not-found";
import LoadingScreen from "@/components/loading-screen";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { IJoining } from "@/types/Joining";
import { AlertDestructive } from "@/components/alerts/AlertDestructive";
import { AlertDefault } from "@/components/alerts/AlertDefault";
import { BadgeMinus, BadgePlus, CheckCircle2, MessageSquare, Plus, ThumbsDown, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { marked } from "marked";

export default function DiscussionPage() {
  const params = useParams();
  const router = useRouter();
  const { user_id, access_token } = useSelector((state: RootState) => state.auth);
  console.log(user_id);
  const discussionName = params.discussionName;
  const [discussion, setDiscussion] = useState<IDiscussion | null>(null);
  const [loading, setLoading] = useState(true);
  const [userJoined, setUserJoined] = useState<IJoining | null>(null);
  const [errorMessages, setErrorMessages] = useState<string>();
  const [successMessages, setSuccessMessages] = useState<string>();

  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        const response = await fetch(`${api_url}/Discussion/Name/${discussionName}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to fetch discussion.");
        }

        return await response.json();
      } catch (error) {
        console.error("Error fetching discussion:", error);
        return null;
      }
    };

    const fetchUserJoined = async (discussionData: { id: number; }) => {
      try {
        const response = await fetch(`${api_url}/Joining/${user_id}/${discussionData.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setUserJoined(null);
          }
        } else {
          const data = await response.json();
          setUserJoined(data);
        }
      } catch (error) {
        console.error("Error fetching user join status:", error);
      }
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        const discussionData = await fetchDiscussion();
        if (!discussionData) {
          throw new Error("Discussion not found.");
        }

        setDiscussion(discussionData);
        if (user_id)
          await fetchUserJoined(discussionData);
      } catch (error) {
        console.error("Error in fetchData:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params, user_id]);

  const joinDiscussion = async () => {
    if (!user_id) {
      router.push("/auth");
    }
    try {
      const response = await fetch(`${api_url}/Joining`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          userId: user_id,
          discussionId: discussion?.id,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to join discussion.");
      }
      const data = await response.json();
      setUserJoined(data);
      setSuccessMessages("Successfully joined discussion.");
    } catch (error) {
      console.error("Error joining discussion:", error);
      setErrorMessages("Failed to join discussion.");
    }
  }
  const leaveDiscussion = async () => {
    try {
      const response = await fetch(`${api_url}/Joining/${discussion?.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to leave discussion.");
      }
      setUserJoined(null);
      setSuccessMessages("Successfully left discussion.");
    } catch (error) {
      console.error("Error leaving discussion:", error);
      setErrorMessages("Failed to leave discussion.");
    }
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (!discussion) {
    return <NotFound />;
  }

  if (discussion.questions) {
    return (
      <div className="space-y-6">
        {errorMessages && <AlertDestructive message={errorMessages} />}
        {successMessages && <AlertDefault message={successMessages} />}
        <div className="flex items-center justify-between w-full">
          <div className="items-center gap-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {discussion.d_Name}
            </h1>
            <div className="text-sm text-muted-foreground mt-2">
              <p>{discussion.number_of_members} members • {discussion.number_of_members} active • {discussion.questions.length} posts</p>
            </div>
          </div>
          {userJoined?.id ?
            <div className="flex items-center gap-4">
              <Link href={`/ask-question?discussion=${discussion.d_Name}`} passHref>
                <Button className="flex items-center gap-2" variant="secondary">Ask Question here</Button>
              </Link>
              <Button onClick={leaveDiscussion} className="flex items-center gap-2" variant="destructive">
                <p>Leave</p>
                <BadgeMinus />
              </Button>
            </div> :
            <Button onClick={joinDiscussion} className="flex items-center gap-2">
              <p>Join</p>
              <BadgePlus />
            </Button>
          }
        </div>
        {discussion.questions.map((question) => (
          <Card key={question.id} className="space-y-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  <Link className="hover:underline" href={`/question/${question.id}`} passHref>
                    {question?.title}
                  </Link>
                  </CardTitle>
                {question?.isAnswered && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This question has been answered</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div
                  dangerouslySetInnerHTML={{
                    __html: marked(question!.content),
                  }}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <ThumbsUp
                    className="mr-1 h-4 w-4 fill-current text-blue-500" />
                </Button>
                <p>{question.reputation}</p>
                <Button variant="ghost" size="sm">
                  <ThumbsDown
                    className="mr-1 h-4 w-4 fill-current text-orange-500" />
                </Button>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{question?.answers.length}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={`https://avatar.vercel.sh/${question?.postedBy.userName}`} />
                  <AvatarFallback>{question?.postedBy.userName}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  Posted by <Link className="hover:underline" href={`/user/${question!.postedBy.userName}`}>u/{question?.postedBy.userName}</Link> {question && formatDate(question.postedAt.toString())}
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  } else {
    return (
      <div className="space-y-8">
        <DiscussionPost question={discussion.questions} />
        {/* <ReplyList discussionId={discussion.id} /> */}
        {/* <ReplyEditor discussionId={discussion.id} /> */}
        donno
      </div>
    )
  }
}

