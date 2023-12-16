import { streamOllama } from "@utils/ollama";
import { StreamingTextResponse } from "ai";
import Product from "types/products/Product";

// Hobby plan doesn't allow > 10 seconds
// export const maxDuration = 300;
export const maxDuration = 10;

export async function POST(req: Request) {
  try {
    const { prompt, products } = await req.json();

    const newPrompt = `
      Given the following product description and all the product descriptions,
      generate a list of 3 additional information that could be added or edited to the product description to be more similar to the list of product descriptions.
      Each additional information should be concise and should be a question to ask.
      Product description: ${prompt}
      All product descriptions: 
        ${
          products.map((product: Product) => {
            return `- ${product.description}\n`;
          })
        }
      Additional information:
      -
    `;

    const stream = await streamOllama(newPrompt);
    return new StreamingTextResponse(stream);
  } catch (error) {
    return new Response(String(error), {
      status: 400,
    });
  }
}