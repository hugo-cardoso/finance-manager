import type { InferSelectModel } from "drizzle-orm";
import type { TransactionCategoryResponseDTO } from "#application/transaction/dto/TransactionCategoryResponseDTO.js";
import { TransactionCategory } from "#domain/transaction/entities/TransactionCategory.js";
import type { TransactionType } from "#domain/transaction/enums/TransactionType.js";
import type { transactionCategoryTable } from "#infrastructure/database/drizzle/schema/transaction-category.js";
import { Uuid } from "#shared/domain/value-objects/Uuid.js";

export type TransactionCategoryDbModel = InferSelectModel<typeof transactionCategoryTable>;

export class TransactionCategoryMapper {
  static toEntity(dbModel: TransactionCategoryDbModel): TransactionCategory {
    return TransactionCategory.create({
      id: Uuid.create(dbModel.id),
      name: dbModel.name,
      icon: dbModel.icon,
      color: dbModel.color,
      type: dbModel.type as TransactionType,
    });
  }

  static toResponseDTO(category: TransactionCategory): TransactionCategoryResponseDTO {
    return {
      id: category.id.value,
      name: category.name,
      icon: category.icon,
      color: category.color,
      type: category.type,
    };
  }
}
