import { addMonths, format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type MonthCarrouselProps = {
  defaultDate: Date;
  onChange?: (values: { month: number; year: number }) => void;
};

export function MonthCarrousel({ defaultDate, onChange }: MonthCarrouselProps) {
  const [date, setDate] = useState<Date>(defaultDate);

  const isMobile = useIsMobile();

  const handlePrevMonth = () => {
    setDate(prevDate);
    onChange?.({ month: prevDate.getMonth() + 1, year: prevDate.getFullYear() });
  };

  const handleNextMonth = () => {
    setDate(nextDate);
    onChange?.({ month: nextDate.getMonth() + 1, year: nextDate.getFullYear() });
  };

  const handleSetDate = (date: Date) => {
    setDate(date);
    onChange?.({ month: date.getMonth() + 1, year: date.getFullYear() });
  };

  const prevDate = useMemo(() => {
    return subMonths(date, 1);
  }, [date]);

  const nextDate = useMemo(() => {
    return addMonths(date, 1);
  }, [date]);

  return (
    <div className="w-full grid grid-cols-[100px_1fr_100px] gap-4">
      <Button className="w-full h-full" variant="outline" size="icon" onClick={handlePrevMonth}>
        <ArrowLeft />
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-center">
        {!isMobile && <MonthCarrouselItem date={prevDate} onClick={handleSetDate} />}
        <MonthCarrouselItem date={date} isActive />
        {!isMobile && <MonthCarrouselItem date={nextDate} onClick={handleSetDate} />}
      </div>
      <Button className="w-full h-full" variant="outline" size="icon" onClick={handleNextMonth}>
        <ArrowRight />
      </Button>
    </div>
  );
}

type MonthCarrouselItemProps = {
  date: Date;
  isActive?: boolean;
  onClick?: (date: Date) => void;
};

function MonthCarrouselItem(props: MonthCarrouselItemProps) {
  return (
    <Button
      className="capitalize h-auto"
      variant={props.isActive ? "default" : "secondary"}
      onClick={() => props.onClick?.(props.date)}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <span className="font-bold">{format(props.date, "MMMM", { locale: ptBR })}</span>
          <span className={cn("text-xs", props.isActive ? "text-secondary/90" : "text-muted-foreground")}>
            {format(props.date, "yyyy", { locale: ptBR })}
          </span>
        </div>
      </div>
    </Button>
  );
}
