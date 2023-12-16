'use client'

import {
  Box,
  Button,
  Flex,
  Stack,
  Text,
  Textarea
} from '@chakra-ui/react';
import { ProductCard } from '@components/products/ProductCard';
import '@styles/vocal.css';
import Vocal from '@untemps/react-vocal';
import { useCompletion } from 'ai/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Product from "types/products/Product";

function DashboardIndex() {
  const [prompt, setPrompt] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    setCompletion('');
    if (!session?.user?.organization_id) return;
    
    setIsLoading(true);
    // 1. Do similarity search
    const items = await axios.post(
      '/api/embeddings/similaritySearch',
      {
        prompt: prompt,
        collection_name: `organization_${session.user.organization_id}`
      }
    );
    console.log(items.data);
    
    setProducts(items.data.map(([doc,]) => doc.metadata as Product));

    // 2. given threshold
    const threshold = 0.420;
    const similarItems = items.data.map(([doc, score]) => {
      if (score > threshold) return;

      return doc.metadata as Product;
    }).filter(item => item !== undefined) as Product[];

    if (similarItems.length > 0) {
      // 2.1 if any product is better or equal to threshold, display them
      setDisplayedProducts(similarItems);
    } else {
      // 2.2 if all products is not similar given threshold, request details
      complete(prompt);
    }
    setIsLoading(false);
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
      <Stack>
        <Flex width={'100%'} direction={'row'}>
          <Textarea mr={3} width={'60%'} height={"63vh"} value={prompt} resize={"none"} onChange={handleChangePrompt} />
          {
            displayedProducts.length === 0 ?
              <Textarea ml={3} width={'40%'} fontSize={'sm'} value={completion} resize={"none"} height={"63vh"} readOnly={true} />
              :
              <Flex ml={3} width={'40%'} flexDirection={'column'} align={'center'} gap={3} height={"63vh"}>
                {
                  displayedProducts.map(product => {
                    return <ProductCard product={product} />
                  })
                }
              </Flex>
          }
        </Flex>
        <Flex width={'100%'} direction={'row'}>
          <Box mr={3} width={'60%'} maxWidth={'60%'}>
            <Box m={'auto'} mt={6} width={'100px'}>
              <Vocal className={'Vocal'} onResult={(text) => setPrompt(text)} />
            </Box>
          </Box>
          <Button isLoading={isLoading} ml={3} width={'40%'} maxWidth={'40%'} mt={5} height={'15vh'} onClick={() => generateOutput()}>Find it</Button>
        </Flex>
      </Stack>
    </>
  );
}

export default DashboardIndex;
