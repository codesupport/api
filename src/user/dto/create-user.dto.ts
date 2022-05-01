import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDTO {
	@ApiProperty()
	auth_id: string;

	@ApiProperty()
	username: string;
}
