export default async function getData(request, response) {
  try {
    const res = await fetch(request.body.url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      },
    });
    const data = await res.text();
    response.send(data).status(200);
  } catch (error) {
    console.error(error);
    response.status(error.response?.status || 500).end(error.message);
  }
}
