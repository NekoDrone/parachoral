import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/motif/$motifSlug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/motif/$motifSlug"!</div>
}
