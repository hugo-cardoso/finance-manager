import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/sign-out")({
  beforeLoad: () => {
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    throw redirect({ to: "/auth/sign-in" });
  },
});
