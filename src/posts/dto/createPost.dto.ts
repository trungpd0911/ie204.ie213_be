import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(70)
	title: string;

	@IsNotEmpty()
	@IsString()
	header: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(160)
	description: string;

	@IsNotEmpty()
	@IsString({ each: true })
	keywords: string[];

	@IsNotEmpty()
	@IsString()
	content: string;
}
