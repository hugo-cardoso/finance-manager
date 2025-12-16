import { Button, Drawer, Group, NumberInput, Radio, Select, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronsDown, IconChevronsUp } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { cloneElement, useCallback, useMemo } from "react";
import { useCategoriesQuery } from "@/hooks/queries/useCategoriesQuery";
import { TransactionsService } from "@/services/TransactionsService";

type CreateTransactionDrawerProps = {
  children: React.ReactElement<{
    onClick?: React.MouseEventHandler;
    type?: "button" | "submit" | "reset";
  }>;
  onCreate?: () => void;
};

export function CreateTransactionDrawer(props: CreateTransactionDrawerProps) {
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);

  const categoriesQuery = useCategoriesQuery();
  const todayIso = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  const form = useForm({
    initialValues: {
      name: "",
      date: todayIso,
      amount: 0,
      categoryId: "",
      recurrence: "single" as "single" | "installment",
      installments: 2,
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : "Informe um nome"),
      date: (value) => (value ? null : "Informe uma data"),
      amount: (value) => (typeof value === "number" && Number.isFinite(value) ? null : "Informe um valor"),
      categoryId: (value) => (value ? null : "Selecione uma categoria"),
      installments: (value, values) =>
        values.recurrence === "installment" && (!value || value < 2) ? "Selecione as parcelas" : null,
    },
  });

  const createTransactionMutation = useMutation({
    mutationKey: ["create-transaction"],
    mutationFn: TransactionsService.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      props.onCreate?.();
      close();
      form.setValues({
        name: "",
        date: todayIso,
        amount: 0,
        categoryId: "",
        recurrence: "single",
        installments: 2,
      });
    },
  });

  const categoriesById = useMemo(() => {
    return new Map(categoriesQuery.data?.map((c) => [c.id, c]) ?? []);
  }, [categoriesQuery.data]);

  const selectedCategory = useMemo(() => {
    return form.values.categoryId ? categoriesById.get(form.values.categoryId) : undefined;
  }, [categoriesById, form.values.categoryId]);

  const handleSubmit = useCallback(
    (values: typeof form.values) => {
      createTransactionMutation.mutate({
        name: values.name,
        amount: values.amount,
        date: values.date,
        categoryId: values.categoryId,
        recurrence: values.recurrence,
        installments: values.recurrence === "installment" ? values.installments : undefined,
      });
    },
    [createTransactionMutation],
  );

  return (
    <>
      {/** Trigger (botão vindo de fora) */}
      {cloneElement(props.children, {
        onClick: (event: React.MouseEvent) => {
          props.children.props.onClick?.(event);
          open();
        },
        type: "button",
      })}

      <Drawer opened={opened} onClose={close} title="Nova transação" position="right" size="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Text c="dimmed" size="sm">
              Crie uma nova transação
            </Text>

            <TextInput label="Nome" placeholder="Ex: Mercado" required {...form.getInputProps("name")} />

            <TextInput label="Data" type="date" required {...form.getInputProps("date")} />

            <NumberInput
              label="Valor"
              required
              min={0}
              decimalScale={2}
              fixedDecimalScale={false}
              {...form.getInputProps("amount")}
            />

            <Select
              label="Categoria"
              placeholder={categoriesQuery.isLoading ? "Carregando..." : "Selecione"}
              required
              data={(categoriesQuery.data ?? []).map((c) => ({ value: c.id, label: c.name }))}
              leftSection={
                selectedCategory ? (
                  selectedCategory.type === "expense" ? (
                    <IconChevronsDown size={16} color="var(--mantine-color-red-6)" />
                  ) : (
                    <IconChevronsUp size={16} color="var(--mantine-color-green-6)" />
                  )
                ) : null
              }
              renderOption={({ option }) => {
                const category = categoriesById.get(option.value);
                return (
                  <Group gap="xs" wrap="nowrap">
                    {category?.type === "expense" ? (
                      <IconChevronsDown size={16} color="var(--mantine-color-red-6)" />
                    ) : (
                      <IconChevronsUp size={16} color="var(--mantine-color-green-6)" />
                    )}
                    <Text size="sm">{option.label}</Text>
                  </Group>
                );
              }}
              {...form.getInputProps("categoryId")}
            />

            <Radio.Group label="Tipo" {...form.getInputProps("recurrence")}>
              <Group mt="xs">
                <Radio value="single" label="Única" />
                <Radio value="installment" label="Parcelada" />
              </Group>
            </Radio.Group>

            {form.values.recurrence === "installment" && (
              <Select
                label="Parcelas"
                required
                data={[2, 3, 4, 5, 6, 7, 8, 9].map((n) => ({ value: String(n), label: String(n) }))}
                value={String(form.values.installments)}
                onChange={(value) => form.setFieldValue("installments", value ? Number(value) : 2)}
                error={form.errors.installments}
              />
            )}

            <Group justify="flex-end" mt="sm">
              <Button variant="default" onClick={close}>
                Cancelar
              </Button>
              <Button type="submit" loading={createTransactionMutation.isPending}>
                Criar
              </Button>
            </Group>
          </Stack>
        </form>
      </Drawer>
    </>
  );
}
