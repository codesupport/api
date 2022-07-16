import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	NotFoundException,
	Param,
	Post,
	Query,
	UseGuards
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {ApiBearerAuth} from "@nestjs/swagger";
import {ArticleService} from "./article.service";
import {CreateArticleDTO} from "./dto/create-article.dto";
import {ArticleDTO} from "./dto/article.dto";
import {UserService} from "../user/user.service";
import {ArticleStatus} from "./article.entity";
import {AuthUser} from "../auth/auth-user.decorator";
import GetAllArticlesOptions from "./interfaces/GetAllArticlesOptions";

@Controller("article")
export class ArticleController {
	constructor(
		private readonly articleService: ArticleService,
		private readonly userService: UserService
	) {}

	@Get()
	async getAllArticles(
		@Query("userId") userId?: number,
		@Query("status") status?: ArticleStatus,
		@AuthUser() authUser?: string
	): Promise<ArticleDTO[]> {
		let user;
		let options: GetAllArticlesOptions = {
			status: ArticleStatus.APPROVED
		};

		if (authUser) {
			user = await this.userService.getUserByAuthID(authUser);
		}

		if (typeof user !== "undefined" && user?.id === userId) {
			options.status = status;
		}

		if (userId) {
			options.userId = userId;
		}

		const articles = await this.articleService.getAllArticles(options);

		console.log(options);

		return articles.map(article => {
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
		});
	}

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
		@AuthUser() authUser: string,
		@Body() body: CreateArticleDTO
	): Promise<ArticleDTO> {
		const user = await this.userService.getUserByAuthID(authUser);

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
