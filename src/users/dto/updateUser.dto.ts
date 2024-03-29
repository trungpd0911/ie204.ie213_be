import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class updateUserDto {
    @ApiProperty({ example: "updated username" })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ example: "updated email" })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({ example: "updated gender" })
    @IsNotEmpty()
    @IsString()
    gender: string;


    @ApiProperty({ example: "updated address" })
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiProperty({ example: "updated phoneNumber" })
    @IsNotEmpty()
    @IsString()
    phoneNumber: string;
}
