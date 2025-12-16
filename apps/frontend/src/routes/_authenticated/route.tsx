import { Center, Loader } from "@mantine/core";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useUserQueryOptions } from "@/hooks/queries/useUserQuery";
import { PrivateLayout } from "@/layouts/PrivateLayout";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async (ctx) => {
    const token = await cookieStore.get("access_token");

    if (!token?.value) {
      throw redirect({
        to: "/auth/sign-in",
      });
    }

    await ctx.context.queryClient.ensureQueryData(useUserQueryOptions);
  },
  ssr: false,
  component: () => (
    <PrivateLayout>
      <Outlet />
    </PrivateLayout>
  ),
  pendingComponent: () => (
    <Center style={{ minHeight: "100vh" }} bg="dark.9">
      <Loader size="sm" />
    </Center>
  ),
});
