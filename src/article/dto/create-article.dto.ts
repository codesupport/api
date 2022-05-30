import { User } from "src/user/user.entity"
import { ArticleStatus } from "../article.entity"

export class CreateArticleDTO {
  user: User
  title: string
  slug: string
  status?: ArticleStatus
  description: string
  content: string
}
