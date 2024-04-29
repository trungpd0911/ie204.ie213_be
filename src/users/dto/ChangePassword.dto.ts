import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class changePasswordDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	oldPassword: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	newPassword: string;
}
