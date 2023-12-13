import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { inputAnatomy } from '@chakra-ui/anatomy';

// This function creates a set of function that helps us create multipart component styles.
// This Input component anatomy here: https://chakra-ui.com/docs/components/input/theming#anatomy
const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  inputAnatomy.keys,
);

const Input = defineMultiStyleConfig({
  // The default size and variant values
  defaultProps: {
    // colorScheme: 'brand.primary.green',
    // variant: 'solid',
  },
  // The styles all button have in common
  baseStyle: ({ colorScheme }) => ({
    field: {
      fontWeight: 'normal',
      borderRadius: '4px',
    },
  }),
  sizes: {},
  variants: {
    outline: ({ colorScheme }) => ({
      field: {
        _focusVisible: {
          borderColor: `${colorScheme}.100`,
          borderWidth: '1px',
          boxShadow: 'none',
          color: 'white',
        },
      },
    }),
    solid: ({ colorScheme }) => ({
      field: {
        background: 'brand.primary.gray.400',
        _focusVisible: {
          shadow: 'lg',
        },
      },
    }),
  },
});

export default Input;
