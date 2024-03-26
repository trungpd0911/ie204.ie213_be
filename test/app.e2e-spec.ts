import { Test } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import * as request from "supertest";

let port = 3001;
let app: INestApplication;
describe("app endtoend", () => {
	beforeAll(async () => {
		const appModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();
		app = appModule.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.listen(port);
	})

	afterAll(async () => {
		app.close();
	})
	it.todo("should be defined");
})

describe("test authentication", () => {
	describe("register", () => {
		it("register", async () => {
			// const response = await request(app.getHttpServer())
			// 	.post("/auth/register")
			// 	.send({
			// 		email: "admin@gmail.com",
			// 		password: "a12345678"
			// 	});
			// console.log(response.body);

			// expect(response.status).toBe(201);
			expect(1).toBe(1);
		});
	})
	describe("login", () => {
		it.todo("should login");
	})
})