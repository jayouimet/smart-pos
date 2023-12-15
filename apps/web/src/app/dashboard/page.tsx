'use client'

import {
  Box,
  Button,
  Flex,
  Spacer, Stack, Textarea
} from '@chakra-ui/react';
import { ProductCard } from '@components/products/ProductCard';
import { generateOllama } from '@utils/ollama';
import { useCompletion } from 'ai/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { POSProduct } from 'types/POSProducts';

function DashboardIndex() {
  const [prompt, setPrompt] = useState<string>('');
  const [lastSummary, setLastSummary] = useState<string>('');
  const [products, setProducts] = useState<POSProduct[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<POSProduct[]>([]);
  const { data: session } = useSession();
  const { complete, completion, setCompletion } = useCompletion({
    api: '/api/generateText',
    onError: (err: Error) => {
      console.error(err);
    },
    body: {
      products: products
    }
  });

  const handleChangePrompt = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  }

  const generateOutput = async () => {
    setDisplayedProducts([]);
    if (!session?.user?.organization_id) return;

    // 0. summarize the prompt + last prompt
    const summarizedPrompt = await generateOllama(`
      You are a summarizing search engine and are given a product description and optional additional details.
      With the following, generate a short description of the most appropriate product using a short sentence without any explanation.
      Description: ${lastSummary ? lastSummary : prompt}
      Details: ${lastSummary ? prompt : ''}
      Resulting description:
    `);
    console.log(summarizedPrompt);

    // 1. Do similarity search
    const items = await axios.post(
      '/api/embeddings/similaritySearch',
      {
        prompt: summarizedPrompt,
        collection_name: `client_${session.user.organization_id}`
      }
    );
    console.log(items.data);

    setProducts(items.data.map(([doc,]) => doc.metadata as POSProduct));

    // 2. given threshold
    const threshold = 0.75;
    const similarItems = items.data.map(([doc, score]) => {
      if (score > threshold) return;

      return doc.metadata as POSProduct;
    }).filter(item => item !== undefined) as POSProduct[];

    if (similarItems.length > 0) {
      // 2.1 if any product is better or equal to threshold, display them
      setLastSummary('');
      setDisplayedProducts(similarItems);
    } else {
      // 2.2 if all products is not similar given threshold, request details
      setLastSummary(summarizedPrompt);
      complete(summarizedPrompt);
    }
  }

  const test = async () => {
    if (!session?.user?.organization_id) return;
    const r = await axios.post(
      '/api/embeddings/similaritySearch',
      {
        prompt: prompt,
        collection_name: `client_${session.user.organization_id}`
      }
    );
    console.log(r);
  }

  return (
    <Flex>
      <Spacer />
      <Stack width={"50vw"} height={"80vh"} gap={5}>
        <Textarea height={"60vh"} value={prompt} resize={"none"} onChange={handleChangePrompt} />
        <Button height={'20vh'} onClick={() => generateOutput()}>Find it</Button>
      </Stack>
      <Spacer />
      <Box width={"30vw"} height={"80vh"}>
        {
          displayedProducts.length === 0 ?
            <Textarea fontSize={'sm'} value={completion} resize={"none"} width={"inherit"} height={"inherit"} readOnly={true} />
            :
            <Flex flexDirection={'column'} gap={2}>
              <Spacer />
              {
                displayedProducts.map(product => {
                  return <ProductCard product={product} />
                })
              }
              <Spacer />
            </Flex>
        }
      </Box>
    </Flex>
  );
}

export default DashboardIndex;
