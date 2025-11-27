import { useMutation } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransactionsCategories } from "@/hooks/queries/useTransactionsCategories";
import { TransactionService } from "@/services/TransactionService";

type AddTransactionDialogProps = {
  children: React.ReactNode;
  onSuccess: () => void;
};

type RecurrenceType = "none" | "weekly" | "monthly" | "yearly";

export function AddTransactionDialog(props: AddTransactionDialogProps) {
  const { month, year } = useSearch({ from: "/_authenticated/dashboard/transactions/" });
  const [open, setOpen] = useState(false);

  const [recurrence, setRecurrence] = useState<RecurrenceType>("none");

  const createTransactionMutation = useMutation({
    mutationKey: ["create-transaction"],
    mutationFn: TransactionService.createTransaction,
  });

  const transactionsCategoriesQuery = useTransactionsCategories();

  const transactionsCategories = transactionsCategoriesQuery.data ?? [];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const type = formData.get("type") as "income" | "expense";
    const amount = formData.get("amount") as string;
    const month = formData.get("month") as string;
    const year = formData.get("year") as string;
    const recurrence = formData.get("recurrence") as RecurrenceType;
    const installments = formData.get("installments") as string;

    await createTransactionMutation.mutateAsync({
      name,
      category_id: category,
      type,
      amount: Number(amount),
      date: new Date(Number(year), Number(month) - 1, 15),
      recurrence,
      installments: recurrence !== "none" ? Number(installments) : undefined,
    });

    props.onSuccess();
    setOpen(false);
  };

  const yearsList = useMemo<number[]>(() => {
    return Array.from({ length: 10 }, (_, index) => 2025 + index);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adicionar transação</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label>Nome</Label>
              <Input name="name" required />
            </div>

            <div className="grid gap-3">
              <Label>Categoria</Label>
              <Select name="category" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {transactionsCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label>Tipo</Label>
              <Select name="type" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="income">Receita</SelectItem>
                    <SelectItem value="expense">Despesa</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label>Valor</Label>
              <Input name="amount" type="number" required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-3">
                <Label>Mês</Label>
                <Select name="month" defaultValue={String(month)} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="1">Janeiro</SelectItem>
                      <SelectItem value="2">Fevereiro</SelectItem>
                      <SelectItem value="3">Março</SelectItem>
                      <SelectItem value="4">Abril</SelectItem>
                      <SelectItem value="5">Maio</SelectItem>
                      <SelectItem value="6">Junho</SelectItem>
                      <SelectItem value="7">Julho</SelectItem>
                      <SelectItem value="8">Agosto</SelectItem>
                      <SelectItem value="9">Setembro</SelectItem>
                      <SelectItem value="10">Outubro</SelectItem>
                      <SelectItem value="11">Novembro</SelectItem>
                      <SelectItem value="12">Dezembro</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label>Ano</Label>
                <Select name="year" defaultValue={String(year)} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {yearsList.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-3">
              <Label>Recorrência</Label>
              <Select
                name="recurrence"
                defaultValue={recurrence}
                onValueChange={(value) => {
                  setRecurrence(value as RecurrenceType);
                }}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {recurrence !== "none" && (
              <div className="grid gap-3">
                <Label>Quantidade de parcelas</Label>
                <Select name="installments" defaultValue="2" required>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Array.from({ length: 11 }, (_, index) => (
                        <SelectItem key={index} value={(index + 2).toString()}>
                          {index + 2}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Adicionar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
