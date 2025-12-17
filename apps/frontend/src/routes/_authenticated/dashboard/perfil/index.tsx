import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconId, IconMail, IconUser } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useUserSuspenseQuery } from "@/hooks/queries/useUserQuery";
import { PrivateLayoutContent } from "@/layouts/PrivateLayout/content";
import { UserService } from "@/services/UserService";

export const Route = createFileRoute("/_authenticated/dashboard/perfil/")({
  component: () => (
    <PrivateLayoutContent title="Perfil">
      <RouteComponent />
    </PrivateLayoutContent>
  ),
});

function RouteComponent() {
  const user = useUserSuspenseQuery();
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
    },
    validate: {
      firstName: (value) => (value.trim().length > 0 ? null : "Informe o primeiro nome"),
      lastName: (value) => (value.trim().length > 0 ? null : "Informe o sobrenome"),
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: UserService.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      close();
    },
  });

  const handleOpenModal = () => {
    const nameParts = user.data.name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    form.setValues({ firstName, lastName });
    open();
  };

  const handleSubmit = (values: typeof form.values) => {
    updateUserMutation.mutate({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Editar Nome" centered>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput label="Primeiro Nome" placeholder="Ex: João" required {...form.getInputProps("firstName")} />
            <TextInput label="Sobrenome" placeholder="Ex: Silva" required {...form.getInputProps("lastName")} />
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={close}>
                Cancelar
              </Button>
              <Button type="submit" loading={updateUserMutation.isPending}>
                Salvar
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Box p="md">
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="xl">
            <Group>
              <Avatar size={80} radius="md" color="blue" variant="filled">
                {getInitials(user.data.name)}
              </Avatar>
              <Stack gap="xs">
                <Group gap="xs">
                  <Title order={2}>{user.data.name}</Title>
                  <ActionIcon variant="subtle" color="gray" onClick={handleOpenModal}>
                    <IconEdit size={18} />
                  </ActionIcon>
                </Group>
                <Badge size="lg" variant="light" color="blue">
                  Usuário Ativo
                </Badge>
              </Stack>
            </Group>

            <Divider />

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
    </>
  );
}
