import { atom, useAtom } from "jotai";
import { useCallback } from "react";

const openedAtom = atom(false);

export const usePrivateLayout = () => {
  const [opened, setOpened] = useAtom(openedAtom);

  const toggle = useCallback(() => {
    setOpened((opened) => !opened);
  }, [setOpened]);

  return {
    opened,
    toggle,
  };
};
