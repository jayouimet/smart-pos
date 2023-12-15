import { embedDocuments } from "@utils/chromadb";
import { NextResponse } from "next/server";

// Hobby plan doesn't allow > 10 seconds
// export const maxDuration = 300;
export const maxDuration = 10;

export async function POST(req: Request) {
  try {
    const { contents, collection_name } = await req.json();

    const response = await embedDocuments(contents, collection_name);
    return NextResponse.json({
      success: response
    });
  } catch (error) {
    return new Response(String(error), {
      status: 400,
    });
  }
}