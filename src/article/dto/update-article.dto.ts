import { PartialType } from "@nestjs/swagger";
import { User } from "src/user/user.entity";
import { CreateArticleDTO } from "./create-article.dto";

export class UpdateArticleDTO extends PartialType(CreateArticleDTO) {
  user?: User;
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
}
