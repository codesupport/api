import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Article } from "./article.entity";
import { ArticleService } from "./article.service";

@Module({
  providers: [ArticleService],
  imports: [TypeOrmModule.forFeature([Article])],
})
export class ArticleModule {}
