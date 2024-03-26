export class responseData<D> {
	data: D | D[];
	// D is a generic type that will be used to define the type of the data property.
	statusCode: number;
	message: string;

	constructor(data: D | D[], statusCode: number, message: string) {
		this.data = data;
		this.statusCode = statusCode;
		this.message = message;

		return this;
	}
}

export class responseError {
	statusCode: number;
	message: string;

	constructor(statusCode: number, message: string) {
		this.statusCode = statusCode;
		this.message = message;

		return this;
	}
}