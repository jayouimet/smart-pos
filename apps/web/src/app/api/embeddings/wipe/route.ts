import { ChromaClient } from "chromadb";
import { NextResponse } from "next/server";

// Hobby plan doesn't allow > 10 seconds
// export const maxDuration = 300;
export const maxDuration = 10;

export async function POST(req: Request) {
  try {
    const client = new ChromaClient({ path: process.env.CHROMADB_URL });
    const l = await client.listCollections();
    l.forEach(async (item) => {
      await client.deleteCollection({ name: item.name });
    });
    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error(error);
    return new Response(String(error), {
      status: 400,
    });
  }
}