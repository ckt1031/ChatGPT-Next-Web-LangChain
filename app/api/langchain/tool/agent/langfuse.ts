import { CallbackHandler } from "langfuse-langchain";

export function getLangFuse() {
  const langfuseLangchainHandler = new CallbackHandler({
    publicKey: process.env.LANGFUSE_PUBLIC_KEY,
    secretKey: process.env.LANGFUSE_SECRET_KEY,
    baseUrl: process.env.LANGFUSE_BASE_URL ?? "https://cloud.langfuse.com",
    flushAt: 1,
  });
  return langfuseLangchainHandler;
}
