import { AppShell } from "@mantine/core";
import { Navbar } from "./components/Navbar";
import { usePrivateLayout } from "./hooks/usePrivateLayout";

type PrivateLayoutProps = {
  children: React.ReactNode;
};

export function PrivateLayout(props: PrivateLayoutProps) {
  const { opened } = usePrivateLayout();

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <Navbar />
      {props.children}
    </AppShell>
  );
}
