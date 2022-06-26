import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { Repository } from "typeorm";
import { Article, ArticleStatus } from "./article.entity";
import { ArticleService } from "./article.service";
import { CreateArticleDTO } from "./dto/create-article.dto";
import { UpdateArticleDTO } from "./dto/update-article.dto";

const mockUser: User = {
	id: 1,
	auth_id: "auth0|12341234",
	username: "johnsmith",
	created: new Date(2022, 2, 30, 15, 32),
	modified: new Date(2022, 3, 1, 24, 55)
};

const mockArticles: Article[] = [
	{
		id: 1,
		created: new Date(2022, 4, 30, 22, 7),
		modified: new Date(2022, 4, 30, 22, 14),
		content: "Lorem ipsum this is a random text that I just came up with",
		status: ArticleStatus.PENDING,
		description: "Some randomly generated lorem",
		title: "lorem",
		slug: "lorem-ipsum",
		user: mockUser
	}
];

describe("ArticleService", () => {
	let service: ArticleService;
	let repository: Repository<Article>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ArticleService,
				{
					provide: getRepositoryToken(Article),
					useValue: {
						find: jest.fn().mockResolvedValue(mockArticles),
						findOne: jest.fn().mockResolvedValue(mockArticles[0]),
						save: jest.fn().mockResolvedValue(mockArticles[0])
					}
				}
			]
		}).compile();

		service = module.get<ArticleService>(ArticleService);
		repository = module.get<Repository<Article>>(getRepositoryToken(Article));
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
		expect(repository).toBeDefined();
	});

	describe("getAllArticles()", () => {
		it("should return all articles", async () => {
			const spy = jest.spyOn(repository, "find");

			const result = await service.getAllArticles();

			expect(result).toEqual(mockArticles);
			expect(spy).toBeCalled();
		});
	});

	describe("getArticleByID()", () => {
		it("should return one article", async () => {
			const spy = jest.spyOn(repository, "findOne");

			const result = await service.getArticleByID(1);

			expect(result).toEqual(mockArticles[0]);
			expect(spy).toBeCalled();
		});
	});

	describe("createArticle()", () => {
		it("should save a new article", async () => {
			const dto = new CreateArticleDTO();

			dto.user = mockUser;
			dto.title = "Some Article";
			dto.slug = "some-article";
			dto.description = "Some small article";
			dto.content = "Blablablabla some more text blablabla";

			const spy = jest.spyOn(repository, "save");

			await service.createArticle(dto);

			expect(spy).toBeCalled();
			expect(spy).toBeCalledWith({ ...dto, status: ArticleStatus.PENDING });
		});
	});

	describe("updateArticle()", () => {
		it("Should do a partial update", async () => {
			const dto = new UpdateArticleDTO();

			dto.title = "Some updated title";
			dto.content = "Just pretent there is some lorem ipsum here";

			const spy = jest.spyOn(repository, "save");

			await service.updateArticle(1, dto);

			const updatedArticle = {
				...mockArticles[0],
				title: "Some updated title",
				content: "Just pretent there is some lorem ipsum here",
				description: "Some randomly generated lorem"
			};

			expect(spy).toBeCalled();
			expect(spy).toBeCalledWith(updatedArticle);
		});
	});
});
