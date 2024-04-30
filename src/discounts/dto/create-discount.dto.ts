export class CreateDiscountDto {
	discountName: string;
	discountCode: string;
	discountPercent: number;
	discountDescription: string;
	startDay: Date;
	endDay: Date;
}
