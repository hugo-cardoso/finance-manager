import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useUserQueryOptions } from "@/hooks/queries/useUser";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  beforeLoad: async () => {
    if (!window.localStorage.getItem("access_token")) {
      throw redirect({
        to: "/auth/sign-in",
      });
    }
  },
  loader: async (ctx) => {
    const queryClient = ctx.context.queryClient;

    await queryClient.ensureQueryData(useUserQueryOptions);
  },
  pendingComponent: () => (
    <div className="w-screen h-screen grid place-items-center">
      <Spinner className="size-6" />
    </div>
  ),
});

function RouteComponent() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 15)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
