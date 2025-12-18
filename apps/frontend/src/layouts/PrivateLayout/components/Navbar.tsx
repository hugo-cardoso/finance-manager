import {
  ActionIcon,
  AppShell,
  Button,
  Flex,
  Group,
  NavLink,
  Stack,
  Switch,
  ThemeIcon,
  Title,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconDashboard,
  IconLayoutSidebarLeftCollapse,
  IconMoonStars,
  IconPigMoney,
  IconReceipt,
  IconSun,
  IconUser,
  type TablerIcon,
} from "@tabler/icons-react";
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
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark", { getInitialValueInEffect: true });

  return (
    <AppShell.Navbar p="md">
      <Flex direction="column" justify="space-between" h="100%">
        <Stack gap="md">
          <Group align="center" justify="space-between">
            <Group align="center">
              <ThemeIcon>
                <IconPigMoney />
              </ThemeIcon>
              <Title order={4}>Finance Manager</Title>
            </Group>
            <ActionIcon
              variant="transparent"
              color="gray"
              onClick={toggle}
              display={{
                sm: "none",
              }}
            >
              <IconLayoutSidebarLeftCollapse />
            </ActionIcon>
          </Group>

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

        <Stack gap="md">
          <Switch
            size="md"
            color="dark.4"
            onLabel={<IconSun size={16} stroke={2.5} color="var(--mantine-color-yellow-4)" />}
            offLabel={<IconMoonStars size={16} stroke={2.5} color="var(--mantine-color-blue-6)" />}
            checked={computedColorScheme === "dark"}
            onChange={() => setColorScheme(computedColorScheme === "dark" ? "light" : "dark")}
          />
          <Button
            variant="filled"
            color="red"
            radius="md"
            size="xs"
            renderRoot={(props) => <Link {...props} to="/auth/sign-out" preload={false} />}
          >
            Sair
          </Button>
        </Stack>
      </Flex>
    </AppShell.Navbar>
  );
}
