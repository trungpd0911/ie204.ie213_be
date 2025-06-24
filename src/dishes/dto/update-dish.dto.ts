import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export default class UpdateDishDto {
	@ApiProperty({
		example: 'Trà sữa trân châu đường đen nhiều đường đen',
		required: false,
	})
	dishName: string;

	@ApiProperty({ example: 20000, required: false })
	dishPrice: number;

	@ApiProperty({ example: 'Khong co gi ngon', required: false })
	dishDescription: string;

	@ApiProperty({ example: '66083097c11b247adbd84f2a', required: false })
	menuId: string;

	@ApiProperty({
		example: [
			'bepUIT-dishImages/lmskq9koz19kmvcz2uyt',
			'bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3',
		],
		required: false,
		type: [String],
	})
	oldImageIds?: string | string[];

	// Used when clients pass less than 2 ids
	static from(dto: Partial<UpdateDishDto>) {
		const updateDto = new UpdateDishDto();
		Object.assign(updateDto, dto);

		// Transform oldImageIds if it's a string
		if (typeof updateDto.oldImageIds === 'string') {
			updateDto.oldImageIds = updateDto.oldImageIds.split(',');
		}

		return updateDto;
	}
}
