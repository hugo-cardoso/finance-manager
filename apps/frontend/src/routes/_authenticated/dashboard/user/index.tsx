import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppSidebarContent } from "@/components/app-sidebar-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSuspenseUser } from "@/hooks/queries/useUser";
import { AuthService } from "@/services/AuthService";

export const Route = createFileRoute("/_authenticated/dashboard/user/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useSuspenseUser();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fullName = `${user.first_name} ${user.last_name}`.trim();

  const updatePasswordMutation = useMutation({
    mutationFn: AuthService.updatePassword,
  });

  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const formData = new FormData(event.target as HTMLFormElement);
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setErrorMessage("As senhas não coincidem");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    try {
      await updatePasswordMutation.mutateAsync(newPassword);
      setSuccessMessage("Senha atualizada com sucesso!");
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao atualizar senha");
    }
  };

  return (
    <AppSidebarContent title="Conta">
      <div className="px-4 py-5 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Conta</CardTitle>
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
            <CardTitle>Alterar Senha</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="newPassword">Nova Senha</FieldLabel>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Digite sua nova senha"
                    required
                    minLength={6}
                  />
                  <FieldDescription>A senha deve ter no mínimo 6 caracteres</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">Confirmar Nova Senha</FieldLabel>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirme sua nova senha"
                    required
                    minLength={6}
                  />
                </Field>

                {errorMessage && (
                  <Field>
                    <FieldDescription className="text-destructive">{errorMessage}</FieldDescription>
                  </Field>
                )}

                {successMessage && (
                  <Field>
                    <FieldDescription className="text-green-600">{successMessage}</FieldDescription>
                  </Field>
                )}

                <Field>
                  <Button type="submit" disabled={updatePasswordMutation.isPending}>
                    {updatePasswordMutation.isPending ? "Atualizando..." : "Atualizar Senha"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppSidebarContent>
  );
}
