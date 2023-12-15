import { Ollama } from "langchain/llms/ollama";
const ollama = new Ollama({
  baseUrl: process.env.OLLAMA_URL,
  model: "mistral",
});

export const streamOllama = async (
  prompt: string
) => {
  const stream = await ollama.stream(prompt);
  return stream;
}

export const generateOllama = async (
  prompt: string
) => {
  const output = await ollama.call(prompt);
  return output;
}