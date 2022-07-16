import {Test, TestingModule} from "@nestjs/testing";
import {ForbiddenException, NotFoundException} from "@nestjs/common";
import {ArticleController} from "./article.controller";
import {UserService} from "../user/user.service";
import {User} from "../user/user.entity";
import {ArticleService} from "./article.service";
import {Article, ArticleStatus} from "./article.entity";

class NoErrorThrownError extends Error {}

async function getError<TError>(call: () => unknown): Promise<TError> {
	try {
		await call();
		throw new NoErrorThrownError();
	} catch (error: unknown) {
		return error as TError;
	}
}

const mockUsers: User[] = [
	{
		id: 1,
		auth_id: "auth0|12341234",
		username: "johnsmith",
		created: new Date(2022, 2, 30, 15, 32),
		modified: new Date(2022, 3, 1, 24, 55)
	},
	{
		id: 2,
		auth_id: "auth0|44321232",
		username: "smithjohn",
		created: new Date(2022, 2, 30, 15, 32),
		modified: new Date(2022, 3, 1, 24, 55)
	}
];

const mockArticles: Article[] = [
	{
		id: 1,
		user: mockUsers[0],
		created: new Date(2022, 2, 30, 15, 32),
		modified: new Date(2022, 3, 1, 24, 55),
		title: "My Awesome Approved Article",
		slug: "my-awesome-approved-article",
		status: ArticleStatus.APPROVED,
		description: "This is my awesome article.",
		content: "Why is it awesome? I don't know. I was meant to write why in this article."
	},
	{
		id: 2,
		user: mockUsers[0],
		created: new Date(2022, 2, 30, 15, 32),
		modified: new Date(2022, 3, 1, 24, 55),
		title: "My Awesome Pending Article",
		slug: "my-awesome-pending-article",
		status: ArticleStatus.PENDING,
		description: "This is my awesome article.",
		content: "Why is it awesome? I don't know. I was meant to write why in this article."
	},
	{
		id: 3,
		user: mockUsers[1],
		created: new Date(2022, 2, 30, 15, 32),
		modified: new Date(2022, 3, 1, 24, 55),
		title: "Another Awesome Approved Article",
		slug: "another-awesome-approved-article",
		status: ArticleStatus.APPROVED,
		description: "This is my awesome article.",
		content: "Why is it awesome? I don't know. I was meant to write why in this article."
	},
];

describe("ArticleController", () => {
	let controller: ArticleController;
	let articleService: ArticleService;
	let userService: UserService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ArticleController],
			providers: [
				{
					provide: UserService,
					useValue: {
						getUserByAuthID: jest.fn().mockResolvedValue(mockUsers[0])
					}
				},
				{
					provide: ArticleService,
					useValue: {
						getAllArticles: jest.fn().mockResolvedValue(mockArticles),
						createArticle: jest.fn().mockResolvedValue(mockArticles[0]),
						getArticleByID: id => mockArticles[id - 1]

					}
				}
			]
		}).compile();

		controller = module.get<ArticleController>(ArticleController);
		articleService = module.get<ArticleService>(ArticleService);
		userService = module.get<UserService>(UserService);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	// describe("getAllArticles()", () => {
		it("returns all APPROVED articles", async () => {
			const getAllArticlesSpy = jest.spyOn(articleService, "getAllArticles");

			await controller.getAllArticles();

			expect(getAllArticlesSpy).toBeCalled();
			expect(getAllArticlesSpy).toBeCalledWith({
				status: ArticleStatus.APPROVED
			});
		});

		it("returns all APPROVED articles by a specific user", async () => {
			const getAllArticlesSpy = jest.spyOn(articleService, "getAllArticles");

			await controller.getAllArticles(mockUsers[1].id);

			expect(getAllArticlesSpy).toBeCalled();
			expect(getAllArticlesSpy).toBeCalledWith({
				userId: mockUsers[1].id,
				status: ArticleStatus.APPROVED
			});
		});

		it("returns any status of articles by a specific user if the request is made by that user", async () => {
			const getAllArticlesSpy = jest.spyOn(articleService, "getAllArticles");

			await controller.getAllArticles(mockUsers[0].id, ArticleStatus.PENDING, mockUsers[0].auth_id);

			expect(getAllArticlesSpy).toBeCalled();
			expect(getAllArticlesSpy).toBeCalledWith({
				userId: mockUsers[0].id,
				status: ArticleStatus.PENDING
			});
		});

		it("returns APPROVED of articles by a specific user if the request is made by a different user", async () => {
			const getAllArticlesSpy = jest.spyOn(articleService, "getAllArticles");

			await controller.getAllArticles(mockUsers[1].id, ArticleStatus.PENDING, mockUsers[0].auth_id);

			expect(getAllArticlesSpy).toBeCalled();
			expect(getAllArticlesSpy).toBeCalledWith({
				userId: mockUsers[1].id,
				status: ArticleStatus.APPROVED
			});
		});
	// });

	describe("getArticle()", () => {
		it("should return a 404 if the article doesn't exist", async () => {
			const getArticleByIdSpy = jest.spyOn(articleService, "getArticleByID");
			const result = await getError(async () => controller.getArticle(4));

			expect(result).toBeInstanceOf(NotFoundException);

			expect(getArticleByIdSpy).toBeCalled();
		});

		it("should return a 404 if the article is not APPROVED", async () => {
			const getArticleByIdSpy = jest.spyOn(articleService, "getArticleByID");
			const result = await getError(async () => controller.getArticle(2));

			expect(result).toBeInstanceOf(NotFoundException);

			expect(getArticleByIdSpy).toBeCalled();
		});

		it("should return the article", async () => {
			const getArticleByIdSpy = jest.spyOn(articleService, "getArticleByID");
			const result = await controller.getArticle(1);

			expect(result.id).toBe(mockArticles[0].id);

			expect(getArticleByIdSpy).toBeCalled();
		});
	});

	describe("createArticle", () => {
		it("should create an article in the database", async () => {
			const createArticleSpy = jest.spyOn(articleService, "createArticle");

			// @ts-ignore - no need to mock entire request object in test
			const result = await controller.createArticle({
				user: { sub: "1" }
			}, {
				title: "My Awesome Article",
				slug: "my-awesome-article",
				description: "This is my awesome article.",
				content: "Why is it awesome? I don't know. I was meant to write why in this article."
			});

			expect(result.id).toBe(mockArticles[0].id);
			expect(result.user.id).toBe(mockUsers[0].id);

			expect(createArticleSpy).toBeCalled();
		});

		it("should return a 403 if the user does not exist", async () => {
			const spy = jest.spyOn(userService, "getUserByAuthID").mockResolvedValue(null);

			// @ts-ignore - no need to mock entire request object in test
			const result = await getError(async () => controller.createArticle({
				user: { sub: "2" }
			}, {
				title: "My Awesome Article",
				slug: "my-awesome-article",
				description: "This is my awesome article.",
				content: "Why is it awesome? I don't know. I was meant to write why in this article."
			}));

			expect(result).not.toBeInstanceOf(NoErrorThrownError);
			expect(result).toBeInstanceOf(ForbiddenException);

			expect(spy).toBeCalled();
		});
	});
});
