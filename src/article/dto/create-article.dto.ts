import { User } from "src/user/user.entity";

export class CreateArticleDTO {
	user: User;
	title: string;
	slug: string;
	description: string;
	content: string;
}
