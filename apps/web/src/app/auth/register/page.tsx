'use client';

import { Flex, Stack, Center } from '@chakra-ui/layout';
import { Formik, FormikProps, useFormik } from 'formik';
import { Button, Input, Link, Select, FormControl, FormLabel } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GET_ORGANIZATIONS } from '@app/gql/organizations';
import { useQuery } from '@apollo/client';
import Organization from 'types/organizations/Organization';
import SelectOption from '@components/base/SelectOption';

type RegisterInputs = {
  organization_id: undefined | string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
};

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();

  const { data: org_data, loading: org_loading, error: org_error, refetch: org_refetch } = useQuery(GET_ORGANIZATIONS, {
    variables: {
      where: {}
    },
    fetchPolicy: 'no-cache'
  });

  const formik = useFormik({
    initialValues: {
      organization_id: undefined,
      email: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      password: ''
    },
    onSubmit: async (values: RegisterInputs, {setSubmitting}) => {
      const res = await signIn('credentials', {
        redirect: true,
        email: values.email,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
        phone_number: values.phone_number,
        organization_id: values.organization_id,
        action: 'register',
        callbackUrl: `/dashboard`,
      });
      if (res?.error) {
        setError(res.error);
      } else {
        setError(undefined);
      }
      if (res?.url) router.push(res.url);
      setSubmitting(false);
    },
  });

  return (
    <Flex 
      h={'100vh'}
      m={'auto'}
      w={'fit-content'}
    >
      <Center>
        <Stack>
          <form onSubmit={formik.handleSubmit}>
            <Stack
              spacing={4} 
              w={320}
            >
              <FormControl isRequired>
                <FormLabel>{'Organization'}</FormLabel>
                <Select
                  name={'organization_id'}
                  value={formik.values.organization_id || (!org_loading && org_data.organizations?.[0]?.id) || undefined}
                  onChange={formik.handleChange}
                >
                  {
                    !org_loading && org_data.organizations.map((organization: Organization) => {
                      return (
                        <SelectOption key={organization.id} value={organization.id}>{organization.name}</SelectOption>
                      );
                    })
                  }
                </Select>
              </FormControl>
              <FormLabel>{'User informations'}</FormLabel>
              <FormControl isRequired>
                <Input 
                  name="email" 
                  placeholder='Email' 
                  onChange={formik.handleChange}
                  value={formik.values.email
                }/>
              </FormControl>
              <FormControl isRequired>
                <Input 
                  name="first_name" 
                  placeholder='First name' 
                  onChange={formik.handleChange}
                  value={formik.values.first_name
                }/>
              </FormControl>
              <FormControl isRequired>
                <Input 
                  name="last_name" 
                  placeholder='Last name' 
                  onChange={formik.handleChange}
                  value={formik.values.last_name
                }/>
              </FormControl>
              <FormControl>
                <Input 
                  name="phone_number" 
                  placeholder='Phone number' 
                  onChange={formik.handleChange}
                  value={formik.values.phone_number
                }/>
              </FormControl>
              <FormControl isRequired>
                <Input 
                  name="password"
                  type="password"
                  placeholder='Password'
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
              </FormControl>
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
          <Center>
            <Link variant={'gray'} href={"/auth/signin"}>Already have an account?</Link>
          </Center>
        </Stack>
      </Center>
    </Flex>
  )
}
