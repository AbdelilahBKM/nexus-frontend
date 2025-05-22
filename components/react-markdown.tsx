import ReactMarkdown from 'react-markdown'

export default function MarkDownAnswer({ answer }: { answer: string }) {
  return (
      <ReactMarkdown>{answer}</ReactMarkdown>
  )
}
