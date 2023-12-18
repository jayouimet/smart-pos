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
      <Text fontSize="25" fontWeight="semibold" align={'center'} color={'red.500'}>
        {product.name.toUpperCase()}
      </Text>
      <Flex align="center" mt={1}>
        <Box width={'50%'}>
          {
            product.description && (
              <>
                <Text fontSize="15" fontWeight={'normal'} align={'center'}>
                  DESCRIPTION
                </Text>
                <Text color="gray.400" align={'center'} fontStyle={'italic'}>
                  {product.description}
                </Text>
              </>
            )}
        </Box>
        <Spacer />
        <Box flex="1">
          <Text fontSize="15" fontWeight={'normal'} align={'center'}>
            LOCATION
          </Text>
          <Text fontSize="35" fontWeight={'bold'} align={'center'} color={'green'} fontStyle={'italic'}>
            {product.location || 'AAFF'}
          </Text>
        </Box>
        <Spacer />
      </Flex>
    </Box>
  )
}

export { ProductCard };
