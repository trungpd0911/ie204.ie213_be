import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
	@ApiProperty({
		example: 'Tra sua rat ngon',
		required: true,
		description: 'Content of the comment',
	})
	content: string;

	@ApiProperty({
		example: '660fdc7b70dc7fb614ceaa4b',
		required: true,
		description: 'Dish id that is commented',
	})
	dishId: string;

	@ApiProperty({
		example: 5,
		required: true,
		description: 'Rating dish',
	})
	rating: number;
}
