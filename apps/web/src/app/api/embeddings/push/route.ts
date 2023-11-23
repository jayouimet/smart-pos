import { OllamaEmbeddings } from "langchain/embeddings/ollama";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Chroma } from "langchain/vectorstores/chroma";
import { NextResponse } from "next/server";

interface Page {
    metadata: object,
    pageContent: string,
    id: string
}

const MAX_CHUNK_SIZE = 1000;
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: MAX_CHUNK_SIZE,
    chunkOverlap: 200
});

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

    if (!body.contents) {
        return NextResponse.json({
            success: false,
            message: "No contents in request body.",
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

    const { contents, collection_name } = body;

    const embedder = new OllamaEmbeddings({
        baseUrl: process.env.OLLAMA_URL,
        model: "llama2",
    });

    const documents: any[] = [];
    const ids: any[] = [];

    // Preprocessing the data (spliting)
    await Promise.all(await contents.map(async (page: Page) => {
        if (page.pageContent.length <= MAX_CHUNK_SIZE && page.pageContent.length > 0) {
            ids.push(page.id);
            documents.push({
                pageContent: page.pageContent,
                metadata: page.metadata,
            });
        } else {
            const splittedDoc = await splitter.splitText(page.pageContent);
            splittedDoc.forEach((doc, index) => {
                if (doc === "") return;

                ids.push(page.id + index.toString());
                documents.push({
                    pageContent: doc,
                    metadata: page.metadata,
                });
            })
        }
    }));

    let vectorStore = await Chroma.fromExistingCollection(embedder, {
        url: process.env.CHROMADB_URL,
        collectionName: collection_name
    });

    // Add the data to the collection
    await vectorStore.addDocuments(documents, {
        ids: ids
    });

    return NextResponse.json({
        success: true,
        message: "Success",
        data: undefined
    })
}