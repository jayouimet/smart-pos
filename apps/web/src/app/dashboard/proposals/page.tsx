"use client";

import { Box, Button, Center, Stack, Text, Textarea } from "@chakra-ui/react";
import { useCompletion } from "ai/react";
import { useState } from "react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const [inputContent, setInputContent] = useState<string>("");
  const [isLoading, setIsLoadingOpenAI] = useState<boolean>(false);
  const router = useRouter();

  const { complete: completeOpenAI, completion: completionOpenAI } =
    useCompletion({
      api: "/api/generateText",
      onError: (err) => {
        setIsLoadingOpenAI(false);
        console.error(err);
      },
      onFinish: () => {
        setIsLoadingOpenAI(false);
      },
    });

  const handleClick = () => {
    completeOpenAI(inputContent);
  };

  const handleClickEmbeddings = () => {
    router.push("/dashboard/embeddings");
  };

  const handleInputContent = (event) => {
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
          <Textarea
            placeholder={"Prompt goes here ..."}
            className={""}
            bgColor={"gray.800"}
            h={"2xs"}
            size={"md"}
            resize={"none"}
            onChange={handleInputContent}
            value={inputContent}
          ></Textarea>
          <Button
            className={"hover:bg-white"}
            bgColor={"gray.800"}
            mx={"auto"}
            isLoading={isLoading}
            onClick={handleClick}
          >
            Generate text
          </Button>
          <Textarea
            placeholder={"Generated output ..."}
            bgColor={"gray.800"}
            h={"2xs"}
            size={"md"}
            resize={"none"}
            readOnly={true}
            value={completionOpenAI}
          ></Textarea>
          <Button
            className={"hover:bg-white"}
            bgColor={"gray.800"}
            ml={"auto"}
            onClick={handleClickEmbeddings}
          >
            Embeddings <ChevronRightIcon />
          </Button>
        </Stack>
      </Box>
    </Center>
  );
};

export default HomePage;
