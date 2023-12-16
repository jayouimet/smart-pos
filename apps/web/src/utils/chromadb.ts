import { HuggingFaceTransformersEmbeddings } from "langchain/embeddings/hf_transformers";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Chroma } from "langchain/vectorstores/chroma";

interface Page {
  metadata: object,
  pageContent: string,
  id: string // pretty much for updating
}

const MAX_CHUNK_SIZE = 1000;
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: MAX_CHUNK_SIZE,
  chunkOverlap: 200
});

export const embedder = new HuggingFaceTransformersEmbeddings({
  modelName: "Xenova/all-MiniLM-L6-v2",
});

export async function similaritySearch(
  prompt: string,
  collection_name: string
) {
  // Get the classification pipeline. When called for the first time,
  // this will load the pipeline and cache it for future use.

  const vectorStore = await Chroma.fromExistingCollection(embedder, {
    url: process.env.CHROMADB_URL,
    collectionName: collection_name,
    collectionMetadata: {
      'hnsw:space': 'cosine'
    }
  });
  const response = await vectorStore.similaritySearchWithScore(prompt, 4);
  return response;
}

export async function embedDocuments(
  contents: Page[],
  collection_name: string
) {
  const documents: any[] = [];
  const ids: any[] = [];

  // Preprocessing the data (spliting)
  await Promise.all(
    contents.map(async (page: Page) => {
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
    })
  );
  const vectorStore = await Chroma.fromExistingCollection(embedder, {
    url: process.env.CHROMADB_URL,
    collectionName: collection_name,
    collectionMetadata: {
      'hnsw:space': 'cosine'
    }
  });
  await vectorStore.addDocuments(documents, {
    ids: ids,
  });
  return true;
}