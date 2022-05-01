import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { User } from "./user.entity";
import { UserService } from "./user.service";

class NoErrorThrownError extends Error {}

async function getError<TError>(call: () => unknown): Promise<TError> {
	try {
		await call();
		throw new NoErrorThrownError();
	} catch (error: unknown) {
		return error as TError;
	}
}

const mockUserData: User[] = [
	{
		id: 1,
		auth_id: "auth0|6237590b647a36006ba3c6ea",
		username: "johnsmith",
		created: new Date(2022, 2, 30, 15, 32),
		modified: new Date(2022, 3, 1, 24, 55)
	},
	{
		id: 2,
		auth_id: "auth0|6237590b6aaaaajfsdoalij2",
		username: "testuser",
		created: new Date(2022, 3, 1, 20, 44),
		modified: new Date(2022, 3, 1, 20, 44)
	}
];

describe("UserController", () => {
	let service: UserService;
	let controller: UserController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [
				{
					provide: UserService,
					useValue: {
						getUserByID: jest.fn().mockResolvedValue(mockUserData[0]),
						createUser: jest.fn().mockResolvedValue(mockUserData[1])
					}
				}
			]
		}).compile();

		controller = module.get<UserController>(UserController);
		service = module.get<UserService>(UserService);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	describe("getUser()", () => {
		it("should return a user when it does exists", async () => {
			const spy = jest.spyOn(service, "getUserByID");

			const result = await controller.getUser("1");

			expect(result.id).toBe(mockUserData[0].id);
			expect(result).not.toHaveProperty("auth_id");

			expect(spy).toBeCalled();
		});

		it("should return a 404 when the user does not exist", async () => {
			const spy = jest.spyOn(service, "getUserByID").mockResolvedValue(null);
			const result = await getError(async () => controller.getUser("1101"));

			expect(result).not.toBeInstanceOf(NoErrorThrownError);
			expect(result).toBeInstanceOf(NotFoundException);

			expect(spy).toBeCalled();
		});

		it("should return a 400 when the given id is not a number", async () => {
			const spy = jest.spyOn(service, "getUserByID").mockResolvedValue(null);
			const result = await getError(async () =>
				controller.getUser("not a number")
			);

			expect(result).not.toBeInstanceOf(NoErrorThrownError);
			expect(result).toBeInstanceOf(BadRequestException);

			expect(spy).not.toBeCalled();
		});
	});

	describe("createUser()", () => {
		it("should create a user in the database", async () => {
			const spy = jest.spyOn(service, "createUser");

			const result = await controller.createUser({
				auth_id: mockUserData[1].auth_id,
				username: mockUserData[1].username
			});

			expect(result.id).toBe(mockUserData[1].id);
			expect(result.username).toBe(mockUserData[1].username);
			expect(result).not.toHaveProperty("auth_id");
			expect(spy).toBeCalled();
		});
	});
});
