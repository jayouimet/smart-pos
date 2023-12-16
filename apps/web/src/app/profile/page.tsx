'use client';

import {
  Button,
  CardBody,
  CardHeader,
  Center,
  Flex,
  Heading,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar } from '@chakra-ui/react';
import { Card } from '@chakra-ui/react';
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { GET_USER } from '@app/gql/users';
import User from '@type/users/User';

const SAVE_PROFILE = gql`
  mutation mutationUpdateProfile(
    $userId: uuid!
    $firstName: String!
    $lastName: String!
  ) {
    update_users_by_pk(
      pk_columns: { id: $userId }
      _set: {
        first_name: $firstName
        last_name: $lastName
      }
    ) {
      id
    }
  }
`;

const ProfilePage = () => {
  const { data: session, update: updateSession } = useSession();
  const toast = useToast();
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  const {} = useQuery(GET_USER, {
    variables: {
      id: session?.user.id,
    },
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      const user: User = data.users_by_pk;
      setEmail(user.email ? user.email : '');
      setFirstName(user.first_name ? user.first_name : '');
      setLastName(user.last_name ? user.last_name : '');
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const [saveProfile, { data, loading, error }] = useMutation(SAVE_PROFILE);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleSaveProfile = async () => {
    saveProfile({
      variables: {
        userId: session?.user.id,
        firstName: firstName,
        lastName: lastName,
      },
    });

    if (error) {
      toast({
        title: `Error updating the profile`,
        status: 'error',
        isClosable: true,
      });
    } else {
      toast({
        title: `Profile updated`,
        status: 'success',
        isClosable: true,
      });
    }
  };

  return (
    <Center>
      <Card mt={16} w={{ base: 'full', md: 'fit-content' }} boxShadow={'2xl'}>
        <CardHeader>
          <Heading mb={'4'}>Your profile</Heading>
        </CardHeader>
        <CardBody>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align={'center'}
            gap={4}
            mb={4}
          >
            <Avatar size={'2xl'} />
            <Stack w="full">
              <Input
                placeholder={'Email'}
                minWidth={{ md: 400 }}
                readOnly
                value={email}
              />
              <Input
                placeholder={'First name'}
                minWidth={{ md: 400 }}
                onChange={handleFirstNameChange}
                value={firstName}
              />
              <Input
                placeholder={'Last name'}
                minWidth={{ md: 400 }}
                onChange={handleLastNameChange}
                value={lastName}
              />
            </Stack>
          </Flex>
          <Flex>
            <Button ml={'auto'} width={120} onClick={handleSaveProfile}>
              Save
            </Button>
          </Flex>
        </CardBody>
      </Card>
    </Center>
  );
};

export default ProfilePage;
