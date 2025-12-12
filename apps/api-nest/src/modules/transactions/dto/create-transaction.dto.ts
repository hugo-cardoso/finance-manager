import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from "class-validator";

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  category_id: string;

  @IsString()
  @IsIn(["single", "installment", "recurrence"])
  @IsNotEmpty()
  recurrence: "single" | "installment" | "recurrence";

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Min(2)
  installments?: number;
}
