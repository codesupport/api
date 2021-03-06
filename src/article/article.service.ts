import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Article, ArticleStatus } from "./article.entity";
import { CreateArticleDTO } from "./dto/create-article.dto";
import { UpdateArticleDTO } from "./dto/update-article.dto";
import { User } from "../user/user.entity";
import GetAllArticlesOptions from "./interfaces/GetAllArticlesOptions";

@Injectable()
export class ArticleService {
	constructor(
		@InjectRepository(Article)
		private articleRepository: Repository<Article>
	) { }

	getArticleByID(id: number): Promise<Article> {
		return this.articleRepository.findOne({ where: { id } });
	}

	getArticlesByUserID(id: number): Promise<Article[]> {
		return this.articleRepository.find({ where: { user: id } });
	}

	getAllArticles(options?: GetAllArticlesOptions): Promise<Article[]> {
		return this.articleRepository.find({
			where: {
				status: options?.status
			}
		});
	}

	createArticle(createArticleDTO: CreateArticleDTO, user: User): Promise<Article> {
		const article = new Article();

		article.slug = createArticleDTO.slug;
		article.title = createArticleDTO.title;
		article.description = createArticleDTO.description;
		article.status = ArticleStatus.PENDING;
		article.content = createArticleDTO.content;
		article.user = user;

		return this.articleRepository.save(article);
	}

	async updateArticle(id: number, updateArticleDTO: UpdateArticleDTO): Promise<Article> {
		let article = await this.getArticleByID(id);

		article = { ...article, ...updateArticleDTO };
		return this.articleRepository.save(article);
	}
}
