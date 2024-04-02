export default class UpdateDishDto {
	dishName: string;
	dishPrice: number;
	dishDescription: string;
	menuId: string;
	dishImages: {
		link: string;
		id: string;
	}[];
}
