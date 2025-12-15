import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { addMonths, subMonths } from "date-fns";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
        <IconChevronLeft />
      </Button>
      <p>
        {formattedMonth}/{year}
      </p>
      <Button variant="outline" size="icon" onClick={handleNextMonth}>
        <IconChevronRight />
      </Button>
    </div>
  );
}
