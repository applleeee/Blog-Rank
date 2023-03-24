import axios from "axios";

export default async function getData(request, response) {
   console.log("에러 확인");
   try {
      const res = await axios.get(request.body.url);
      response.send(res.data).status(200);
   } catch (error) {
      console.log("erororororor");
      console.error(error);
      response.status(error.response?.status || 500).end(error.message);
   }
}