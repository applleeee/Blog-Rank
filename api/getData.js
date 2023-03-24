export default async function getData(request, response) {
   try {
      const res = await fetch(request.body.url);
      const data = await res.text();
      response.send(data).status(200);
   } catch (error) {
      console.error(error);
      response.status(error.response?.status || 500).end(error.message);
   }
}
