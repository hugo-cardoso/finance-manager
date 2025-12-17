import { createFileRoute } from "@tanstack/react-router";
import { NoFound } from "@/components/NoFound";
import { PrivateLayoutContent } from "@/layouts/PrivateLayout/content";

export const Route = createFileRoute("/_authenticated/dashboard")({
  notFoundComponent: () => (
    <PrivateLayoutContent title="404 - Página não encontrada">
      <NoFound link={{ to: "/dashboard" }} />
    </PrivateLayoutContent>
  ),
});
