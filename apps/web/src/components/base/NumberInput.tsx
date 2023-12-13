import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { numberInputAnatomy } from '@chakra-ui/anatomy';

// This function creates a set of function that helps us create multipart component styles.
// This NumberInput component anatomy here: https://chakra-ui.com/docs/components/number-input/theming#anatomy
const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  numberInputAnatomy.keys,
);

const NumberInput = defineMultiStyleConfig({
  // The styles all button have in common
  baseStyle: ({ colorScheme }) => ({
    field: {
      fontWeight: 'normal',
      borderRadius: '4px',
    },
  }),
  sizes: {},
  variants: {
    solid: ({ colorScheme }) => ({
      field: {
        background: 'brand.primary.gray.400',
        color: 'white',
        _focusVisible: {
          shadow: 'lg',
        },
      },
      stepperGroup: {
        mr: 2,
      },
    }),
  },
  // The default size and variant values
  defaultProps: {
    // colorScheme: 'brand.primary.green',
    // variant: 'solid',
  },
});

export default NumberInput;
