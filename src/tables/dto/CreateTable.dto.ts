import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTableDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	tableFloor: string;

	@ApiProperty()
	@IsString()
	tablePosition: string;

	@ApiProperty()
	@IsString()
	tableStatus: string;
}
