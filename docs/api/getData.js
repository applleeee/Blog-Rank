import axios from "axios";

export default async function getData(request, response) {
   try {
      const res = await axios.get(request.body.url);
      response.send(res.data).status(200);
   } catch (error) {
      console.error(error);
      response.status(error.response?.status || 500).end(error.message);
   }
}
