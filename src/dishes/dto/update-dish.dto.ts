import { ApiProperty } from '@nestjs/swagger';

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
			{
				link: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1712315515/bepUIT-dishImages/lmskq9koz19kmvcz2uyt.jpg',
				id: 'bepUIT-dishImages/lmskq9koz19kmvcz2uyt',
			},
			{
				link: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1712315515/bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3.jpg',
				id: 'bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3',
			},
		],
		required: false,
	})
	dishImages: {
		link: string;
		id: string;
	}[];
}
