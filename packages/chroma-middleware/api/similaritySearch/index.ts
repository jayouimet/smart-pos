import { OpenAI } from 'openai';
import { VercelRequest, VercelResponse } from "@vercel/node";
import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
import dotenv from 'dotenv';
dotenv.config();

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

    if (!body.prompt) {
        res.status(400).json({
            success: false,
            message: "No prompt in request body.",
            data: undefined
        });
        return;
    }

    const { prompt } = body;

    if (!process.env.OPENAI_API_KEY)
        throw new Error("Missing env var OPENAI_API_KEY");

    const embedder = new OpenAIEmbeddingFunction({
        openai_api_key: process.env.OPENAI_API_KEY,
        openai_model: process.env.OPENAI_EMBEDDING_MODEL
    });

    const chromaClient = new ChromaClient({
        path: process.env.CHROMADB_URL
    });

    if (!process.env.COLLECTION_NAME_OPENAI)
        throw new Error("Missing env var COLLECTION_NAME_OPENAI");

    const collection = await chromaClient.getOrCreateCollection({
        name: process.env.COLLECTION_NAME_OPENAI,
        embeddingFunction: embedder
    });

    const { documents } = await collection.query({
        queryTexts: prompt,
        nResults: 10
    })

    const document = documents[0]

    const context = document.join('\n');

    res.status(200).json({
        success: true,
        message: "Success",
        data: context
    })
}