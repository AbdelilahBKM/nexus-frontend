import DiscussionList from "@/components/discussion-list"
import SortingOptions from "@/components/sorting-options"

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to Nexus</h1>
      <p className="text-lg text-muted-foreground">
        Explore discussions and questions across various IT domains.
      </p>
      <SortingOptions />
      <DiscussionList />
    </div>
  )
}

