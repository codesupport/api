import { Test, TestingModule } from "@nestjs/testing";
import { ForbiddenException } from "@nestjs/common";
import { ArticleController } from "./article.controller";
import { UserService } from "../user/user.service";
import { User } from "../user/user.entity";
import { ArticleService } from "./article.service";
import { Article, ArticleStatus } from "./article.entity";

class NoErrorThrownError extends Error {}

async function getError<TError>(call: () => unknown): Promise<TError> {
	try {
		await call();
		throw new NoErrorThrownError();
	} catch (error: unknown) {
		return error as TError;
	}
}

const mockUser: User = {
	id: 1,
	auth_id: "auth0|12341234",
	username: "johnsmith",
	created: new Date(2022, 2, 30, 15, 32),
	modified: new Date(2022, 3, 1, 24, 55)
};

const mockArticle: Article = {
	id: 1,
	user: mockUser,
	created: new Date(2022, 2, 30, 15, 32),
	modified: new Date(2022, 3, 1, 24, 55),
	title: "My Awesome Article",
	slug: "my-awesome-article",
	status: ArticleStatus.PENDING,
	description: "This is my awesome article.",
	content: "Why is it awesome? I don't know. I was meant to write why in this article."
};

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
						getUserByAuthID: jest.fn().mockResolvedValue(mockUser)
					}
				},
				{
					provide: ArticleService,
					useValue: {
						createArticle: jest.fn().mockResolvedValue(mockArticle)
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

			expect(result.id).toBe(mockArticle.id);
			expect(result.user.id).toBe(mockUser.id);

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
