import {
  Avatar,
  Card,
  Group,
  Stack,
  Text,
  Title,
  Badge,
  Box,
  Divider,
} from "@mantine/core";
import { IconUser, IconMail, IconId } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useUserSuspenseQuery } from "@/hooks/queries/useUserQuery";
import { PrivateLayoutContent } from "@/layouts/PrivateLayout/content";

export const Route = createFileRoute("/_authenticated/dashboard/perfil/")({
  component: () => (
    <PrivateLayoutContent title="Perfil">
      <RouteComponent />
    </PrivateLayoutContent>
  ),
});

function RouteComponent() {
  const user = useUserSuspenseQuery();

  // Pega as iniciais do nome para o avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box p="md">
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Stack gap="xl">
          {/* Header com avatar e nome */}
          <Group>
            <Avatar
              size={80}
              radius="md"
              color="blue"
              variant="filled"
            >
              {getInitials(user.data.name)}
            </Avatar>
            <Stack gap="xs">
              <Title order={2}>{user.data.name}</Title>
              <Badge size="lg" variant="light" color="blue">
                Usuário Ativo
              </Badge>
            </Stack>
          </Group>

          <Divider />

          {/* Informações do usuário */}
          <Stack gap="md">
            <Group gap="md" wrap="nowrap">
              <IconId size={24} stroke={1.5} />
              <Stack gap={4}>
                <Text size="xs" c="dimmed" fw={500}>
                  ID
                </Text>
                <Text size="sm" fw={500}>
                  {user.data.id}
                </Text>
              </Stack>
            </Group>

            <Group gap="md" wrap="nowrap">
              <IconUser size={24} stroke={1.5} />
              <Stack gap={4}>
                <Text size="xs" c="dimmed" fw={500}>
                  Nome
                </Text>
                <Text size="sm" fw={500}>
                  {user.data.name}
                </Text>
              </Stack>
            </Group>

            <Group gap="md" wrap="nowrap">
              <IconMail size={24} stroke={1.5} />
              <Stack gap={4}>
                <Text size="xs" c="dimmed" fw={500}>
                  Email
                </Text>
                <Text size="sm" fw={500}>
                  {user.data.email}
                </Text>
              </Stack>
            </Group>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}
