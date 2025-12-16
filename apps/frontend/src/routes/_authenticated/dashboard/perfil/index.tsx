import { Text } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { useUserSuspenseQuery } from "@/hooks/queries/useUserQuery";
import { PrivateLayoutContent } from "@/layouts/PrivateLayout/content";

export const Route = createFileRoute("/_authenticated/dashboard/perfil/")({
  component: () => (
    <PrivateLayoutContent title="Perfil">
      <RouteComponent />
    </PrivateLayoutContent>
  ),
});

function RouteComponent() {
  const user = useUserSuspenseQuery();

  return (
    <div>
      <Text>Hello {user.data.name}!</Text>
    </div>
  );
}
