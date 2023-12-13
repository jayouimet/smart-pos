import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { inputAnatomy } from '@chakra-ui/anatomy';

// This function creates a set of function that helps us create multipart component styles.
// This Select component anatomy here: https://chakra-ui.com/docs/components/select/theming#anatomy
const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  inputAnatomy.keys,
);

const Select = defineMultiStyleConfig({
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
      },
    }),
  },
  // The default size and variant values
  defaultProps: {
    // colorScheme: 'brand.primary.green',
    // variant: 'solid',
  },
});

export default Select;
