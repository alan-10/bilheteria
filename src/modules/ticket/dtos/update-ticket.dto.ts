import { IsNotEmpty, Min, IsInt } from "class-validator"
import { ApiProperty } from "@nestjs/swagger";


export class UpdateTicketDto {
  @ApiProperty()
  @IsNotEmpty()
  event: string

  @ApiProperty()
  @IsNotEmpty()
  price: number

  @ApiProperty()
  @IsInt()
  @Min(1)
  seat: number
}