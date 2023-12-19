'use client';

import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import Product from '@pos_types/products/Product';

export interface ProductInfoModalProps {
  title: string,
  isModalOpen: boolean;
  onClose: () => void;
  product?: Product
}

const ProductInfoModal = ({
  title,
  isModalOpen,
  onClose,
  product
}: ProductInfoModalProps) => {
  return (
    <>
      {
        product && 
        <Modal isOpen={isModalOpen} onClose={onClose} isCentered size={'2xl'}>
          <ModalOverlay />
          <ModalContent maxH={'90%'} overflowY={'auto'}>
            <ModalHeader>{title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack gap={5}>
                <Box>
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
                </Box>
                <Box>
                  <Text textAlign={'justify'}>{product.description}</Text>
                </Box>
                <Flex>
                  <Box flex="1">
                    <Text fontSize="15" fontWeight={'normal'}>
                      LOCATION
                    </Text>
                    <Text fontSize="30" fontWeight={'bold'} color={'green'} fontStyle={'italic'}>
                      {product.location || 'AAFF'}
                    </Text>
                  </Box>
                  <Box flex={1}>
                    <Text fontSize="15" fontWeight={'normal'}>
                      Price
                    </Text>
                    <Text fontSize="30" fontWeight={'bold'} color={'green'} fontStyle={'italic'}>
                      {`${parseFloat((product.price / 100).toString()).toFixed(2)} $` || 'NAN'}
                    </Text>
                  </Box>
                </Flex>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      }
    </>
  );
};

export default ProductInfoModal;
