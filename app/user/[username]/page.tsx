  "use client";

  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
  import { api_url, storage_url } from "@/utils/globalVariables"
  import IUser from "@/types/User"
  import NotFound from "@/components/not-found"
  import { useEffect, useState } from "react";
  import LoadingScreen from "@/components/loading-screen";
  import { useParams } from "next/navigation";


  export default function UserProfile() {
    const params = useParams();
    const username = params.username?.toString();
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
      setHydrated(true);
    }, []);

    useEffect(() => {
      const fetchUser = async () => {
        try{
          setIsLoading(true);
          const response = await fetch(`${api_url}/UserIdentity/Username/${username}`);
          if (!response.ok) {
            throw new Error("User not found");
          }
          const data = await response.json();
          setUser(data);
        } catch (e) {
          console.log(e);
        } finally {
          setIsLoading(false);
        }
      };
      if(username)
        fetchUser();
    }, [username]);

    if (isLoading || !hydrated) {
      return <LoadingScreen />;
    }

    if (!user) {
      return <NotFound />;
    }

    return (
      <div className="space-y-8">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={ user.profilePicture ? `${storage_url}/${user.profilePicture}` :
                `https://avatar.vercel.sh/${user.userName}`} />
              {!user.userName && <AvatarFallback>{user.userName[0]}</AvatarFallback>}
            </Avatar>
            <div>
              <CardTitle className="text-2xl">u/{user.userName}</CardTitle>
              <p className="text-muted-foreground">{user.bio}</p>
            </div>
          </CardHeader>
          <CardContent>
            {/* <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">Questions Asked</h3>
                <p className="text-2xl font-bold">{user.questionsAsked}</p>
              </div>
              <div>
                <h3 className="font-semibold">Answers Given</h3>
                <p className="text-2xl font-bold">{mockUser.answersGiven}</p>
              </div>
              <div>
                <h3 className="font-semibold">Reputation Points</h3>
                <p className="text-2xl font-bold">{mockUser.reputationPoints}</p>
              </div>
            </div> */}
          </CardContent>
        </Card>
        {/* <div>
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <DiscussionList />
        </div> */}
      </div>
    )
  }

