import type { InferSelectModel } from "drizzle-orm";

import type { TransactionCategoryResponseDTO } from "../../../application/transactions/dto/TransactionCategoryResponseDTO.js";
import { TransactionCategory } from "../../../domain/transaction/entities/TransactionCategory.js";
import { Uuid } from "../../../shared/domain/value-objects/Uuid.js";
import type { transactionCategoryTable } from "../drizzle/schema/transaction-category.js";

export type TransactionCategoryDbModel = InferSelectModel<typeof transactionCategoryTable>;

export class TransactionCategoryMapper {
  static toEntity(dbModel: TransactionCategoryDbModel): TransactionCategory {
    return TransactionCategory.create({
      id: Uuid.create(dbModel.id),
      name: dbModel.name,
    });
  }

  static toResponseDTO(category: TransactionCategory): TransactionCategoryResponseDTO {
    return {
      id: category.id.value,
      name: category.name,
    };
  }
}
