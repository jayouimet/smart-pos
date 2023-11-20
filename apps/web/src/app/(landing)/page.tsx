'use client';

import { Box, Center, Text } from '@chakra-ui/react';

const HomePage = () => {
  return (
    <Center py={6}>
      <Box
        maxW={'445px'}
        w={'full'}
        bg={'gray.900'}
        boxShadow={'2xl'}
        rounded={'lg'}
        p={9}
        pb={9}
        overflow={'hidden'}
      >
        <Box h={'6vh'} mb={6} pos={'relative'}>
          <Text
            color={'brand.primary.green.100'}
            textTransform={'uppercase'}
            fontWeight={800}
            fontSize={'lg'}
            letterSpacing={1.1}
          >
            Index page for landing
          </Text>
        </Box>
      </Box>
    </Center>
  );
};

export default HomePage;
