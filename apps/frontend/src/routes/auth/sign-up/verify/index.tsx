import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { AuthService } from "@/services/AuthService";

const verifySearchSchema = z.object({
  email: z.email().optional(),
  code: z.coerce.string().optional(),
});

export const Route = createFileRoute("/auth/sign-up/verify/")({
  component: RouteComponent,
  validateSearch: zodValidator(verifySearchSchema),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  const [otp, setOtp] = useState(search.code ?? "");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [email, setEmail] = useState(search.email ?? "");
  const [emailConfirmed, setEmailConfirmed] = useState(!!search.email);

  const verifyMutation = useMutation({
    mutationFn: () => AuthService.verifyEmailOtp(email, otp),
    onSuccess: () => {
      setTimeout(() => {
        navigate({ to: "/auth/sign-in" });
      }, 2000);
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => AuthService.resendEmailOtp(email),
    onMutate: () => {
      setResendCooldown(60);
      setOtp("");
    },
  });

  useEffect(() => {
    if (otp.length === 6 && emailConfirmed && !verifyMutation.isPending) {
      verifyMutation.mutate();
    }
  }, [otp, emailConfirmed]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setEmailConfirmed(true);
    }
  };

  if (!emailConfirmed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verificar seu e-mail</CardTitle>
          <CardDescription>
            Informe o e-mail que você usou no cadastro para receber o código de verificação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full">
              Continuar
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Ainda não tem conta?{" "}
              <Route.Link to="/auth/sign-up" className="underline">
                Cadastre-se
              </Route.Link>
            </p>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verificar seu e-mail</CardTitle>
        <CardDescription>
          <p>Enviamos um código de 6 dígitos para: </p>
          <p className="text-sm font-bold">{email}</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            pattern={REGEXP_ONLY_DIGITS}
            disabled={verifyMutation.isPending || verifyMutation.isSuccess}
            autoFocus
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {verifyMutation.isError && (
          <p className="text-sm text-red-500 text-center">Código inválido ou expirado. Tente novamente.</p>
        )}

        {verifyMutation.isSuccess && (
          <p className="text-sm text-green-500 text-center">E-mail verificado! Redirecionando para login...</p>
        )}

        <div className="flex flex-col gap-2">
          <Button
            onClick={() => resendMutation.mutate()}
            disabled={resendCooldown > 0 || resendMutation.isPending}
            variant="outline"
            className="w-full"
          >
            {resendCooldown > 0 ? `Reenviar código em ${resendCooldown}s` : "Reenviar código"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            E-mail errado?{" "}
            <Route.Link to="/auth/sign-up" className="underline">
              Cadastre-se novamente
            </Route.Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
