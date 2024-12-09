import DiscussionPost from "@/components/discussion-post"
import ReplyList from "@/components/reply-list"
import ReplyEditor from "@/components/reply-editor"

export default function DiscussionView({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the discussion data based on the ID
  const mockDiscussion = {
    id: parseInt(params.id),
    title: "Understanding Microservices Architecture",
    content: "I'm trying to grasp the concept of microservices architecture. Can someone explain the key benefits and potential drawbacks compared to monolithic applications?",
    tags: ["microservices", "architecture", "system-design"],
    author: "techExplorer",
    timestamp: "1d ago",
    upvotes: 25,
  }

  return (
    <div className="space-y-8">
      <DiscussionPost discussion={mockDiscussion} />
      <ReplyList discussionId={mockDiscussion.id} />
      <ReplyEditor discussionId={mockDiscussion.id} />
    </div>
  )
}

