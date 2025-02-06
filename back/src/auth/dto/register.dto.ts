import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterDto {

    @ApiProperty({ description: 'The email of the user', required: true, example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'The username of the user', required: true, example: 'john_doe' })
    @IsString()
    username: string;

    @ApiProperty({ description: 'The password of the user', required: true, example: 'password123' })
    @IsString()
    @MinLength(6)
    password: string;
}