import { Badge, Button, Card, Group, Image, Text } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App, ssr: true });

function App() {
  return (
    <div className="container mx-auto flex flex-col gap-2">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Image
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
            height={160}
            alt="Norway"
          />
        </Card.Section>

        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500}>Norway Fjord Adventures</Text>
          <Badge color="pink">On Sale</Badge>
        </Group>

        <Text size="sm" c="dimmed">
          With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around
          the fjords of Norway
        </Text>

        <Button
          color="blue"
          fullWidth
          mt="md"
          radius="md"
          renderRoot={(props) => <Route.Link to="/auth/sign-in" {...props} />}
        >
          Sign in
        </Button>
      </Card>
    </div>
  );
}
