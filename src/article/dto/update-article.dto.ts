import { PartialType } from "@nestjs/swagger";
import { CreateArticleDTO } from "./create-article.dto";

export class UpdateArticleDTO extends PartialType(CreateArticleDTO) {
	title?: string;
	description?: string;
	content?: string;
}
