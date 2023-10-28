import { Box, Center, Text } from "@chakra-ui/react";
import exampleImg from "@assets/example.jpg";
import NextImage from "next/image";

const ServicesPage = () => {
  return (
    <Center py={6}>
      <Box
        maxW={"445px"}
        w={"full"}
        bg={"gray.900"}
        boxShadow={"2xl"}
        rounded={"lg"}
        p={9}
        pb={9}
        overflow={"hidden"}
      >
        <Center py={6}>
          <Box
            h={32}
            w={32}
            pos={"relative"}
            borderRadius="50%"
            overflow="hidden"
          >
            <NextImage src={exampleImg} alt="My Picture" fill />
          </Box>
        </Center>

        <Box h={"6vh"} mb={6} pos={"relative"}>
          <Text
            color={"green.500"}
            textTransform={"uppercase"}
            fontWeight={800}
            fontSize={"lg"}
            letterSpacing={1.1}
          >
            Index page for landing
          </Text>
        </Box>
      </Box>
    </Center>
  );
};

export default ServicesPage;
