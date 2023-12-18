import { GET_PRODUCTS } from "@gql/products";
import axios from "axios";
import { ChromaClient } from "chromadb";
import { NextResponse } from "next/server";
import { print } from 'graphql';
import Product from "@pos_types/products/Product";
import { embedDocuments } from "@utils/chromadb";

// Hobby plan doesn't allow > 10 seconds
// export const maxDuration = 300;
export const maxDuration = 10;

export async function POST(req: Request) {
  try {
    const client = new ChromaClient({ path: process.env.CHROMADB_URL });
    const l = await client.listCollections();
    l.forEach(async (item) => {
      await client.deleteCollection({ name: item.name });
    });

    const queryOptions = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET || "",
      },
      data: {
        operationName: 'getProducts',
        query: print(GET_PRODUCTS),
        variables: {
          where: {}
        },
      }
    };

    const responseHasura = await axios(
      process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT ?? '',
      queryOptions,
    );

    if (responseHasura.data.errors) {
      return NextResponse.json({
        success: false
      });
    }

    const products = responseHasura.data.data.products as Product[];
    const array = {};

    products.forEach(product => {
      if (!product.organization_id) return;

      const collectionName = `organization_${product.organization_id}`;
      const content = {
        pageContent: `${product.name}: ${product.description}`,
        id: product.id,
        metadata: product
      };

      if (array[collectionName]) {
        array[collectionName].push(content);
      } else {
        array[collectionName] = [content];
      }
    });
    
    Object.keys(array).forEach(collectionName => {
      embedDocuments(array[collectionName], collectionName);
    });

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error(error);
    return new Response(String(error), {
      status: 400,
    });
  }
}