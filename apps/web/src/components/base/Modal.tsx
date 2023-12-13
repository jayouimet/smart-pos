import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { modalAnatomy } from '@chakra-ui/anatomy';

// This function creates a set of function that helps us create multipart component styles.
// This Input component anatomy here: https://chakra-ui.com/docs/components/input/theming#anatomy
const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  modalAnatomy.keys,
);

const Modal = defineMultiStyleConfig({
  // The styles all button have in common
  baseStyle: {
    dialog: {
      bg: 'brand.primary.red.600',
      borderRadius: 20,
      mx: 3,
    },
  },
  sizes: {},
  variants: {},
  // The default size and variant values
  defaultProps: {
    // colorScheme: 'brand.primary.green',
  },
});

export default Modal;
