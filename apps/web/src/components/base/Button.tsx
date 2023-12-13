import { defineStyleConfig } from '@chakra-ui/react';

const Button = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    fontWeight: 'semibold',
    textTransform: 'uppercase',
    borderRadius: '4px',
    transition: '300ms',
    gap: 2,
    // _hover: {
    //   boxShadow: "lightGreen",
    // },
  },
  // Two sizes: sm and md
  sizes: {
    // sm: {
    //   fontSize: "sm",
    //   px: 4,
    //   py: 3,
    // },
    // md: {
    //   fontSize: "md",
    //   px: 6,
    //   py: 4,
    // },
  },
  // The default size and variant values
  defaultProps: {
    variant: 'outline',
    colorScheme: 'brand.primary.red',
  },
  // Two variants: outline and solid
  variants: {
    outline: ({ colorScheme }) => ({
      _hover: {
        bg: `${colorScheme}.900`,
      },
    }),
    solid: ({ colorScheme }) => ({
      _hover: {
        bg: `${colorScheme}.500`,
      },
    }),
    // outline: {
    //   border: "2px solid",
    //   //   borderColor: "brand.primary.green.500",
    //   _hover: {
    //     // bg: "brand.primary.green.500",
    //   },
    // },
    // solid: {
    //   border: "2px solid",
    //   //   bg: "brand.primary.green.500",
    //   //   borderColor: "brand.primary.green.500",
    //   _hover: {
    //     // bg: "transparent",
    //   },
    // },
  },
});

export default Button;
