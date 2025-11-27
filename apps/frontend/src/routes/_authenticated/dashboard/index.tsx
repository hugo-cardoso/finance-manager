import { createFileRoute } from "@tanstack/react-router";

import { AppSidebarContent } from "@/components/app-sidebar-content";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppSidebarContent title="Dashboard">
      <div className="px-4 py-5 flex flex-col gap-4">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Widget />
          <Widget />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Widget />
          <Widget />
          <Widget />
        </section>
      </div>
    </AppSidebarContent>
  );
}

function Widget() {
  return <Card className="@container/card bg-input/30 h-[200px]" />;
}
