import {
  Anchor,
  Button,
  Center,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  useComputedColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AuthService } from "@/services/AuthService";

export const Route = createFileRoute("/auth/sign-in")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const colorScheme = useComputedColorScheme("dark", { getInitialValueInEffect: true });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : "E-mail inválido"),
      password: (value: string) => (value.length >= 6 ? null : "Senha deve ter pelo menos 6 caracteres"),
    },
  });

  const signInMutation = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: (data: { email: string; password: string }) => AuthService.signIn(data.email, data.password),
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const auth = await signInMutation.mutateAsync(values);

      cookieStore.set({
        name: "access_token",
        value: auth.access_token,
        sameSite: "strict",
        path: "/",
      });

      cookieStore.set({
        name: "refresh_token",
        value: auth.refresh_token,
        sameSite: "strict",
        path: "/",
      });

      navigate({ to: "/dashboard" });
    } catch {
      form.setErrors({
        email: "E-mail ou senha inválidos",
        password: "E-mail ou senha inválidos",
      });
    }
  };

  return (
    <Center style={{ minHeight: "100vh" }} bg={colorScheme === "dark" ? "dark.8" : "gray.2"}>
      <Paper shadow="md" p="xl" radius="md" withBorder style={{ width: "100%", maxWidth: "420px" }}>
        <Stack gap="lg">
          <Stack gap="xs">
            <Title order={2} ta="center">
              Bem-vindo de volta
            </Title>
            <Text c="dimmed" size="sm" ta="center">
              Faça login para continuar
            </Text>
          </Stack>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="seu@email.com"
                required
                key={form.key("email")}
                {...form.getInputProps("email")}
              />

              <PasswordInput
                label="Senha"
                placeholder="Sua senha"
                required
                key={form.key("password")}
                {...form.getInputProps("password")}
              />

              <Button type="submit" fullWidth loading={signInMutation.isPending || signInMutation.isSuccess}>
                Entrar
              </Button>
            </Stack>
          </form>

          <Text c="dimmed" size="sm" ta="center">
            Não tem uma conta?{" "}
            <Anchor renderRoot={(props) => <Route.Link to="/auth/sign-up" {...props} />}>Cadastre-se</Anchor>
          </Text>
        </Stack>
      </Paper>
    </Center>
  );
}
