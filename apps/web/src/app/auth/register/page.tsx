'use client';

import { Flex, Stack, Center } from '@chakra-ui/layout';
import { useFormik } from 'formik';
import { Button, Input, Link, Select, FormControl, FormLabel, Spinner, useToast, Box } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GET_ORGANIZATIONS } from '@gql/organizations';
import { useQuery } from '@apollo/client';
import Organization from '@pos_types/organizations/Organization';
import SelectOption from '@components/base/SelectOption';
import * as Yup from 'yup';

type RegisterInputs = {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
};

export default function Register() {
  const router = useRouter();
  const toast = useToast();
  
  const [isLoading, setIsLoading] = useState(false);

  const [organizationId, setOrganizationId] = useState<string | undefined>()

  const { data: org_data, loading: org_loading, error: org_error, refetch: org_refetch } = useQuery(GET_ORGANIZATIONS, {
    variables: {
      where: {}
    },
    onCompleted: (data) => {
      setOrganizationId(data.organizations?.[0]?.id)
    },
    fetchPolicy: 'no-cache'
  });

  const RegistrationSchema = Yup.object().shape({
    first_name: Yup.string()
      .min(3, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    last_name: Yup.string()
      .min(3, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    password: Yup.string()
      .min(8, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match'),
    email: Yup.string().email('Invalid email').required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      confirm_password: ''
    },
    validateOnChange: false,
    validationSchema: RegistrationSchema,
    onSubmit: async (values: RegisterInputs, {setSubmitting}) => {
      const res = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
        organization_id: organizationId,
        action: 'register',
      });
      if (res) {
        setIsLoading(false);
      }
      if (res?.error) {
        toast({
          title: 'Email already in use',
          description: "This email address is already in use",
          status: 'error',
          duration: 6000,
          isClosable: true,
        })
      } 
      if (res?.ok) {
        router.push('/dashboard');
      }
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
                  value={organizationId}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setOrganizationId(e.currentTarget.value)}
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
              {formik.touched.email && formik.errors.email ? (
                <Box color={'red'}>{formik.errors.email}</Box>
              ) : null}
              <FormControl isRequired>
                <Input 
                  name="first_name" 
                  placeholder='First name' 
                  onChange={formik.handleChange}
                  value={formik.values.first_name
                }/>
              </FormControl>
              {formik.touched.first_name && formik.errors.first_name ? (
                <Box color={'red'}>{formik.errors.first_name}</Box>
              ) : null}
              <FormControl isRequired>
                <Input 
                  name="last_name" 
                  placeholder='Last name' 
                  onChange={formik.handleChange}
                  value={formik.values.last_name
                }/>
              </FormControl>
              {formik.touched.last_name && formik.errors.last_name ? (
                <Box color={'red'}>{formik.errors.last_name}</Box>
              ) : null}
              <FormControl isRequired>
                <Input 
                  name="password"
                  type="password"
                  placeholder='Password'
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
              </FormControl>
              {formik.touched.password && formik.errors.password ? (
                <Box color={'red'}>{formik.errors.password}</Box>
              ) : null}
              <FormControl isRequired>
                <Input 
                  name="confirm_password"
                  type="password"
                  placeholder='Confirm password'
                  onChange={formik.handleChange}
                  value={formik.values.confirm_password}
                />
              </FormControl>
              {formik.touched.confirm_password && formik.errors.confirm_password ? (
                <Box color={'red'}>{formik.errors.confirm_password}</Box>
              ) : null}
              <Button 
                type={"submit"}
                isLoading={isLoading}
                loadingText={'Sign up'}
              >
                  {isLoading ? <Spinner size="sm" /> : 'Sign up'}
              </Button>
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
