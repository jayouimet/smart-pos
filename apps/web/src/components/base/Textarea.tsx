import { defineStyleConfig } from '@chakra-ui/react';

const Textarea = defineStyleConfig({
  // The styles all button have in common
  baseStyle: ({ colorScheme }) => ({
    // fontWeight: "normal",
    borderRadius: 'base',
    // _hover: {
    //   // borderColor: `${colorScheme}.100`,
    //   // borderWidth: "1px",
    //   // boxShadow: "none",
    //   background: `red`,
    // },
  }),
  sizes: {},
  variants: {
    outline: ({ colorScheme }) => ({
      _focusVisible: {
        borderColor: `${colorScheme}.100`,
        borderWidth: '1px',
        boxShadow: 'none',
      },
      _focus: {
        borderColor: `${colorScheme}.100`,
        borderWidth: '1px',
        boxShadow: 'none',
      },
      // _hover: {
      //   borderColor: `${colorScheme}.100`,
      //   borderWidth: "1px",
      //   boxShadow: "none",
      // },
    }),
  },
  // The default size and variant values
  defaultProps: {
    variant: 'outline',
    colorScheme: 'brand.primary.green',
  },
});

export default Textarea;
