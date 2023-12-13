'use client';

import { Box, Button, Center, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  return (
    <Center py={6}>
      <Box
        maxW={'445px'}
        w={'full'}
        boxShadow={'2xl'}
        rounded={'lg'}
        p={9}
        pb={9}
        overflow={'hidden'}
      >
        <Box h={'6vh'} mb={6} pos={'relative'}>
          <Center>
            <Stack>
              <Button variant={'solid'} onClick={() => { router.push('/auth/signin') }}>Login</Button>
              <Button variant={'solid'} onClick={() => { router.push('/auth/register') }}>Register</Button>
            </Stack>
          </Center>
        </Box>
      </Box>
    </Center>
  );
};

export default HomePage;
