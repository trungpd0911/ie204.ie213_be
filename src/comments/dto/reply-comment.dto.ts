import { ApiProperty } from '@nestjs/swagger';

export default class ReplyCommentDto {
	@ApiProperty({
		example: 'Khong ngon dau ban oi',
		required: true,
		description: 'Content of the comment',
	})
	content: string;

	@ApiProperty({
		example: '66180b351effbd8d0ebdae56',
		required: true,
		description: 'Id of comment that is replied',
	})
	isReplyOf: string;
}
