import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";
import { fillTemplate, getMissingKeys } from "../utils";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
export const runtime = "edge";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response("Only accepts post requests", {
      status: 404,
    });
  }

  //const { prompt } = await req.json();
  // This is hardcoded until the frontend UX is done.
  const data = {
    identification: "english pro",
    number: 2,
    length: 3,
    socialMediaSite: "reddit",
    businessType: "enterprise",
    business: "hotbread inc",
    lookingFor: "looking for nice employees",
    notMention: "bread",
    tone: "epic"
  }

  // This code suppose that the prompt is unique, so there's not a chained prompt going on.
  // If we need a chained prompt, we can use LangChain to do this.

  // Those are hardcoded until Hasura is up.
  // When Hasura is up, template & dataInputs will come from DB.
  const template = "Act as a {identification}. Your task is to help me create {number} social media posts on {socialMediaSite} for the {businessType} account, targeting anyone who is interested in learning more about {business}. {lookingFor}. Each post you give me should be {length} sentences, but not more. The posts should not mention {notMention}. Make it {tone}";

  const missingInputs = getMissingKeys(data, template)
  if (missingInputs.length > 0)
    throw new Error(`Missing following fields: ${missingInputs}`);

  const filledTemplate = fillTemplate(template, data);

  if (!process.env.GPT_MODEL)
    throw new Error("Missing GPT_MODEL env var");

  // TODO: check comments below when frontend design for options in each category will be finished.
  // Is the optional value entered before processing the first prompt,
  // or is it after the text is generated?
  
  const response = await openai.chat.completions.create({
    model: process.env.GPT_MODEL,
    messages: [
      {
        role: "user",
        content: filledTemplate,
      },
    ],
    temperature: 0.5, // maybe we will change this in function of the category of the prompt
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
