import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useEffect } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { AuthService } from "@/services/AuthService";

const confirmSignUpSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const Route = createFileRoute("/auth/sign-up/confirm/")({
  component: RouteComponent,
  validateSearch: zodValidator(confirmSignUpSchema),
});

function RouteComponent() {
  const { token } = Route.useSearch();

  const confirmSignUpMutation = useMutation({
    mutationFn: AuthService.confirmSignUp,
  });

  useEffect(() => {
    confirmSignUpMutation.mutate(token);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirmar sua conta</CardTitle>
      </CardHeader>
      <CardContent>
        {confirmSignUpMutation.isPending && (
          <div className="flex items-center justify-center h-[200px]">
            <Spinner className="size-6" />
          </div>
        )}

        {confirmSignUpMutation.isSuccess && (
          <div className="flex flex-col gap-4">
            <p>Sua conta foi confirmada com sucesso.</p>
            <Button asChild>
              <Route.Link to="/auth/sign-in">Entrar</Route.Link>
            </Button>
          </div>
        )}

        {confirmSignUpMutation.isError && (
          <div className="flex flex-col gap-4">
            <p>Ocorreu um erro ao confirmar sua conta. Por favor, tente novamente.</p>
            <Button asChild>
              <Route.Link to="/auth/sign-up">Criar conta</Route.Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
