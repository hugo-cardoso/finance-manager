import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: App, ssr: true });

function App() {
  return (
    <div className="container mx-auto flex flex-col gap-2">
      <h1>Hello World</h1>

      <Button render={<Route.Link to="/auth/sign-in">Sign in</Route.Link>} />
      <Button variant="secondary" render={<Route.Link to="/dashboard">Dashboard</Route.Link>} />
    </div>
  );
}
