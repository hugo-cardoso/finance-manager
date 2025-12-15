import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Spinner } from "@/components/ui/spinner";
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
    <div className="flex h-dvh w-full items-center justify-center">
      <Spinner />
    </div>
  ),
});
