import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/sign-out/")({
  loader: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_at");
  },
  component: () => <Navigate to="/auth/sign-in" replace />,
});
