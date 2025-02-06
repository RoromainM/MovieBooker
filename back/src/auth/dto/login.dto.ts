import { ApiProperty } from "@nestjs/swagger";
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'The username of the user', required: true, example: 'john_doe' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'The password of the user', required: true, example: 'password123' })
  @IsString()
  password: string;
}