'use client'

import {
  Box,
  Button,
  Flex,
  Spacer, 
  Stack, 
  Textarea, 
  Text
} from '@chakra-ui/react';
import { ProductCard } from '@components/products/ProductCard';
import { generateOllama } from '@utils/ollama';
import { useCompletion } from 'ai/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { POSProduct } from 'types/POSProducts';
import Vocal from '@untemps/react-vocal';
import '@styles/vocal.css';

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
  }

  return (
    <>
      <Flex
        justify={'space-between'}
        align={{ base: 'flex-start', md: 'center' }}
        direction={{ base: 'column-reverse', md: 'row' }}
        gap={{ base: 3, md: 6 }}
        mb={4}
      >
        <Text fontSize={'5xl'} fontWeight="bold">
          {'Dashboard'}
        </Text>
      </Flex>
      <Flex>
        <Spacer />
        <Stack width={"50vw"} height={"80vh"} gap={5}>
          <Textarea height={"63vh"} value={prompt} resize={"none"} onChange={handleChangePrompt} />
          <Spacer />
          <Vocal className={'Vocal'} onResult={(text) => setPrompt(text)} />
        </Stack>
        <Spacer />
        <Box width={"30vw"} height={"80vh"}>
          {
            displayedProducts.length === 0 ?
              <Textarea fontSize={'sm'} value={completion} resize={"none"} width={"inherit"} height={"63vh"} readOnly={true} />
              :
              <Flex flexDirection={'column'} align={'center'} gap={3} height={"63vh"}>
                {
                  displayedProducts.map(product => {
                    return <ProductCard product={product} />
                  })
                }
              </Flex>
          }
          <Spacer />
          <Button mt={5} height={'15vh'} width={'inherit'} onClick={() => generateOutput()}>Find it</Button>
        </Box>
        <Spacer />
      </Flex>
    </>
  );
}

export default DashboardIndex;
