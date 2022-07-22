import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	Post,
	Param,
	Req,
	UseGuards,
	NotFoundException
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ArticleService } from "./article.service";
import { CreateArticleDTO } from "./dto/create-article.dto";
import { ArticleDTO } from "./dto/article.dto";
import { UserService } from "../user/user.service";
import AuthenticatedRequest from "../auth/authenticated-request.interface";
import { ArticleStatus } from "./article.entity";

@Controller("article")
export class ArticleController {
	constructor(
		private readonly articleService: ArticleService,
		private readonly userService: UserService
	) {}

	@Get("/:id")
	async getArticle(@Param("id") articleId: number): Promise<ArticleDTO> {
		const article = await this.articleService.getArticleByID(articleId);

		if (!article || article.status !== ArticleStatus.APPROVED) {
			throw new NotFoundException();
		}

		delete article.user.auth_id;

		return {
			...article,
			user: {
				...article.user,
				created: article.user.created.toISOString(),
				modified: article.user.modified.toISOString()
			},
			created: article.created.toISOString(),
			modified: article.modified.toISOString()
		};
	}

	@Post()
	@UseGuards(AuthGuard("jwt"))
	@ApiBearerAuth()
	async createArticle(
		@Req() req: AuthenticatedRequest,
		@Body() body: CreateArticleDTO
	): Promise<ArticleDTO> {
		const user = await this.userService.getUserByAuthID(req.user.sub);

		if (!user) {
			throw new ForbiddenException("User has no co-responding profile.");
		}

		const article = await this.articleService.createArticle(body, user);

		delete user.auth_id;

		return {
			...article,
			user: {
				...article.user,
				created: article.user.created.toISOString(),
				modified: article.user.modified.toISOString()
			},
			created: article.created.toISOString(),
			modified: article.modified.toISOString()
		};
	}
}
