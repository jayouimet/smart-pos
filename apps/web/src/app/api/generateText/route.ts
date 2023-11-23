import { StreamingTextResponse } from "ai";
import { Ollama } from "langchain/llms/ollama";

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const ollama = new Ollama({
      baseUrl: process.env.OLLAMA_URL, 
      model: "llama2",
    });

    const stream = await ollama.stream(prompt);
    return new StreamingTextResponse(stream);
  } catch (error) {
    return new Response(String(error), {
      status: 400,
    });
  }
}