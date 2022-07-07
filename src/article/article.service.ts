import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Article, ArticleStatus } from "./article.entity";
import { CreateArticleDTO } from "./dto/create-article.dto";
import { UpdateArticleDTO } from "./dto/update-article.dto";

@Injectable()
export class ArticleService {
	constructor(
		@InjectRepository(Article)
		private articleRepository: Repository<Article>
	) { }

	getArticleByID(id: number): Promise<Article> {
		return this.articleRepository.findOne({ where: { id } });
	}

	getAllArticles(): Promise<Article[]> {
		return this.articleRepository.find();
	}

	createArticle(createArticleDTO: CreateArticleDTO): Promise<Article> {
		const article = new Article();

		article.slug = createArticleDTO.slug;
		article.user = createArticleDTO.user;
		article.title = createArticleDTO.title;
		article.description = createArticleDTO.description;
		article.status = ArticleStatus.PENDING;
		article.content = createArticleDTO.content;

		return this.articleRepository.save(article);
	}

	async updateArticle(id: number, updateArticleDTO: UpdateArticleDTO): Promise<Article> {
		let article = await this.getArticleByID(id);

		article = { ...article, ...updateArticleDTO };
		return this.articleRepository.save(article);
	}
}
