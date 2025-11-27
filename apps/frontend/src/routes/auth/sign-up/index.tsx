import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/services/AuthService";

export const Route = createFileRoute("/auth/sign-up/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();

  const signUpMutation = useMutation({
    mutationFn: AuthService.signUp,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const firstName = formData.get("first-name") as string;
    const lastName = formData.get("last-name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    await signUpMutation.mutateAsync({ email, password, firstName, lastName });

    navigate({
      to: "/auth/sign-up/verify",
      search: { email },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar uma conta</CardTitle>
        <CardDescription>Preencha as informações abaixo para criar sua conta</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="first-name">Nome</FieldLabel>
                <Input id="first-name" name="first-name" type="text" placeholder="Hugo" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="last-name">Sobrenome</FieldLabel>
                <Input id="last-name" name="last-name" type="text" placeholder="Cardoso" required />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" name="email" type="email" placeholder="hugo@example.com" required />
              <FieldDescription>
                Usaremos este email apenas para contatá-lo. Não compartilharemos seu email com ninguém.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <Input id="password" name="password" type="password" required />
              <FieldDescription>Deve ter pelo menos 8 caracteres.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">Confirmar Senha</FieldLabel>
              <Input id="confirm-password" name="confirm-password" type="password" required />
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Criar Conta</Button>
                <FieldDescription className="px-6 text-center">
                  Já tem uma conta? <Route.Link to="/auth/sign-in">Entrar</Route.Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
