'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, extendTheme, ThemeConfig } from '@chakra-ui/react';
import Button from '@components/base/Button';
import Card from '@components/base/Card';
import Input from '@components/base/Input';
import NumberInput from '@components/base/NumberInput';
import Select from '@components/base/Select';
import Textarea from '@components/base/Textarea';
import FormLabel from '@components/base/FormLabel';
import Modal from '@components/base/Modal';
import Link from '@components/base/Link';
import '@fontsource/montserrat';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Montserrat', sans-serif`,
    body: `'Montserrat', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: '#332929', // Or any other color from the Chakra UI theme or custom palette
        color: 'white', // This sets the default text color
      },
    },
  },
  colors: {
    brand: {
      // custom color palette for sparkr
      bg: {
        main: '#1F1F22',
        primary: '#332929',
        secondary: 'rgba(255, 255, 255, 0.30)',
      },
      alpha: {
        redAlpha: {
          100: 'rgba(255, 1, 1, 0.10)',
          200: 'rgba(255, 1, 1, 0.20)',
          300: 'rgba(255, 1, 1, 0.30)',
          400: 'rgba(255, 1, 1, 0.40)',
          500: 'rgba(255, 1, 1, 0.50)',
          600: 'rgba(255, 1, 1, 0.60)',
          700: 'rgba(255, 1, 1, 0.70)',
          800: 'rgba(255, 1, 1, 0.80)',
          900: 'rgba(255, 1, 1, 0.90)',
        },
      },
      primary: {
        gray: {
          50: '#F2F2F2',
          100: '#DBDBDB',
          200: '#C4C4C4',
          300: '#ADADAD',
          400: '#969696',
          500: '#808080',
          600: '#666666',
          700: '#4D4D4D',
          800: '#333333',
          900: '#1A1A1A',
        },
        red: {
          100: '#FED7D7',
          200: '#FEB2B2',
          300: '#FC8181',
          400: '#F56565',
          500: '#E53E3E',
          600: '#C53030',
          700: '#9B2C2C',
          800: '#822727',
          900: '#63171B',
        },
      },
      secondary: {
        white: 'white',
        tangerine: '#F78D57',
        pineGreen: '#1C7663',
        robinEggBlue: '#0ACECB',
      },
      tertiary: {
        midnightGreen: '#065261',
        blueMunsell: '#0099A5',
        uranianBlue: '#B1DEF5',
        sunset: '#F4D0A0',
        silver: '#CCCCCC',
      },
    },
  },
  shadows: {
    lightRed: '0 0 3px 3px var(--chakra-colors-brand-primary-red-100)',
  },
  components: {
    Button,
    Card,
    Input,
    NumberInput,
    Select,
    Textarea,
    Modal,
    FormLabel,
    Link,
  },
});

function ChakraProviders({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </CacheProvider>
  );
}

export default ChakraProviders;
