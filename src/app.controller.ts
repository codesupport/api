import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { AppService } from './app.service';
import { AuthGuard } from "@nestjs/passport";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiTags('Example Routes')
  @ApiResponse({ status: 200, description: 'Returns Hello World!'})
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("protected")
  @UseGuards(AuthGuard("jwt"))
  getProtected(): string {
    return "hopefully you're authenticated!";
  }
}
