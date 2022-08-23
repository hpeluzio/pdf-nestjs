import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";

@ApiTags("/")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/report/pdf/generate")
  async generateFoodplanReportToPatient(
    @Res() res: Response,
    @Body() body: any
  ): Promise<any> {
    const pdfPath = await this.appService.exec(body);

    res.download(pdfPath);
  }
}
