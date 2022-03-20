import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiTags('Example Routes')
  @ApiResponse({ status: 200, description: 'Returns Hello World!'})
  getHello(): string {
    return this.appService.getHello();
  }
}
