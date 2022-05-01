import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ConflictException } from "@nestjs/common";
import { Repository } from "typeorm";
import { ManagementClient } from "auth0";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { AuthService } from "../auth/auth.service";

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

describe("UserService", () => {
	let userService: UserService;
	let authService: AuthService;
	let repository: Repository<User>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: ManagementClient,
					useValue: {
						getUser: jest.fn().mockResolvedValue(mockUserData[1])
					}
				},
				{
					provide: AuthService,
					useValue: {
						isUserValid: jest.fn().mockResolvedValue(true)
					}
				},
				UserService,
				{
					provide: getRepositoryToken(User),
					useValue: {
						find: jest.fn().mockResolvedValue(mockUserData),
						findOne: jest.fn().mockResolvedValue(mockUserData[0]),
						save: jest.fn().mockResolvedValue(mockUserData[0])
					}
				}
			]
		}).compile();

		userService = module.get<UserService>(UserService);
		authService = module.get<AuthService>(AuthService);
		repository = module.get<Repository<User>>(getRepositoryToken(User));
	});

	it("should be defined", () => {
		expect(authService).toBeDefined();
		expect(userService).toBeDefined();
		expect(repository).toBeDefined();
	});

	describe("getAll()", () => {
		it("should return all users", async () => {
			const spy = jest.spyOn(repository, "find");

			const result = await userService.getAll();

			expect(result).toEqual(mockUserData);
			expect(spy).toBeCalled();
		});
	});

	describe("getUserByID()", () => {
		it("should return one user", async () => {
			const spy = jest.spyOn(repository, "findOne");

			const result = await userService.getUserByID(1);

			expect(result).toEqual(mockUserData[0]);
			expect(spy).toBeCalled();
		});
	});

	describe("getUserByAuthID()", () => {
		it("should return one user", async () => {
			const spy = jest.spyOn(repository, "findOne");

			const result = await userService.getUserByAuthID(
				"auth0|6237590b647a36006ba3c6ea"
			);

			expect(result).toEqual(mockUserData[0]);
			expect(spy).toBeCalled();
		});
	});

	describe("createUser()", () => {
		it("should return a conflict if user does not have a matching entry in Auth0", async () => {
			const isValidSpy = jest.spyOn(authService, "isUserValid").mockResolvedValue(false);
			const dto = new CreateUserDTO();

			dto.auth_id = mockUserData[1].auth_id;
			dto.username = "usernname_no_mach";

			const saveSpy = jest.spyOn(repository, "save");

			const result = await getError(async () => userService.createUser(dto));

			expect(saveSpy).not.toBeCalled();
			expect(isValidSpy).toBeCalled();
			expect(result).toBeInstanceOf(ConflictException);
		});

		it("should save a new user if the user has a match in auth0", async () => {
			const dto = new CreateUserDTO();

			dto.auth_id = "auth0|someauthid";
			dto.username = "TestUserName";

			const spy = jest.spyOn(repository, "save");

			await userService.createUser(dto);

			expect(spy).toBeCalled();
			expect(spy).toBeCalledWith({ ...dto });
		});
	});

	describe("updateUser()", () => {
		it("Should update the username", async () => {
			const dto = new UpdateUserDTO();

			dto.username = "TestUserName";

			const spy = jest.spyOn(repository, "save");

			await userService.updateUser(2, dto);

			const updatedUser = { ...mockUserData[0], username: "TestUserName" };

			expect(spy).toBeCalled();
			expect(spy).toBeCalledWith(updatedUser);
		});

		it("Should update the auth id", async () => {
			const dto = new UpdateUserDTO();

			dto.auth_id = "auth0|updatedAuthId";

			const spy = jest.spyOn(repository, "save");

			await userService.updateUser(2, dto);

			const updatedUser = {
				...mockUserData[0],
				auth_id: "auth0|updatedAuthId"
			};

			expect(spy).toBeCalled();
			expect(spy).toBeCalledWith(updatedUser);
		});

		it("should both update username and auth_id", async () => {
			const dto = new UpdateUserDTO();

			dto.auth_id = "auth0|updatedAuthId";
			dto.username = "TestUserName";

			const spy = jest.spyOn(repository, "save");

			await userService.updateUser(2, dto);

			const updatedUser = {
				...mockUserData[0],
				auth_id: "auth0|updatedAuthId",
				username: "TestUserName"
			};

			expect(spy).toBeCalled();
			expect(spy).toBeCalledWith(updatedUser);
		});
	});
});
