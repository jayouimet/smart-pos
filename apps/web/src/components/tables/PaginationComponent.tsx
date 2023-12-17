import { Box, IconButton, Stack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationComponentProps {
  pageIndex: number;
  numberOfPages: number;
  handlePageChange: (page: number) => void;
}

const PaginationComponent = ({
  pageIndex,
  numberOfPages,
  handlePageChange
}: PaginationComponentProps) => {
  const [pages, setPages] = useState<Array<number>>([]);

  useEffect(() => {
    let p = [1];
    if (pageIndex > 4) {
      p.push(-1);
    }
  
    let n = Math.ceil(numberOfPages);
    console.log(numberOfPages);

    for (let i = pageIndex - 2; i <= (pageIndex + 2); i++) {
      if (i > 1 && i < n) {
        p.push(i);
      }
    }
  
    if (pageIndex < n - 3) {
      p.push(-1);
    }
  
    if (n > 1) {
      p.push(n);
    }

    setPages([...p]);
  }, [pageIndex, numberOfPages, setPages])

  return (
    <Stack direction={'row'} spacing={4}>
      <IconButton
        isDisabled={pageIndex <= 1}
        onClick={
          pageIndex > 1 ? 
            () => handlePageChange(pageIndex - 1) :
            undefined
        }
        aria-label="Previous Page"
        size="xs"
        icon={<FiChevronLeft/>}
      />
      {pages.map((page, index) => {
        return <Box 
          key={`page-selector-${index}`} 
          onClick={
            page !== pageIndex && page !== -1 ? 
              () => handlePageChange(page) :
              undefined
          }
          _hover={ 
            page !== pageIndex && page !== -1 ? 
            { 
              color: 'brand.primary.red.100', 
              cursor: 'pointer' 
            } : 
            {
              cursor: 'default' 
            }
          }
          color={
            page === pageIndex ? 
            'brand.primary.red.200' : 
            'brand.secondary.white'
          }>
            {page !== -1 ? page : "..."}
          </Box>
      })}
      <IconButton
        isDisabled={pageIndex >= Math.ceil(numberOfPages)}
        onClick={
          pageIndex < Math.ceil(numberOfPages) ? 
            () => handlePageChange(pageIndex + 1) :
            undefined
        }
        aria-label="Next Page"
        size="xs"
        icon={<FiChevronRight/>}
      />
    </Stack>
  );
};

export default PaginationComponent;
