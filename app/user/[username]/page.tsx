import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DiscussionList from "@/components/discussion-list"

export default function UserProfile({ params }: { params: { username: string } }) {
  // In a real application, you would fetch the user data based on the username
  const mockUser = {
    username: params.username,
    bio: "Passionate about web development and cloud technologies.",
    questionsAsked: 15,
    answersGiven: 42,
    reputationPoints: 1337,
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={`https://avatar.vercel.sh/${mockUser.username}`} />
            <AvatarFallback>{mockUser.username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">u/{mockUser.username}</CardTitle>
            <p className="text-muted-foreground">{mockUser.bio}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">Questions Asked</h3>
              <p className="text-2xl font-bold">{mockUser.questionsAsked}</p>
            </div>
            <div>
              <h3 className="font-semibold">Answers Given</h3>
              <p className="text-2xl font-bold">{mockUser.answersGiven}</p>
            </div>
            <div>
              <h3 className="font-semibold">Reputation Points</h3>
              <p className="text-2xl font-bold">{mockUser.reputationPoints}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <DiscussionList />
      </div>
    </div>
  )
}

