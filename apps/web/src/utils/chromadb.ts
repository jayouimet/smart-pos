import { OllamaEmbeddings } from "langchain/embeddings/ollama";
import { Chroma } from "langchain/vectorstores/chroma";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

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

export async function similaritySearch(
  prompt: string,
  collection_name: string
) {
  const embedder = new OllamaEmbeddings({
    baseUrl: process.env.OLLAMA_URL,
    model: "llama2",
  });

  const vectorStore = await Chroma.fromExistingCollection(embedder, {
    url: process.env.CHROMADB_URL,
    collectionName: collection_name,
    collectionMetadata: {
      'hnsw:space': 'cosine'
    }
  });

  const response = await vectorStore.similaritySearchWithScore(prompt, 2);
  let similarItems = response;
  if (response.length > 1) {
    const [, score1] = response[0];
    const [, score2] = response[1];

    if (score2 - score1 > 0.05) {
      similarItems = [response[0]];
    } 
  } 

  // TODO: Change the formatted string below when we will add metadata
  const output = similarItems.map(([doc, ]) => {
    return doc.pageContent;
  }).join("\n");

  return output;
}

export async function embedDocuments(
  contents: Page[],
  collection_name: string
) {
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

  const vectorStore = await Chroma.fromExistingCollection(embedder, {
    url: process.env.CHROMADB_URL,
    collectionName: collection_name,
    collectionMetadata: {
      'hnsw:space': 'cosine'
    }
  });

  // Add the data to the collection
  await vectorStore.addDocuments(documents, {
    ids: ids
  });

  return true;
}