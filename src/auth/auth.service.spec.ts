import { ManagementClient } from "auth0";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";

const mockAuth0Data = {
	id: "auth0|6237590b6aaaaajfsdoalij2",
	username: "testuser"
};

describe("AuthService", () => {
	let service: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: ManagementClient,
					useValue: {
						getUser: jest.fn().mockResolvedValue(mockAuth0Data)
					}
				},
				AuthService
			]
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("isUserValid()", () => {
		it("returns true is there is an Auth0 user with matching ID and username", async () => {
			const result = await service.isUserValid(mockAuth0Data.id, mockAuth0Data.username);

			expect(result).toBeTruthy();
		});

		it("returns false is there is an Auth0 user with matching ID but not a matching username", async () => {
			const result = await service.isUserValid(mockAuth0Data.id, "non-matching");

			expect(result).toBeFalsy();
		});

		it("returns false is there is not an Auth0 user with a matching ID and username", async () => {
			const result = await service.isUserValid("auth0|non-match", "non-matching");

			expect(result).toBeFalsy();
		});
	});
});
