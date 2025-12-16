import { MantineProvider as MantineProviderBase } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import { mantineTheme } from "./theme";

export function MantineProvider(props: React.PropsWithChildren) {
  return (
    <MantineProviderBase theme={mantineTheme} defaultColorScheme="dark">
      {props.children}
      <Notifications position="bottom-right" />
    </MantineProviderBase>
  );
}
