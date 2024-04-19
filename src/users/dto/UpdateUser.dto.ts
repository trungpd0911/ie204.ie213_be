import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
	@ApiProperty({ example: 'updated username' })
	@IsNotEmpty()
	@IsString()
	username: string;

	@ApiProperty({ example: 'updated email' })
	@IsNotEmpty()
	@IsString()
	email: string;

	@ApiProperty({ example: 'updated gender' })
	@IsString()
	gender: string;

	@ApiProperty({ example: 'updated address' })
	@IsString()
	address: string;

	@ApiProperty({ example: 'updated phoneNumber' })
	@IsString()
	phoneNumber: string;
}
