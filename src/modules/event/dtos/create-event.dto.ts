import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";


export class CreateEventDto {
  @ApiProperty({description: 'title test', format: 'string'})
  @IsNotEmpty()
  title: string;

  @ApiProperty({description: 'description test', format: 'string'})
  @IsNotEmpty()
  description: string;

  @ApiProperty({description: '2025-08-25', format: 'date'})
  @IsNotEmpty()
  date: Date;
}