import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {

    @ApiProperty({ description: 'The id of the user', required: true, type: 'number', example: 1 })
    id: number;

    @ApiProperty({ description: 'The email of the user', required: true, example: 'user@example.com' })
    email: string;

    @ApiProperty({ description: 'The username of the user', required: true, example: 'john_doe' })
    username: string;

    @ApiProperty({ description: 'The password of the user', required: true, example: 'password123' })
    password: string;
}