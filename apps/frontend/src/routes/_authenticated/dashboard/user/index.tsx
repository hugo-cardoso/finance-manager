import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { AppSidebarContent } from "@/components/app-sidebar-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSuspenseUser } from "@/hooks/queries/useUser";
import { UserService } from "@/services/UserService";

export const Route = createFileRoute("/_authenticated/dashboard/user/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useSuspenseUser();
  const changePasswordMutation = useMutation({
    mutationFn: UserService.changePassword,
  });

  const handlePasswordChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const currentPassword = formData.get("current-password") as string;
    const newPassword = formData.get("new-password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (newPassword !== confirmPassword) {
      throw new Error("As senhas não coincidem.");
    }

    await changePasswordMutation.mutateAsync({
      currentPassword,
      newPassword,
    });

    (event.target as HTMLFormElement).reset();
  };

  const fullName = `${user.first_name} ${user.last_name}`.trim();

  return (
    <AppSidebarContent title="Conta">
      <div className="px-4 py-5 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da conta</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldTitle>ID</FieldTitle>
                <FieldContent>
                  <span className="text-sm font-mono text-muted-foreground">{user.id}</span>
                </FieldContent>
              </Field>

              <Field>
                <FieldTitle>Nome</FieldTitle>
                <FieldContent>
                  <span className="text-sm">{fullName || "Não informado"}</span>
                </FieldContent>
              </Field>

              <Field>
                <FieldTitle>Email</FieldTitle>
                <FieldContent>
                  <span className="text-sm">{user.email}</span>
                </FieldContent>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alterar senha</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handlePasswordChange}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="current-password">Senha atual</FieldLabel>
                  <Input id="current-password" name="current-password" type="password" required minLength={8} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="new-password">Nova senha</FieldLabel>
                  <Input id="new-password" name="new-password" type="password" required minLength={8} />
                  <FieldDescription>Deve ter pelo menos 8 caracteres.</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirm-password">Confirmar nova senha</FieldLabel>
                  <Input id="confirm-password" name="confirm-password" type="password" required minLength={8} />
                </Field>

                <Field>
                  <Button type="submit" disabled={changePasswordMutation.isPending}>
                    Salvar nova senha
                  </Button>

                  {changePasswordMutation.isSuccess ? (
                    <FieldDescription className="text-green-600">Senha atualizada com sucesso.</FieldDescription>
                  ) : null}

                  {changePasswordMutation.isError ? (
                    <FieldDescription className="text-destructive">Erro ao atualizar a senha.</FieldDescription>
                  ) : null}
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppSidebarContent>
  );
}
