import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./user.entity";
import { UserService } from "./user.service";

const mockUserData: User[] = [
  {
    id: 1,
    auth_id: "auth0|6237590b647a36006ba3c6ea",
    username: "johnsmith",
    created: new Date(2022, 2, 30, 15, 32),
    modified: new Date(2022, 3, 1, 24, 55),
  },
  {
    id: 2,
    auth_id: "auth0|6237590b6aaaaajfsdoalij2",
    username: "testuser",
    created: new Date(2022, 3, 1, 20, 44),
    modified: new Date(2022, 3, 1, 20, 44),
  },
];

describe("UserService", () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe("UserService#getAll", () => {
    it("should return all users", async () => {
      const spy = jest
        .spyOn(repository, "find")
        .mockResolvedValueOnce(mockUserData);

      const result = await service.getAll();

      expect(result).toEqual(mockUserData);
      expect(spy).toBeCalled();
    });
  });

  describe("UserService#getUserByID", () => {
    it("should return one user", async () => {
      const spy = jest
        .spyOn(repository, "findOne")
        .mockResolvedValueOnce(mockUserData[0]);

      const result = await service.getUserByID(1);
      expect(result).toEqual(mockUserData[0]);
      expect(spy).toBeCalled();
    });
  });

  describe("UserService#getUserByAuthID", () => {
    it("should return one user", async () => {
      const spy = jest
        .spyOn(repository, "findOne")
        .mockResolvedValueOnce(mockUserData[0]);

      const result = await service.getUserByAuthID(
        "auth0|6237590b647a36006ba3c6ea"
      );

      expect(result).toEqual(mockUserData[0]);
      expect(spy).toBeCalled();
    });
  });

  describe("UserService#createUser", () => {
    it("should save a new user", async () => {
      const dto = new CreateUserDto();
      dto.auth_id = "auth0|someauthid";
      dto.username = "TestUserName";

      const spy = jest.spyOn(repository, "save").mockResolvedValueOnce(null);

      await service.createUser(dto);

      expect(spy).toBeCalled();
    });
  });

  describe("UserService#updateUser", () => {
    it("Should update the user", async () => {
      const dto = new UpdateUserDto();

      dto.username = "TestUserName";

      jest.spyOn(repository, "findOne").mockResolvedValueOnce(mockUserData[1]);
      const spy = jest.spyOn(repository, "save").mockResolvedValueOnce(null);

      await service.updateUser(2, dto);

      expect(spy).toBeCalled();
    });
  });
});
