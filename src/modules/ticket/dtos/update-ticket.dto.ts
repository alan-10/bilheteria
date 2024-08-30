import { IsNotEmpty, Min, IsInt } from "class-validator"


export class UpdateTicketDto {
  @IsNotEmpty()
  event: string

  @IsNotEmpty()
  price: number

  @IsInt()
  @Min(1)
  seat: number
}