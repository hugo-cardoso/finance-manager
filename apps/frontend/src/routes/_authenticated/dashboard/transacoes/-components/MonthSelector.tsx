import { Button } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { addMonths, subMonths } from "date-fns";
import { useEffect, useMemo, useState } from "react";

type MonthSelectorProps = {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
};

export function MonthSelector(props: MonthSelectorProps) {
  const { month, year } = props;
  const [date, setDate] = useState(new Date(year, month - 1, 1));

  const handleNextMonth = () => {
    setDate(addMonths(date, 1));
  };

  const handlePreviousMonth = () => {
    setDate(subMonths(date, 1));
  };

  useEffect(() => {
    props.onChange(date.getMonth() + 1, date.getFullYear());
  }, [date]);

  const monthLabel = useMemo(() => {
    const dateFormatted = new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
    }).format(date);

    return dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);
  }, [date]);

  return (
    <Button.Group display={{ xs: "flex", md: "block" }} flex={{ xs: 1 }}>
      <Button variant="default" radius="md" onClick={handlePreviousMonth}>
        <IconChevronLeft />
      </Button>
      <Button.GroupSection className="flex-1" variant="default" bg="var(--mantine-color-body)" miw={80}>
        {monthLabel}
      </Button.GroupSection>
      <Button variant="default" radius="md" onClick={handleNextMonth}>
        <IconChevronRight />
      </Button>
    </Button.Group>
  );
}
