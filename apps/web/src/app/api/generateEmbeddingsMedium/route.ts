import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // TODO: i don't think this is necessary with the new App Router (type = method name)
    if (req.method !== "POST") {
      return NextResponse.json(
        { error: "Method not implemented" },
        { status: 404 }
      );
    }

    const { mediumPostId } = await req.json();

    console.log("mediumPostId", mediumPostId);

    if (!mediumPostId) {
      return NextResponse.json(
        { error: "No post ID provided" },
        { status: 400 }
      );
    }

    //#region Scrape data from data sources

    const options = {
      method: "GET",
      url: `https://medium2.p.rapidapi.com/article/${mediumPostId}/content`,
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": "medium2.p.rapidapi.com",
      },
    };

    let result;

    try {
      result = await axios.request(options);

      if (!result.data.content) {
        return NextResponse.json(
          { error: "Medium post not found" },
          { status: 404 }
        );
      }

      result = result.data.content;
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Medium post not found" },
        { status: 404 }
      );
    }
    //#endregion

    //#region Embed documents
    // Create Pinecone index if it does not exist

    console.log("Starting to add embeddings");

    const optionsEmbedding = {
      method: "POST",
      url: `${process.env.CHROMA_EMBEDDINGS_ENDPOINT}/api/pushEmbeddings`,
      headers: {
        auth: process.env.EMBEDDING_API_KEY,
      },
      data: {
        contents: [result],
      },
    };

    const resEmbeddings = await axios.request(optionsEmbedding);
    //#endregion*/

    if (resEmbeddings.status == 200) {
      return NextResponse.json({ error: "OK" }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "An error occured while pushing the data in chroma db" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to embed data" },
      { status: 400 }
    );
  }
}
