import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class SignInDto {
  @IsNotEmpty()
  @ApiProperty({  default: "admin"})
  username: string;

  @ApiProperty({ default: "admin" })
  @IsNotEmpty()
  password: string;
}