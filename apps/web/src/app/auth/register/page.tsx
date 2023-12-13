'use client';

import { Flex, Stack, Center } from '@chakra-ui/layout';
import { Formik, FormikProps, useFormik } from 'formik';
import { Button, Input } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type RegisterInputs = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
};

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();

  const formik = useFormik({
    initialValues: {
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
        <form onSubmit={formik.handleSubmit}>
          <Stack
            spacing={4} 
            w={320}
          >
            <Input 
              name="email" 
              placeholder='Email' 
              onChange={formik.handleChange}
              value={formik.values.email
            }/>
            <Input 
              name="first_name" 
              placeholder='First name' 
              onChange={formik.handleChange}
              value={formik.values.first_name
            }/>
            <Input 
              name="last_name" 
              placeholder='Last name' 
              onChange={formik.handleChange}
              value={formik.values.last_name
            }/>
            <Input 
              name="phone_number" 
              placeholder='Phone number' 
              onChange={formik.handleChange}
              value={formik.values.phone_number
            }/>
            <Input 
              name="password"
              type="password"
              placeholder='Password'
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <Button type="submit">Submit</Button>
          </Stack>
        </form>
      </Center>
    </Flex>
  )
}
