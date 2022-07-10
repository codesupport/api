import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ManagementClient } from "auth0";
import { Article } from "./article.entity";
import { ArticleService } from "./article.service";
import { ArticleController } from "./article.controller";
import { UserService } from "../user/user.service";
import { User } from "../user/user.entity";
import { AuthService } from "../auth/auth.service";

@Module({
	providers: [
		{
			provide: ManagementClient,
			useValue: new ManagementClient({
				domain: process.env.AUTH0_DOMAIN,
				clientId: process.env.AUTH0_CLIENT_ID,
				clientSecret: process.env.AUTH0_CLIENT_SECRET,
				scope: "read:users"
			})
		},
		ArticleService,
		UserService,
		AuthService
	],
	imports: [
		TypeOrmModule.forFeature([Article]),
		TypeOrmModule.forFeature([User])
	],
	controllers: [ArticleController]
})
export class ArticleModule {}
