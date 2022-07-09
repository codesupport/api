import { ApiProperty } from "@nestjs/swagger";

export class CreateArticleDTO {
	@ApiProperty()
	title: string;

	@ApiProperty()
	slug: string;

	@ApiProperty()
	description: string;

	@ApiProperty()
	content: string;
}