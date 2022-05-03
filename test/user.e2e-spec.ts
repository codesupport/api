import * as request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";

describe("UserController (e2e)", () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it("/user/1 (GET)", () => request(app.getHttpServer())
		.get("/user/1")
		.expect(200)
		.expect(res => {
			if (res.body.id !== 1) {
				return false;
			}

			if (res.body.name !== "testuser") {
				return false;
			}

			return true;
		}));

	it("/user/10002 (GET)", () => request(app.getHttpServer())
		.get("/user/10002")
		.expect(404));

	it("/user/NotANumber (GET)", () => request(app.getHttpServer())
		.get("/user/NotANumber")
		.expect(400));
});
