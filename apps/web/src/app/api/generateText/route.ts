import { similaritySearch } from "@utils/chromadb";
import { StreamingTextResponse } from "ai";
import { Ollama } from "langchain/llms/ollama";

// Hobby plan doesn't allow > 10 seconds
// export const maxDuration = 300;
export const maxDuration = 10;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const ollama = new Ollama({
      baseUrl: process.env.OLLAMA_URL,
      model: "llama2",
    });

    const context = await similaritySearch(
      prompt,
      process.env.CHROMADB_COLLECTION_NAME || ''
    );
    const newPrompt = `
      ${prompt}
      Here is some of the item found in the store with their location:
      ${context}
    `

    const stream = await ollama.stream(newPrompt);
    return new StreamingTextResponse(stream);
  } catch (error) {
    return new Response(String(error), {
      status: 400,
    });
  }
}