import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { error: "Method not implemented" },
        { status: 404 }
      );
    }

    //#region Scrape data from data sources
    const { dataSources } = await req.json();

    const results = await Promise.all(
      dataSources.map(async (dataSource) => {
        const options = {
          method: "GET",
          url: `https://medium2.p.rapidapi.com/article/${dataSource.id}/content`,
          headers: {
            "X-RapidAPI-Key": process.env.RAPID_API_KEY,
            "X-RapidAPI-Host": "medium2.p.rapidapi.com",
          },
        };

        try {
          const res = await axios.request(options);

          if (res.data.content) {
            return res.data.content;
          }
        } catch (error) {
          console.error(error);
          return undefined;
        }
      })
    );

    const filteredResults = results.filter((result) => {
      return result !== undefined;
    });
    //#endregion

    //#region Embed documents
    // Create Pinecone index if it does not exist

    console.log("Starting to add embeddings");

    const options = {
      method: "POST",
      url: `${process.env.CHROMA_EMBEDDINGS_ENDPOINT}/api/pushEmbeddings`,
      headers: {
        auth: process.env.EMBEDDING_API_KEY,
      },
      data: {
        contents: filteredResults,
      },
    };

    await axios.request(options);
    //#endregion*/

    return NextResponse.json({ error: "OK" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to embed data" },
      { status: 400 }
    );
  }
}
