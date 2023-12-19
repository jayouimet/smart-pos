import { embedder } from "@utils/chromadb";
import { Chroma } from "langchain/vectorstores/chroma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.ids) {
    return NextResponse.json({
      success: false,
      message: "No ids in request body.",
      data: undefined
    }, { status: 400 });
  }

  if (!body.collection_name) {
    return NextResponse.json({
      success: false,
      message: "No collection_name in request body.",
      data: undefined
    }, { status: 400 });
  }

  const { collection_name, ids } = body;

  const vectoreStore = new Chroma(embedder, {
    url: process.env.CHROMADB_URL,
    collectionName: collection_name
  });

  // Delete the data from the collection
  await vectoreStore.delete({
    ids: ids
  });

  return NextResponse.json({
    success: true,
    message: "Success",
    data: undefined
  });
}