'use client';

import { Flex, Stack, Center } from '@chakra-ui/layout';
import { useFormik } from 'formik';
import { Button, Input, Link, Spinner, useToast, Box } from '@chakra-ui/react';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';

type SigninInputs = {
  email: string;
  password: string;
};

export default function Signin() {
  const router = useRouter();
  const toast = useToast();

  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState(false);

  const SignupSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validateOnChange: false,
    validationSchema: SignupSchema,
    onSubmit: async (values: SigninInputs, {setSubmitting}) => {
      setIsLoading(true);
      const res = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
        action: 'signin',
      })
      if (res) {
        setIsLoading(false);
      }
      if (res?.error) {
        toast({
          title: 'Bad credentials',
          description: "Credentials provided do not match",
          status: 'error',
          duration: 6000,
          isClosable: true,
        })
      } 
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (status === 'authenticated' && session.user.id) {
      window.location.href = '/dashboard';
    }
  }, [status, session]);

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
              <Input 
                name={"email"}
                placeholder={'Email'} 
                onChange={formik.handleChange}
                value={formik.values.email
              }/>
              {formik.touched.email && formik.errors.email ? (
                <Box color={'red'}>{formik.errors.email}</Box>
              ) : null}
              <Input 
                name={"password"}
                type={"password"}
                placeholder={'Password'}
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              <Button 
                type={"submit"}
                isLoading={isLoading}
                loadingText={'Sign in'}
              >
                  {isLoading ? <Spinner size="sm" /> : 'Sign in'}
              </Button>
            </Stack>
          </form>
          <Center>
            <Link variant={'gray'} href={"/register"}>Do not have an account?</Link>
          </Center>
        </Stack>
      </Center>
    </Flex>
  )
}
