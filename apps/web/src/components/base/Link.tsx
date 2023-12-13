import { defineStyleConfig } from '@chakra-ui/react';

const Link = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    mb: 0.5,
  },
  // Two sizes: sm and md
  sizes: {},
  // Two variants: outline and solid
  variants: {
    gray: ({ colorScheme }) => ({
      color: 'blackAlpha.500',
      bg: 'red',
    }),
  },
  // The default size and variant values
  defaultProps: {
    variant: 'gray',
  },
});

export default Link;
