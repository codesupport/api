import { ApiProperty } from "@nestjs/swagger";
import { UserDTO } from "../../user/dto/user.dto";

export class ArticleDTO {
	@ApiProperty()
	id: number;

	@ApiProperty()
	title: string;

	@ApiProperty()
	slug: string;

	@ApiProperty()
	description: string;

	@ApiProperty()
	content: string;

	@ApiProperty()
	user: UserDTO;

	@ApiProperty()
	created: string;

	@ApiProperty()
	modified: string;
}