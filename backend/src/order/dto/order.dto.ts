import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class TicketDto {
  @IsUUID('4')
  film!: string;

  @IsUUID('4')
  session!: string;

  @IsString()
  daytime!: string;

  @IsInt()
  @Min(1)
  row!: number;

  @IsInt()
  @Min(1)
  seat!: number;

  @IsNumber()
  price!: number;
}

export class CreateOrderDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets!: TicketDto[];
}

export class OrderTicketDto extends TicketDto {
  id!: string;
}

export class OrderResponseDto {
  total!: number;
  items!: OrderTicketDto[];
}
