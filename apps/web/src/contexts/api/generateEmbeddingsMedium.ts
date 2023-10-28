import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(404).json({ error: "Method not implemented" });
    }

    if (!req.body.mediumPostId) {
      return res.status(400).json({ error: "No post ID provided" });
    }

    //#region Scrape data from data sources
    const { mediumPostId } = req.body;

    const options = {
      method: 'GET',
      url: `https://medium2.p.rapidapi.com/article/${mediumPostId}/content`,
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'medium2.p.rapidapi.com'
      }
    };

    let result;

    try {
      result = await axios.request(options);

      if (!result.data.content) {
        res.status(404).json({ error: "Medium post not found" });
        return;
      }

      result = result.data.content;
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: "Medium post not found" });
      return;
    }
    //#endregion

    //#region Embed documents
    // Create Pinecone index if it does not exist

    console.log("Starting to add embeddings")
    
    const optionsEmbedding = {
      method: 'POST',
      url: `${process.env.CHROMA_EMBEDDINGS_ENDPOINT}/api/pushEmbeddings`,
      headers: {
        'auth': process.env.EMBEDDING_API_KEY,
      },
      data: {
        contents: [result]
      }
    };

    const resEmbeddings = await axios.request(optionsEmbedding);
    //#endregion*/

    if (resEmbeddings.status == 200) {
      res.status(200).json({ status: "OK" });
      return;
    }
    else {
      res.status(400).json({ error: "An error occured while pushing the data in chroma db" });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Unable to embed data", e: error });
  }
}