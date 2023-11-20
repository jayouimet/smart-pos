'use client';

import { Box, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { capitalize } from '@utils/helperFunctions';

export default function DashboardHeader() {
  const pathname = usePathname();

  const [title, setTitle] = useState<string>('Dashboard');

  useEffect(() => {
    if (pathname) {
      const parts = pathname.split('/');
      setTitle(capitalize(parts[2] ?? parts[1]));
    }
  }, [pathname]);

  return (
    <Flex
      justify={'space-between'}
      align={{ base: 'flex-start', md: 'center' }}
      direction={{ base: 'column-reverse', md: 'row' }}
      gap={{ base: 3, md: 6 }}
      mb={4}
    >
      <Text fontSize={'5xl'} fontWeight="bold">
        {title}
      </Text>
    </Flex>
  );
}
