import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/activity/$activitySlug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/activity/$activitySlug"!</div>
}
