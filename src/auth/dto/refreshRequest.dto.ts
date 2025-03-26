import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RefreshRequest {
	@ApiProperty({ example: 'your refresh token' })
	@IsNotEmpty()
	@IsString()
	refreshToken: string;
}
