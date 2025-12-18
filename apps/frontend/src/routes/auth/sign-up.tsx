import { Button, Center, Paper, Stack, Text, Title, useComputedColorScheme } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  const colorScheme = useComputedColorScheme("dark", { getInitialValueInEffect: true });

  return (
    <Center style={{ minHeight: "100vh" }} bg={colorScheme === "dark" ? "dark.8" : "gray.2"}>
      <Paper shadow="md" p="xl" radius="md" withBorder style={{ width: "100%", maxWidth: "420px" }}>
        <Stack gap="lg">
          <Stack gap="xs">
            <Title order={2} ta="center">
              Criar conta
            </Title>
            <Text c="dimmed" size="sm" ta="center">
              Cadastro ainda não está disponível nesta versão.
            </Text>
          </Stack>

          <Button variant="default" renderRoot={(props) => <Route.Link to="/" {...props} />}>
            Voltar
          </Button>
        </Stack>
      </Paper>
    </Center>
  );
}
