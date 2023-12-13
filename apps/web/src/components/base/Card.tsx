import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { cardAnatomy } from '@chakra-ui/anatomy';

// This function creates a set of function that helps us create multipart component styles.
// This Input component anatomy here: https://chakra-ui.com/docs/components/input/theming#anatomy
const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  cardAnatomy.keys,
);

const Card = defineMultiStyleConfig({
  // The styles all button have in common
  baseStyle: ({ colorScheme }) => ({
    container: {
      backgroundColor: `${colorScheme}`,
      height: '100%',
      fontFamily: 'Montserrat',
      overflow: 'hidden',
    },
    header: {
      fontsize: { base: 'md', md: 'xl' },
      // pb: 2,
      py: 2,
    },
    body: {
      pt: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      '&::-webkit-scrollbar': {
        width: '6px',
      },
      '&::-webkit-scrollbar-track': {
        width: '8px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'var(--chakra-colors-gray-400)',
        borderRadius: '24px',
      },
    },
    footer: {
      paddingTop: '1px',
    },
  }),
  // The default size and variant values
  defaultProps: {
    colorScheme: 'whiteAlpha.400',
  },
});

export default Card;
