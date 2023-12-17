import { Ollama } from "langchain/llms/ollama";

export const streamOllama = async (
  prompt: string
) => {
  const ollama = new Ollama({
    baseUrl: process.env.OLLAMA_URL,
    model: "mistral",
    cache: false,
  });
  const stream = await ollama.stream(prompt);
  return stream;
}

export const generateOllama = async (
  prompt: string
) => {
  const ollama = new Ollama({
    baseUrl: process.env.OLLAMA_URL,
    model: "mistral",
    cache: false,
  });
  const output = await ollama.call(prompt);
  return output;
}