import {
  Card,
  CardHeader,
  CardBody,
  Grid,
  GridItem,
  Heading,
  Box,
  Text,
  Flex,
} from '@chakra-ui/react';
import { Checkbox, CheckboxGroup } from '@chakra-ui/react';

function DashboardIndex() {
  return (
    <Grid
      h="91vh"
      templateRows={{
        base: 'repeat(4, 1fr)',
        md: 'repeat(4, 1fr)',
        xl: 'repeat(2, 1fr)',
      }}
      templateColumns="repeat(6, 1fr)"
      gap={{ base: 3, xl: 4 }}
    >
      
    </Grid>
  );
}

export default DashboardIndex;
