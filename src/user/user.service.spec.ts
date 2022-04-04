import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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

    jest.spyOn(repository, "find").mockResolvedValueOnce(mockUserData);
    jest.spyOn(repository, "findOne").mockResolvedValueOnce(mockUserData[0]);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return all users for getAll", async () => {
    expect(await service.getAll()).toEqual(mockUserData);
  });

  it("should return one user for getUserByID", async () => {
    expect(await service.getUserByID(1)).toEqual(mockUserData[0]);
  });

  it("should return one user for getUserByAuthID", async () => {
    expect(
      await service.getUserByAuthID("auth0|6237590b647a36006ba3c6ea")
    ).toEqual(mockUserData[0]);
  });
});
