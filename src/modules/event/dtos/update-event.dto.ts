import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class UpdateEventDto {

  @ApiProperty({default:  "title updated "})
  @IsNotEmpty()
  @IsString()
  title?: string;

  @ApiProperty({default:  "description updated "})
  @IsString()
  description?: string;

  @ApiProperty({default:  "2026-08-19"})
  @IsString()
  date?: Date;
}
