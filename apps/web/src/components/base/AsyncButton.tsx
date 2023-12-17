import React, { useState } from 'react';
import { Button, ButtonProps, Spinner } from '@chakra-ui/react';

interface AsyncButtonProps extends ButtonProps {
  onClick: () => Promise<any>;
  buttonText: string;
}

const AsyncButton = (props: AsyncButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { onClick, buttonText, ...rest } = props;

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await onClick();
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Button
      onClick={handleClick}
      isLoading={isLoading}
      loadingText={buttonText}
      {...rest}
    >
      {isLoading ? <Spinner size="sm" /> : buttonText}
    </Button>
  );
};

export default AsyncButton;
