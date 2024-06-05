import { Tool } from "@langchain/core/tools";

export class CKTSearch extends Tool {
  name = "web_search";
  maxResults = 5;

  /** @ignore */
  async _call(input: string) {
    const CKT_TOKEN = process.env.CKT_TOKEN;

    const response = await fetch(
      `https://tool-api.tsun1031.xyz/v1/web/search?query=${encodeURIComponent(input)}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${CKT_TOKEN}`,
        },
      },
    );

    const data = await response.json() as {
      data: {
        title: string
        link: string
        snippet: string
      }[]
    }

    if (!data.data || !response.ok) {
      throw new Error("Failed to fetch ckt search data");
    }

    return data.data
      .slice(0, this.maxResults)
      .map(({ title, snippet, link }) => `**${title}**\n${snippet}\n${link}`)
      .join("\n\n");
  }

  description =
    "a search engine. useful for when you need to answer questions about current events. input should be a search query.";
}
