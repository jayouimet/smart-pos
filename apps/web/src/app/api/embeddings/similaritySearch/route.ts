import { similaritySearch } from "@utils/chromadb";
import { NextResponse } from "next/server";

// Hobby plan doesn't allow > 10 seconds
// export const maxDuration = 300;
export const maxDuration = 10;

export async function POST(req: Request) {
  try {
    const { prompt, collection_name } = await req.json();
    
    const response = await similaritySearch(prompt, collection_name);
    return NextResponse.json(response);
  } catch (error) {
    return new Response(String(error), {
      status: 400,
    });
  }
}