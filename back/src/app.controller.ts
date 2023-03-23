import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
   constructor(private readonly appService: AppService) {}

   @Get("/test")
   getHello(): string {
      return this.appService.getHello();
   }

   @Post("/search")
   getSearchedResult(@Body() data) {
      return this.appService.getSearchedResult(data);
   }
}
