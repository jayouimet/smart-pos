'use client'

import {
  Button,
  Grid, Stack, Textarea
} from '@chakra-ui/react';
import { useCompletion } from 'ai/react';
import { ChangeEvent, useEffect, useState } from 'react';

function DashboardIndex() {
  const [prompt, setPrompt] = useState<string>("");
  const { complete, completion } = useCompletion({
    api: '/api/generateText',
    onError: (err: Error) => {
      console.error(err);
    },
  });

  const handleChangePrompt = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  }

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
      <Stack>
        <Textarea value={prompt} resize={"none"} width={"25vw"} height={"20vh"} onChange={handleChangePrompt} />
        <Button onClick={() => complete("hello, how are you doing")}>Find it</Button>
        <Textarea value={completion} resize={"none"} width={"25vw"} height={"20vh"} readOnly={true} />
      </Stack>
    </Grid>
  );
}

export default DashboardIndex;
