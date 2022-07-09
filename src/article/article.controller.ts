import { Body, Controller, ForbiddenException, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ArticleService } from "./article.service";
import { CreateArticleDTO } from "./dto/create-article.dto";
import { ArticleDTO } from "./dto/article.dto";
import { UserService } from "../user/user.service";
import AuthenticatedRequest from "../auth/authenticated-request.interface";
import {ApiBearerAuth, ApiResponse} from "@nestjs/swagger";

@Controller("article")
export class ArticleController {
	constructor(
		private readonly articleService: ArticleService,
		private readonly userService: UserService
	) {}

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
