import { useParams } from 'react-router-dom'

export function Debug() {
  return (
    <pre>
      <code>{JSON.stringify(useParams(), null, 2)}</code>
    </pre>
  )
}
