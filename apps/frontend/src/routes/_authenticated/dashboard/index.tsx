import { createFileRoute } from "@tanstack/react-router";
import { useUserSuspenseQuery } from "@/hooks/queries/useUserQuery";
import { PrivateLayoutContent } from "@/layouts/PrivateLayout/content";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: () => (
    <PrivateLayoutContent title="Dashboard">
      <RouteComponent />
    </PrivateLayoutContent>
  ),
});

function RouteComponent() {
  const user = useUserSuspenseQuery();

  return (
    <div>
      <p>Hello {user.data.name}!</p>
      <div className="flex flex-1 flex-col gap-4 p-4">
        {Array.from({ length: 24 }).map((_, index) => (
          <div key={index} className="bg-muted/50 aspect-video h-12 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
