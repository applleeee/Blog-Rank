import * as dotenv from "dotenv";
const request = require("request");
dotenv.config();

export const searchBlogFromNaver = async () => {
   const clientId = process.env.NAVER_CLIENT_ID;
   const secretKey = process.env.NAVER_SECRET_KEY;
   const api_url = `https://openapi.naver.com/v1/search/blog?query=${encodeURIComponent("위례송현")}&display=20`;

   const options = {
      url: api_url,
      headers: { "X-Naver-Client-Id": clientId, "X-Naver-Client-Secret": secretKey },
   };
   await request.get(options, (error, response, body) => {
      if (!error && response.statusCode == 200) {
         console.log(body);
         return body;
      } else {
         console.log(error);
      }
   });
};
