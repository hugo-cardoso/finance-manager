import { Button, Center, Group, Paper, Stack, Text, Title, useComputedColorScheme } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: RouteComponent, ssr: true });

function RouteComponent() {
  const colorScheme = useComputedColorScheme("dark", { getInitialValueInEffect: true });
  return (
    <Center style={{ minHeight: "100vh" }} bg={colorScheme === "dark" ? "dark.8" : "gray.2"}>
      <Paper shadow="md" p="xl" radius="md" withBorder style={{ width: "100%", maxWidth: "520px" }}>
        <Stack gap="lg">
          <Stack gap="xs">
            <Title order={2} ta="center">
              Finance Manager
            </Title>
            <Text c="dimmed" ta="center">
              Controle suas finanças com simplicidade.
            </Text>
          </Stack>

          <Group grow>
            <Button renderRoot={(props) => <Route.Link to="/auth/sign-in" {...props} />}>Entrar</Button>
            <Button variant="light" renderRoot={(props) => <Route.Link to="/auth/sign-up" {...props} />}>
              Criar conta
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Center>
  );
}
