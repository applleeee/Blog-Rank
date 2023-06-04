import axios from "axios";
import cheerio from "cheerio";
import * as exceljs from "exceljs";

export const getSearchedResult = async (data) => {
  const { keywordArray, blogName } = data;
  const result = [];

  for (const [index, ele] of keywordArray.entries()) {
    // 개발
    //  await axios({
    //    url: `/search.naver?where=view&query=${encodeURIComponent(ele)}&qvt=0`,
    //    method: "GET",
    //  })
    //    .then((res) => {
    //      const $ = cheerio.load(res.data);
    //      const findBlog = $(`a[href=https://blog.naver.com/${blogName}]`);
    //      const parentLI = $(findBlog).closest("li._svp_item");
    //      const rank = parentLI.attr("data-cr-rank");
    //      const title = parentLI.find("a.api_txt_lines").text();
    //      const date = parentLI.find("span.sub_time").text();
    //      result[index] = { keyword: ele, rank: rank, title: title, date: date };
    //    })
    //    .catch((err) => {
    //      console.log(err);
    //    });

    // 배포
    const url = `https://search.naver.com/search.naver?where=view&query=${encodeURIComponent(
      ele
    )}&qvt=0`;
    await axios({
      url: "/api/getData",
      method: "POST",
      data: { url },
    })
      .then((res) => {
        const $ = cheerio.load(res.data);
        const findBlog = $(`a[href=https://blog.naver.com/${blogName}]`);
        const parentLI = $(findBlog).closest("li._svp_item");
        const rank = parentLI.attr("data-cr-rank");
        const title = parentLI.find("a.api_txt_lines").text();
        const date = parentLI.find("span.sub_time").text();
        result[index] = { keyword: ele, rank: rank, title: title, date: date };
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return result;
};

export const downloadExcel = async (data) => {
  const book = new exceljs.Workbook();
  const sheet = book.addWorksheet("result");

  sheet.columns = [
    { header: "키워드", key: "keyword" },
    { header: "순위", key: "rank" },
    { header: "글 제목", key: "title" },
  ];

  data.forEach((ele, index) => {
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

  const excel = await book.xlsx.writeBuffer();
  const excelBlob = new Blob([excel], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const objectUrl = URL.createObjectURL(excelBlob);

  return objectUrl;
};
