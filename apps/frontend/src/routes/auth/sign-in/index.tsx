import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/services/AuthService";

export const Route = createFileRoute("/auth/sign-in/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();

  const signInMutation = useMutation({
    mutationFn: AuthService.signIn,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const response = await signInMutation.mutateAsync({ email, password });

    window.localStorage.setItem("access_token", response.access_token);
    window.localStorage.setItem("refresh_token", response.refresh_token);
    window.localStorage.setItem("expires_at", response.expires_at.toString());

    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar na sua conta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" name="email" type="email" placeholder="hugo@example.com" required />
            </Field>
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Senha</FieldLabel>
              </div>
              <Input id="password" name="password" type="password" required />
            </Field>
            <Field>
              <Button type="submit" disabled={signInMutation.isPending}>
                Entrar
              </Button>
              <FieldDescription className="text-center">
                Não tem uma conta? <Route.Link to="/auth/sign-up">Criar conta</Route.Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
