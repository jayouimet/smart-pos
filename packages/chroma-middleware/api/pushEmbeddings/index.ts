import { VercelRequest, VercelResponse } from "@vercel/node";
import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
import dotenv from 'dotenv';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

dotenv.config();

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
});

export default async function (req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        res.status(404).json({
            success: false,
            message: "Not Found.",
            data: undefined
        });
        return;
    }
    
    const { auth } = req.headers;

    if (!auth || auth != process.env.API_KEY) {
        res.status(401).json({
            success: false,
            message: "Missing or bad auth header.",
            data: undefined
        });
        return;
    }

    const { body } = req;

    if (!body.contents) {
        res.status(400).json({
            success: false,
            message: "No contents in request body.",
            data: undefined
        });
        return;
    }

    const { contents } = body;

    if (!process.env.OPENAI_API_KEY)
        throw new Error("Missing env var OPENAI_API_KEY");

    const embedder = new OpenAIEmbeddingFunction({
        openai_api_key: process.env.OPENAI_API_KEY,
        openai_model: process.env.OPENAI_EMBEDDING_MODEL
    });

    // Create Pinecone index if it does not exist
    const ids = [];
    const documents = [];
    const metadatas = [];

    // Preprocessing the data (spliting)
    const splittedDocuments: any = [];
    await Promise.all(await contents.map(async (data: string) => {
        const splittedDoc = await splitter.splitText(data);
        splittedDocuments.push(...splittedDoc);
    }));

    const chromaClient = new ChromaClient({
        path: process.env.CHROMADB_URL
    });

    if (!process.env.COLLECTION_NAME_OPENAI)
        throw new Error("Missing env var COLLECTION_NAME_OPENAI");

    // Create each item for chromadb
    for (const [index, doc] of splittedDocuments.entries()) {
        console.log(`Embedding #${index + 1}/${splittedDocuments.length}`)
        ids.push(index.toString());
        documents.push(doc);
        metadatas.push({});
    }

    // Get the collection from chromadb
    const collection = await chromaClient.getOrCreateCollection({
        name: process.env.COLLECTION_NAME_OPENAI,
        embeddingFunction: embedder
    });

    // Add the data to the collection
    await collection.add({
        ids: ids,
        documents: documents,
        metadatas: metadatas
    });

    res.status(200).json({
        success: true,
        message: "Success",
        data: undefined
    });
}