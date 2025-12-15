import { IconCalendar, IconChevronsDown, IconChevronsUp } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCategoriesQuery } from "@/hooks/queries/useCategoriesQuery";
import { cn } from "@/lib/utils";
import { TransactionsService } from "@/services/TransactionsService";

type CreateTransactionDrawerProps = {
  children: React.ReactElement;
  onCreate: () => void;
};

export function CreateTransactionDrawer(props: CreateTransactionDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const categoriesQuery = useCategoriesQuery();
  const [type, setType] = useState<"single" | "installment">("single");

  const createTransactionMutation = useMutation({
    mutationKey: ["create-transaction"],
    mutationFn: TransactionsService.createTransaction,
    onSuccess: () => {
      props.onCreate();
      setIsOpen(false);
      setDate(new Date());
      setType("single");
    },
  });

  const getCategoryById = useCallback(
    (id: string) => {
      return categoriesQuery.data?.find((category) => category.id === id);
    },
    [categoriesQuery.data],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);

      const name = formData.get("name") as string;
      const amount = formData.get("amount") as string;
      const category = formData.get("category") as string;
      const type = formData.get("type") as "single" | "installment";
      const installments = formData.get("installments") as string | undefined;

      createTransactionMutation.mutate({
        name,
        amount: Number(amount),
        date: format(date as Date, "yyyy-MM-dd"),
        categoryId: category,
        recurrence: type,
        installments: installments ? Number(installments) : undefined,
      });
    },
    [date],
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger render={props.children} />
      <SheetContent render={(props) => <form onSubmit={handleSubmit} {...props} />}>
        <SheetHeader>
          <SheetTitle>Nova transação</SheetTitle>
          <SheetDescription>Crie uma nova transação</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="date">Data</Label>
            <Popover>
              <PopoverTrigger
                render={({ className, ...props }) => (
                  <Button
                    variant="outline"
                    data-empty={!date}
                    className={cn("justify-between font-normal w-full", className)}
                    {...props}
                  />
                )}
              >
                {date ? format(date, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                <IconCalendar />
              </PopoverTrigger>

              <PopoverContent className="w-(--anchor-width) p-0" align="end">
                <Calendar className="w-full" mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="amount">Valor</Label>
            <Input id="amount" name="amount" type="number" defaultValue={0} required />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="category">Categoria</Label>
            <Select name="category" required>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string) =>
                    value && (
                      <div className="flex items-center gap-2 justify-center">
                        {getCategoryById(value)?.type === "expense" ? (
                          <IconChevronsDown className="self-center text-red-500" />
                        ) : (
                          <IconChevronsUp className="self-center text-green-500" />
                        )}
                        {getCategoryById(value)?.name}
                      </div>
                    )
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categoriesQuery.data?.map(({ id, name, type }) => (
                    <SelectItem key={id} value={id} className="flex items-center gap-2 justify-center">
                      {type === "expense" ? (
                        <IconChevronsDown className="self-center text-red-500" />
                      ) : (
                        <IconChevronsUp className="self-center text-green-500" />
                      )}
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label>Tipo</Label>
            <RadioGroup
              defaultValue="single"
              onValueChange={(value) => setType(value as "single" | "installment")}
              name="type"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single">Única</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="installment" id="installment" />
                <Label htmlFor="installment">Parcelada</Label>
              </div>
            </RadioGroup>
          </div>

          {type === "installment" && (
            <div className="grid gap-3">
              <Label htmlFor="installments">Parcelas</Label>
              <Select name="installments" defaultValue="2">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="7">7</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="9">9</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <SheetFooter>
          <Button type="submit" disabled={createTransactionMutation.isPending}>
            {createTransactionMutation.isPending ? "Criando..." : "Criar"}
          </Button>
          <SheetClose
            render={(props) => (
              <Button variant="outline" {...props}>
                Cancelar
              </Button>
            )}
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
