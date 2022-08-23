import { Injectable } from "@nestjs/common";
import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";
import handlebars from "handlebars";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }

  async exec(body: any): Promise<any> {
    const { type, foodplan } = body;

    let templateHtml;

    if (type === undefined || type === "DEFAULT") {
      templateHtml = fs.readFileSync(
        path.join(
          __dirname,

          "..",
          "/public/views/foodplan-template-to-pdf-generate-default.html"
        ),
        "utf8"
      );
    }

    if (type === "COMPACT") {
      templateHtml = fs.readFileSync(
        path.join(
          __dirname,

          "..",
          "/public/views/foodplan-template-to-pdf-generate-compact.html"
        ),
        "utf8"
      );
    }

    if (type === "SIMPLE") {
      templateHtml = fs.readFileSync(
        path.join(
          __dirname,

          "..",
          "/public/views/foodplan-template-to-pdf-generate-simple.html"
        ),
        "utf8"
      );
    }

    const template = handlebars.compile(templateHtml);
    const html = template(foodplan);

    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      headless: true,
    });
    const page = await browser.newPage();

    const milis = new Date();
    const time = milis.getTime();

    await page.setContent(html);
    // await page.emulateMediaType('print');
    const pdfName = `foodplan-${time}.pdf`;
    const pdfPath = path.join(
      __dirname,

      "..",

      "/public/pdf/",
      pdfName
    );

    await page.pdf({ path: pdfPath, format: "A4" });

    await page.close();
    await browser.close();

    setTimeout(() => {
      fs.unlinkSync(pdfPath);
    }, 600000);

    return pdfPath;
  }
}
