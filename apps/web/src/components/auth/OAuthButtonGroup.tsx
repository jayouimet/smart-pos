'use client';

import { Button, ButtonGroup, VisuallyHidden } from '@chakra-ui/react';
import {
  // GitHubIcon,
  // TwitterIcon,
  GoogleIcon,
} from '@components/icons/OAuthProviderIcons';
import { capitalize } from '@utils/helperFunctions';
import { signIn } from 'next-auth/react';

const providers = [
  { label: 'Google', name: 'google', icon: <GoogleIcon /> },
  //   { label: "Twitter", name: "twitter", icon: <TwitterIcon /> },
  //   { label: "Github", name: "gitHub", icon: <GitHubIcon /> },
];

interface OAuthButtonGroupProps {
  authType: string;
}

export const OAuthButtonGroup = ({ authType }: OAuthButtonGroupProps) => (
  <ButtonGroup variant="secondary" spacing="4">
    {providers.map(({ label, name, icon }) => (
      <Button
        leftIcon={icon}
        variant="outline"
        key={name}
        flexGrow={1}
        onClick={() =>
          signIn(name.toLowerCase(), {
            callbackUrl: '/dashboard',
          })
        }
      >
        {`${capitalize(authType)} with ${label}`}
      </Button>
    ))}
  </ButtonGroup>
);
