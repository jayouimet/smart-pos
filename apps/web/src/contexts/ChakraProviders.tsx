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

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        bg: '#1F1F22', // Or any other color from the Chakra UI theme or custom palette
        color: 'white', // This sets the default text color
      },
    },
  },
  colors: {
    brand: {
      // custom color palette for sparkr
      bg: {
        main: '#1F1F22',
        secondary: 'rgba(255, 255, 255, 0.30)',
      },
      alpha: {
        greenAlpha: {
          100: 'rgba(1, 255, 140, 0.10)',
          200: 'rgba(1, 255, 140, 0.20)',
          300: 'rgba(1, 255, 140, 0.30)',
          400: 'rgba(1, 255, 140, 0.40)',
          500: 'rgba(1, 255, 140, 0.50)',
          600: 'rgba(1, 255, 140, 0.60)',
          700: 'rgba(1, 255, 140, 0.70)',
          800: 'rgba(1, 255, 140, 0.80)',
          900: 'rgba(1, 255, 140, 0.90)',
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
        green: {
          100: '#01FF8C',
          200: '#01E87F',
          300: '#01D072',
          400: '#01B965',
          500: '#01A259',
          600: '#008A4C',
          700: '#00733F',
          800: '#005B32',
          900: '#004425',
        },
        lime: {
          100: '#BFFF00',
          200: '#AEE800',
          300: '#9CD000',
          400: '#8BB900',
          500: '#79A200',
          600: '#688A00',
          700: '#567300',
          800: '#455B00',
          900: '#334400',
        },
        yellow: {
          100: '#FAC400',
          200: '#E3B200',
          300: '#CCA000',
          400: '#B58E00',
          500: '#9F7D00',
          600: '#886B00',
          700: '#715900',
          800: '#5A4700',
          900: '#433500',
        },
      },
      secondary: {
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
    lightGreen: '0 0 3px 3px var(--chakra-colors-brand-primary-green-100)',
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
