import { ArticleStatus } from "../article.entity";

interface GetAllArticlesOptions {
	userId?: number;
	status?: ArticleStatus;
}

export default GetAllArticlesOptions;