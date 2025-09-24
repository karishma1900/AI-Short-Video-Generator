import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get("url");

  if (!fileUrl) {
    return new Response(
      JSON.stringify({ error: "Missing audio URL" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Forward Range header if present
    const range = req.headers.get("range");

    const axiosResponse = await axios.get(fileUrl, {
      responseType: "arraybuffer",
      headers: range ? { Range: range } : undefined,
      validateStatus: function (status) {
        return (status >= 200 && status < 300) || status === 206;
      },
    });

    const headers = new Headers();

    headers.set("Content-Type", "audio/mpeg");
    headers.set("Access-Control-Allow-Origin", "*");

    // Forward content range headers if partial content response
    if (axiosResponse.status === 206) {
      if (axiosResponse.headers["content-range"]) {
        headers.set("Content-Range", axiosResponse.headers["content-range"]);
      }
      headers.set("Accept-Ranges", "bytes");
      headers.set("Content-Length", axiosResponse.data.byteLength.toString());
      return new Response(axiosResponse.data, {
        status: 206,
        headers,
      });
    }

    // If full content (200)
    if (axiosResponse.status === 200) {
      headers.set("Content-Length", axiosResponse.data.byteLength.toString());
      headers.set("Accept-Ranges", "bytes");
      return new Response(axiosResponse.data, {
        status: 200,
        headers,
      });
    }

    // fallback
    return new Response(axiosResponse.data, {
      status: axiosResponse.status,
      headers,
    });
  } catch (error) {
    console.error("Proxy fetch failed:", error);
    return new Response(
      JSON.stringify({ error: "Failed to proxy audio" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
