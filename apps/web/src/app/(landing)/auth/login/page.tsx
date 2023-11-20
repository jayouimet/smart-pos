'use client';

import { Box, Container, Heading, Stack, Text } from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';
import { OAuthButtonGroup } from '@components/auth/OAuthButtonGroup';

const LoginPage = () => (
  <Container
    maxW="lg"
    py={{ base: '12', md: '24' }}
    px={{ base: '0', sm: '8' }}
  >
    <Stack spacing="8">
      <Stack spacing="6">
        <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
          <Heading size={{ base: 'xs', md: 'lg' }}>
            Log in to your account
          </Heading>
          <Text color="fg.muted">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              color="brand.primary.green.300"
              textDecoration="underline"
              _hover={{ color: 'brand.primary.green.100' }}
            >
              Register
            </Link>
          </Text>
        </Stack>
      </Stack>
      <Box
        py={{ base: '0', sm: '8' }}
        px={{ base: '4', sm: '10' }}
        bg={{ base: 'transparent', sm: 'bg.surface' }}
        boxShadow={{ base: 'none', sm: 'md' }}
        borderRadius={{ base: 'none', sm: 'xl' }}
      >
        <Stack spacing="6">
          <OAuthButtonGroup authType={'login'} />
        </Stack>
      </Box>
    </Stack>
  </Container>
);

export default LoginPage;
