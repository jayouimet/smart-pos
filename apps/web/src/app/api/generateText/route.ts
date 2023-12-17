import { generateOllama, streamOllama } from "@utils/ollama";
import { StreamingTextResponse } from "ai";
import Product from "@pos_types/products/Product";

// Hobby plan doesn't allow > 10 seconds
// export const maxDuration = 300;
export const maxDuration = 10;

export async function POST(req: Request) {
  try {
    const { prompt, products } = await req.json();

    const descPrompt = `
      You are a keyword extractor sub-service that takes lengthy product names and summarize them into categories.
      You need to create an array of strings that will be served into another service in a pipeline, do not provide any justification.
      Using the following products, generate a single array of strings corresponding to their categories formated using the comma-separated value format. 
      The amount of keywords extracted should not exceed 6.
      ${products.map((product: Product) => { return ` ${product.name}\n`; })}
    `;

    const productDescription = await generateOllama(descPrompt);

    const newPrompt = `
      You are an employee in a store and you help customers find items. 
      You received the following description : ${prompt}
      Given the description, you were not able to find a matching item. 
      However, the closest matches were : ${products.map((product: Product) => { return `- ${product.name}\n`; })}. 
      Which are tools matching the categories described by these keywords : ${productDescription}
      Firstly, appologize for not finding the item and tell the user what kind of products you found using the closest matches above.
      Ask the customer for more relevant information about the item he is looking for to help you choose using the previous closest matches while keeping in mind their use with the help of the provided keywords.
      Make sure your question stays short, we wouldn't want to take too much time off of the customer's day.
    `;

    const stream = await streamOllama(newPrompt);
    return new StreamingTextResponse(stream);
  } catch (error) {
    return new Response(String(error), {
      status: 400,
    });
  }
}