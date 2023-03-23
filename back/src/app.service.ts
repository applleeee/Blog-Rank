import { Injectable } from "@nestjs/common";
import axios from "axios";
import cheerio from "cheerio";
import * as exceljs from "exceljs";

@Injectable()
export class AppService {
   private getCurrentTime() {
      return new Date(+new Date() + 3240 * 10000).toISOString().replace("T", "_").replace(/\..*/, "").replace(/\:/g, "-");
   }

   getHello(): string {
      return "Hello World!";
   }

   async getSearchedResult(data) {
      const { keywordArray, blogName } = data;
      const result = [];

      for (const [index, ele] of keywordArray.entries()) {
         await axios({
            url: `https://search.naver.com/search.naver?where=view&query=${encodeURIComponent(ele)}&mode=normal`,
            method: "GET",
         })
            .then((res) => {
               const $ = cheerio.load(res.data);
               const findBlog = $(`a[href=https://blog.naver.com/${blogName}]`);
               const parentLI = $(findBlog).closest("li._svp_item");
               const rank = parentLI.attr("data-cr-rank");
               const title = parentLI.find("a.api_txt_lines").text();
               result[index] = { keyword: ele, rank: rank, title: title };
            })
            .catch((err) => {
               console.log(err);
            });
      }
      console.log(result);

      const book = new exceljs.Workbook();
      const sheet = book.addWorksheet("result");

      sheet.columns = [
         { header: "키워드", key: "keyword" },
         { header: "순위", key: "rank" },
         { header: "글 제목", key: "title" },
      ];

      result.forEach((ele, index) => {
         if (ele.rank === undefined) {
            ele.rank = "순위 없음";
         }
         sheet.addRow(ele);
         if (ele.rank >= 5 || ele.rank === "순위 없음") {
            const row = sheet.getRow(index + 2);
            row.eachCell((cell) => {
               cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FDCFCF" },
               };
            });
         }
      });

      await book.xlsx.writeFile(`${blogName}_${this.getCurrentTime()}.xlsx`);
   }
}
