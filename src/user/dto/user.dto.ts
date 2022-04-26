import { ApiProperty } from "@nestjs/swagger";

export class UserDTO {
	@ApiProperty()
  id: number;

	@ApiProperty()
  username: string;

	@ApiProperty()
  created: string;

	@ApiProperty()
  modified: string;
}
