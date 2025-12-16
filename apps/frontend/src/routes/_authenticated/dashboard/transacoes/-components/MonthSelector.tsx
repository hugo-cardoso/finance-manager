import { Button } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { addMonths, subMonths } from "date-fns";
import { useEffect, useState } from "react";

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

  const formattedMonth = String(month).padStart(2, "0");

  return (
    <Button.Group>
      <Button variant="default" radius="md" onClick={handlePreviousMonth}>
        <IconChevronLeft />
      </Button>
      <Button.GroupSection variant="default" bg="var(--mantine-color-body)" miw={80}>
        {formattedMonth}/{year}
      </Button.GroupSection>
      <Button variant="default" radius="md" onClick={handleNextMonth}>
        <IconChevronRight />
      </Button>
    </Button.Group>
  );
}
