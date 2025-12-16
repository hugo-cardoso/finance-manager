import { AppShell, Burger, Group } from "@mantine/core";
import { usePrivateLayout } from "./hooks/usePrivateLayout";

type PrivateLayoutContentProps = {
  title: string;
  children: React.ReactNode;
};

export function PrivateLayoutContent(props: PrivateLayoutContentProps) {
  const { opened, toggle } = usePrivateLayout();

  return (
    <>
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          {props.title}
        </Group>
      </AppShell.Header>
      <AppShell.Main bg="dark.9" className="flex flex-col">
        {props.children}
      </AppShell.Main>
    </>
  );
}
