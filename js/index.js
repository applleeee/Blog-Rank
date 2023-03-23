import "../css/bootstrap.min.css";
import "../css/main.css";
import "../images/예시.png";
import { downloadExcel, getSearchedResult } from "./scrap.js";

const blogNameInput = document.querySelector(".blogName");
const keywordListInput = document.querySelector(".keywords");
const form = document.querySelector("form");
const dropdownButton = document.querySelector(".dropdown > button");

const handleDropdown = (e) => {
   const dropdownContent = document.querySelector("#Toggle");

   if (dropdownContent.style.display === "none") {
      dropdownContent.style.display = "block";
   } else {
      dropdownContent.style.display = "none";
   }
};

const getCurrentTime = () => {
   return new Date(+new Date() + 3240 * 10000).toISOString().replace("T", "_").replace(/\..*/, "").replace(/\:/g, "-");
};

let ifFrist = true;
const handleSubmit = async (e) => {
   e.preventDefault();

   const blogName = blogNameInput.value;
   const keywords = keywordListInput.value;

   if (!blogName || !keywords) {
      alert("두 항목 모두 입력해주세요!");
   }

   const regExp = /[\{\}\[\]\/?.;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g; // 특수문자 체크("," 제외)

   if (regExp.test(blogName) || regExp.test(keywords)) {
      alert("특수문자가 포함되어 있습니다.");
   }

   const keywordArray = keywords.replace(/\s+/g, "").split(","); // 모든 공백 제거 후 "," 기준으로 나눔

   const data = { blogName, keywordArray };
   const scrapResult = await getSearchedResult(data);

   const table = new Tabulator("#result", {
      data: scrapResult,
      columns: [
         { title: "키워드", field: "keyword" },
         { title: "순위", field: "rank" },
         { title: "제목", field: "title" },
      ],
   });

   const objectUrl = await downloadExcel(scrapResult);

   if (ifFrist) {
      // a 태그 생성
      const downloadLink = document.createElement("a");
      downloadLink.classList.add("downloadLink");
      downloadLink.download = `${blogName}_${getCurrentTime()}.xlsx`;
      downloadLink.href = objectUrl;
      form.appendChild(downloadLink);

      // button 생성
      const downloadButton = document.createElement("button");
      downloadButton.type = "button";
      downloadButton.classList.add("download", "btn", "btn-success");
      downloadButton.innerText = "엑셀 다운로드";
      downloadLink.appendChild(downloadButton);
   } else {
      const downloadLink = document.querySelector(".downloadLink");
      downloadLink.href = objectUrl;
   }

   ifFrist = false;
};

dropdownButton.addEventListener("click", handleDropdown);
form.addEventListener("submit", handleSubmit);
