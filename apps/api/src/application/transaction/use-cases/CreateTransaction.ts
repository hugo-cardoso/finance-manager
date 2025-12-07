import { addMonths } from "date-fns";
import type { CreateTransactionDTO } from "#application/transaction/dto/CreateTransactionDTO.js";
import { Bill } from "#domain/bill/entities/Bill.js";
import type { IBillRepository } from "#domain/bill/repositories/iBillRepository.js";
import { Transaction } from "#domain/transaction/entities/Transaction.js";
import type { ITransactionCategoryRepository } from "#domain/transaction/repositories/ITransactionCategoryRepository.js";
import type { ITransactionRepository } from "#domain/transaction/repositories/ITransactionRepository.js";
import { Uuid } from "#shared/domain/value-objects/Uuid.js";

export class CreateTransaction {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly transactionCategoryRepository: ITransactionCategoryRepository,
    private readonly billRepository: IBillRepository,
  ) {}

  async execute(data: CreateTransactionDTO): Promise<Transaction> {
    const category = await this.transactionCategoryRepository.findById(data.categoryId);

    if (!category) {
      throw new Error("Category not found");
    }

    if (data.recurrence === "recurring") {
      const dayOfMonth = data.date.getDate();

      const bill = Bill.create({
        id: Uuid.generate(),
        name: data.name,
        description: data.description,
        amount: data.amount,
        dayOfMonth: dayOfMonth,
        category: category,
        startDate: data.date,
        endDate: data.endDate,
        isActive: true,
      });

      const transaction = Transaction.create({
        id: Uuid.generate(),
        name: data.name,
        description: data.description,
        category: category,
        amount: data.amount,
        date: data.date,
        bill: bill,
        recurrence: "recurring",
      });

      await this.billRepository.create(bill);

      return this.transactionRepository.create(transaction);
    }

    if (data.recurrence === "installment") {
      if (!data.installments || data.installments < 2) {
        throw new Error("Installments are required for installment recurrence");
      }

      const transactions: Transaction[] = [];
      const amountPerInstallment = (data.amount / data.installments).toFixed(2);
      const groupId = Uuid.generate();

      for (let i = 1; i <= data.installments; i++) {
        const transaction = Transaction.create({
          id: Uuid.generate(),
          groupId: groupId,
          name: data.name,
          description: data.description,
          category: category,
          amount: Number(amountPerInstallment),
          date: addMonths(data.date, i - 1),
          installment: {
            number: i,
            total: data.installments,
          },
          recurrence: "installment",
        });

        transactions.push(transaction);
      }

      const response = await this.transactionRepository.createMany(transactions);

      return response[0];
    }

    const transaction = Transaction.create({
      id: Uuid.generate(),
      name: data.name,
      description: data.description,
      category: category,
      amount: data.amount,
      date: data.date,
      recurrence: "once",
    });

    return this.transactionRepository.create(transaction);
  }
}
