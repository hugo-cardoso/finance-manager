import { AppShell, Burger, Group, useComputedColorScheme } from "@mantine/core";
import { usePrivateLayout } from "./hooks/usePrivateLayout";

type PrivateLayoutContentProps = {
  title: string;
  children: React.ReactNode;
};

export function PrivateLayoutContent(props: PrivateLayoutContentProps) {
  const { opened, toggle } = usePrivateLayout();
  const colorScheme = useComputedColorScheme("dark", { getInitialValueInEffect: true });

  return (
    <>
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          {props.title}
        </Group>
      </AppShell.Header>
      <AppShell.Main bg={colorScheme === "dark" ? "dark.9" : "gray.2"} className="flex flex-col">
        {props.children}
      </AppShell.Main>
    </>
  );
}
