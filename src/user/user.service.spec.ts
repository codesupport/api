import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
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
          useValue: {
            find: jest.fn().mockResolvedValue(mockUserData),
            findOne: jest.fn().mockResolvedValue(mockUserData[0]),
            save: jest.fn().mockResolvedValue(mockUserData[0]),
          },
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

  describe("getAll", () => {
    it("should return all users", async () => {
      const spy = jest.spyOn(repository, "find");

      const result = await service.getAll();

      expect(result).toEqual(mockUserData);
      expect(spy).toBeCalled();
    });
  });

  describe("getUserByID", () => {
    it("should return one user", async () => {
      const spy = jest.spyOn(repository, "findOne");

      const result = await service.getUserByID(1);
      expect(result).toEqual(mockUserData[0]);
      expect(spy).toBeCalled();
    });
  });

  describe("getUserByAuthID", () => {
    it("should return one user", async () => {
      const spy = jest.spyOn(repository, "findOne");

      const result = await service.getUserByAuthID(
        "auth0|6237590b647a36006ba3c6ea"
      );

      expect(result).toEqual(mockUserData[0]);
      expect(spy).toBeCalled();
    });
  });

  describe("createUser", () => {
    it("should save a new user", async () => {
      const dto = new CreateUserDTO();
      dto.auth_id = "auth0|someauthid";
      dto.username = "TestUserName";

      const spy = jest.spyOn(repository, "save");

      await service.createUser(dto);

      expect(spy).toBeCalled();
      expect(spy).toBeCalledWith({ ...dto });
    });
  });

  describe("updateUser", () => {
    it("Should update the username", async () => {
      const dto = new UpdateUserDTO();
      dto.username = "TestUserName";

      const spy = jest.spyOn(repository, "save");

      await service.updateUser(2, dto);

      const updatedUser = { ...mockUserData[0], username: "TestUserName" };
      expect(spy).toBeCalled();
      expect(spy).toBeCalledWith(updatedUser);
    });

    it("Should update the auth id", async () => {
      const dto = new UpdateUserDTO();
      dto.auth_id = "auth0|updatedAuthId";

      const spy = jest.spyOn(repository, "save");

      await service.updateUser(2, dto);

      const updatedUser = {
        ...mockUserData[0],
        auth_id: "auth0|updatedAuthId",
      };
      expect(spy).toBeCalled();
      expect(spy).toBeCalledWith(updatedUser);
    });

    it("should both update username and auth_id", async () => {
      const dto = new UpdateUserDTO();
      dto.auth_id = "auth0|updatedAuthId";
      dto.username = "TestUserName";

      const spy = jest.spyOn(repository, "save");

      await service.updateUser(2, dto);

      const updatedUser = {
        ...mockUserData[0],
        auth_id: "auth0|updatedAuthId",
        username: "TestUserName",
      };
      expect(spy).toBeCalled();
      expect(spy).toBeCalledWith(updatedUser);
    });
  });
});
