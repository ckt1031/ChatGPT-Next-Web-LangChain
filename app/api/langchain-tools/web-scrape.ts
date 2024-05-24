import { Tool } from "@langchain/core/tools";

export class ServerlessWebScraping extends Tool {
  name = "web-browser";

  /** @ignore */
  async _call(input: string) {
    let result = "";

    const CKT_TOKEN = process.env.CKT_TOKEN;

    if (!CKT_TOKEN) {
      const response = await fetch(`https://r.jina.ai/${input}`);

      result = await response.text();
    } else {
      const response = await fetch(
        `https://tool-api.ckt1031.xyz/v1/web/extract/markdown?url=${encodeURIComponent(input)}`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${CKT_TOKEN}`,
          },
        },
      );

      const data = await response.json();

      if (!data.content || !response.ok) {
        throw new Error(data.message || "Failed to fetch data");
      }

      result = data.content;
    }

    return result;
  }

  description =
    "A class designed to interact with web pages, either to extract information from them or to summarize their content.";
}
