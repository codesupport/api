import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.DATABASE_HOST,
    //   port: Number.parseInt(process.env.DATABASE_PORT) || 5432,
    //   username: process.env.DATABASE_USER,
    //   password: process.env.DATABASE_PASS,
    //   database: process.env.DATABASE_NAME,
    //   entities: [
    //     __dirname + '/**/*.entity{.ts,.js}',
    //   ],
    //   synchronize: process.env.NODE_ENV !== 'production',
    // }),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
