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
import Product from "@pos_types/products/Product";

function DashboardIndex() {
  const [prompt, setPrompt] = useState<string>('');
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: session } = useSession();
  const { complete, completion, setCompletion } = useCompletion({
    api: '/api/generateText',
    onError: (err: Error) => {
      console.error(err);
      setIsLoading(false);
    },
    onResponse: () => {
      setIsLoading(false);
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

    // 2. given threshold
    const threshold = 0.75;
    // const threshold = 0.30;
    const similarItems = items.data.map(([doc, score]) => {
      if (score > threshold) return;

      return doc.metadata as Product;
    }).filter(item => item !== undefined) as Product[];

    if (similarItems.length > 0) {
      // 2.1 if any product is better or equal to threshold, display them
      setDisplayedProducts(similarItems);
      setIsLoading(false);
    } else {
      // 2.2 if all products is not similar given threshold, request details
      complete(prompt, {
        body: {
          products: items.data.map(([doc,]) => doc.metadata as Product)
        },
      });
    }
  }

  return (
    <Flex direction={'column'} height="100vh">
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
      <Stack flex={1} height={'100%'}>
        <Flex width={'100%'} direction={'row'}>
          <Textarea width={'92%'} height={"8vh"} value={prompt} resize={"none"} onChange={handleChangePrompt} />
          <Box width={'8%'} minWidth={'80px'}>
            <Box m={'auto'} mt={6} width={'40px'}>
              <Vocal className={'Vocal'} onResult={(text) => setPrompt(text)} />
            </Box>
          </Box>
        </Flex>
        {
            displayedProducts.length === 0 ?
              <Textarea width={'100%'} fontSize={'sm'} value={completion} resize={"none"} height={'55vh'} readOnly={true} />
              :
              <Flex width={'100%'} flexDirection={'row'} alignContent={'stretch'} flexWrap={'wrap'} gap={'0.5%'} height={'55vh'} >
                {
                  displayedProducts.map(product => {
                    return <ProductCard flexBasis={'33%'} height={'50%'} product={product} />
                  })
                }
              </Flex>
          }
          <Flex width={'100%'} direction={'row'}>
            <Button isLoading={isLoading} width={'100%'} maxWidth={'100%'} mt={5} height={'15vh'} onClick={() => generateOutput()}>Find it</Button>
          </Flex>
      </Stack>
    </Flex>
  );
}

export default DashboardIndex;
