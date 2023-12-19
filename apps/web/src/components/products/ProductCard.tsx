'use client';

import { Box, BoxProps, Flex, Spacer, Text } from "@chakra-ui/react";
import Product from "@pos_types/products/Product";

interface ProductCardProps extends BoxProps {
  product: Product;
}

const ProductCard = (props: ProductCardProps) => {
  const { product, ...rest } = props;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={2}
      key={product.id}
      {...rest}
    >
      <Flex height={'100%'} p={4} direction={'column'} width={'100%'} mt={1}>
        <Text 
          flex={1} 
          fontSize="1.5em"
          fontWeight="semibold"
          height={'50%'}
          maxHeight={'3.1em'}
          textOverflow={'ellipsis'}
          overflow={'hidden'}
          display={'-webkit-box'}
          style={{
            WebkitLineClamp: 2,
            lineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }} 
          color={'red.500'}>
          {product.name.toUpperCase()}
        </Text>
        <Flex>
          <Box flex="1">
            <Text fontSize="15" fontWeight={'normal'}>
              LOCATION
            </Text>
            <Text fontSize="30" fontWeight={'bold'} color={'green'} fontStyle={'italic'}>
              {product.location || 'AAFF'}
            </Text>
          </Box>
          <Box flex="1">
            <Text fontSize="15" fontWeight={'normal'}>
              Price
            </Text>
            <Text fontSize="30" fontWeight={'bold'} color={'green'} fontStyle={'italic'}>
              {`${parseFloat((product.price / 100).toString()).toFixed(2)} $` || 'NAN'}
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  )
}

export { ProductCard };
