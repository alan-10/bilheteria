import { IsNotEmpty, IsString } from 'class-validator';


export class UpdateEventDto {

  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsString()
  description?: string;

  @IsString()
  date?: Date;
}
