import type { InferSelectModel } from "drizzle-orm";

import type { transactionCategoryTable } from "../db/schema/index.js";
import type { TransactionCategoryResponse } from "../types/transaction-category.js";

export class TransactionCategoryMapper {
  static repoToResponse(category: InferSelectModel<typeof transactionCategoryTable>): TransactionCategoryResponse {
    return {
      id: category.id,
      name: category.name,
    };
  }
}
