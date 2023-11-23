import { OllamaEmbeddings } from "langchain/embeddings/ollama";
import { Chroma } from "langchain/vectorstores/chroma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const auth = req.headers.get("auth");

    if (!auth || auth !== process.env.API_KEY) {
        return NextResponse.json({
            success: false,
            message: "Missing or bad auth header.",
            data: undefined
        }, { status: 401 });
    }

    const body = await req.json();

    if (!body.prompt) {
        return NextResponse.json({
            success: false,
            message: "No prompt in request body.",
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

    if (!body.top_k) {
        body.top_k = 2;
    }

    const { prompt, collection_name, top_k } = body;

    const embedder = new OllamaEmbeddings({
        baseUrl: process.env.OLLAMA_URL,
        model: "llama2",
    });

    let vectorStore = await Chroma.fromExistingCollection(embedder, {
        url: process.env.CHROMADB_URL,
        collectionName: collection_name
    });

    const response = await vectorStore.similaritySearch(prompt, top_k);

    return NextResponse.json({
        success: true,
        message: "Success",
        data: response
    })
}