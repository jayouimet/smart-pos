"use client";

import { Box, Button, Center, Stack, Text, Input } from "@chakra-ui/react";
import { useState } from "react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import axios from "axios";

const HomePage = () => {
  const [inputContent, setInputContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultEmbeddings, setResultEmbeddings] = useState<string | undefined>(
    undefined
  );
  const router = useRouter();

  const handleClick = async () => {
    setIsLoading(true);
    const res = await axios
      .post("/api/generateEmbeddingsMedium", { mediumPostId: inputContent })
      .then((response) => {
        setIsLoading(false);
        if (response.status == 200) {
          setResultEmbeddings("Embeddings added successfully.");
        }
      })
      .catch(() => {
        setIsLoading(false);
        setResultEmbeddings(
          "Could not add the embeddings, make sure it is a valid medium post ID."
        );
      });
  };

  const handleClickBack = () => {
    router.push("/dashboard/proposal");
  };

  const handleInputChange = (event) => {
    setInputContent(event.target.value);
  };

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
        <Box h={"6vh"} mb={6} pos={"relative"}>
          <Text
            color={"green.500"}
            textTransform={"uppercase"}
            fontWeight={800}
            fontSize={"lg"}
            letterSpacing={1.1}
          >
            Boilerplate
          </Text>
        </Box>
        <Stack className="space-y-4">
          <Button
            className={"hover:bg-white"}
            bgColor={"gray.800"}
            mr={"auto"}
            onClick={handleClickBack}
          >
            <ChevronLeftIcon /> Back
          </Button>
          <Input
            placeholder={"Medium post id ..."}
            size={"lg"}
            value={inputContent}
            onChange={handleInputChange}
          />
          {resultEmbeddings && <Text>{resultEmbeddings}</Text>}
          <Button
            className={"hover:bg-white"}
            bgColor={"gray.800"}
            mx={"auto"}
            isLoading={isLoading}
            onClick={handleClick}
          >
            Generate embeddings
          </Button>
        </Stack>
      </Box>
    </Center>
  );
};

export default HomePage;
