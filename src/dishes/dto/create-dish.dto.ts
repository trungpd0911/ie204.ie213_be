import { ApiProperty } from '@nestjs/swagger';

export class CreateDishDto {
	@ApiProperty({ example: 'Trà sữa trân châu đường đen nhiều đường đen' })
	dishName: string;

	@ApiProperty({ example: 20000 })
	dishPrice: number;

	@ApiProperty({ example: 'Khong co gi ngon' })
	dishDescription: string;

	@ApiProperty({ example: '66083097c11b247adbd84f2a' })
	menuId: string;
}
