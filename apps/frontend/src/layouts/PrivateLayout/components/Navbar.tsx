import { AppShell, Button, Flex, NavLink, Stack, Title } from "@mantine/core";
import { IconDashboard, IconReceipt, IconUser, type TablerIcon } from "@tabler/icons-react";
import { Link, type LinkOptions } from "@tanstack/react-router";
import { usePrivateLayout } from "../hooks/usePrivateLayout";

type NavItem = {
  label: string;
  icon: TablerIcon;
  link?: LinkOptions;
  items?: NavSubItem[];
};

type NavSubItem = {
  label: string;
  link: LinkOptions;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    icon: IconDashboard,
    link: { to: "/dashboard" },
  },
  {
    label: "Transações",
    icon: IconReceipt,
    items: [
      {
        label: "Listagem",
        link: { to: "/dashboard/transacoes" },
      },
    ],
  },
  {
    label: "Perfil",
    icon: IconUser,
    link: { to: "/dashboard/perfil" },
  },
];

export function Navbar() {
  const { toggle } = usePrivateLayout();

  return (
    <AppShell.Navbar p="md">
      <Flex direction="column" justify="space-between" h="100%">
        <Stack gap="md">
          <Title order={3} mb="md">
            Finance Manager
          </Title>

          <Stack gap="xs">
            {NAV_ITEMS.map((item) =>
              item.link ? (
                <NavLink
                  key={item.label}
                  label={item.label}
                  leftSection={<item.icon size={20} stroke={1.5} />}
                  renderRoot={(props) => (
                    <Link {...props} {...item.link} activeOptions={{ exact: true }} onClick={toggle} />
                  )}
                  className="rounded-md"
                />
              ) : (
                <NavLink
                  key={item.label}
                  label={item.label}
                  leftSection={<item.icon size={20} stroke={1.5} />}
                  className="rounded-md"
                >
                  <Stack gap={0}>
                    {item.items?.map((subItem) => (
                      <NavLink
                        key={subItem.label}
                        label={subItem.label}
                        renderRoot={(props) => <Link {...props} {...subItem.link} />}
                        active={false}
                        onClick={toggle}
                        className="rounded-md"
                      />
                    ))}
                  </Stack>
                </NavLink>
              ),
            )}
          </Stack>
        </Stack>

        <Button
          variant="filled"
          color="red"
          radius="md"
          size="xs"
          renderRoot={(props) => <Link {...props} to="/auth/sign-out" preload={false} />}
        >
          Sair
        </Button>
      </Flex>
    </AppShell.Navbar>
  );
}
