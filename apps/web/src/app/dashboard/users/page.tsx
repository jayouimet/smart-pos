'use client';

import { useMutation, useQuery } from "@apollo/client";
import { Button, Card, CardBody, CardHeader, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import UpsertModal, { ChakraInputEnum } from "@components/modals/UpsertModal";
import DataTable from "@components/tables/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { useState } from "react";
import User from "@pos_types/users/User";
import { DELETE_USER, GET_USERS, INSERT_USER, UPDATE_USER } from "@gql/users";

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor("email", {
    cell: (info) => info.getValue(),
    header: "Email"
  }),
  columnHelper.accessor("first_name", {
    cell: (info) => info.getValue(),
    header: "First name"
  }),
  columnHelper.accessor("last_name", {
    cell: (info) => info.getValue(),
    header: "Last name"
  }),
];

const UsersPage = () => {
  const { data: session } = useSession();

  const [fields, setFields] = useState([
    {
      name: 'first_name',
      defaultValue: '',
      label: 'First name',
      type: ChakraInputEnum.Input,
      placeHolder: 'First name',
      formControlProps: {
        isRequired: true
      }
    },
    {
      name: 'last_name',
      defaultValue: '',
      label: 'Last name',
      type: ChakraInputEnum.Input,
      placeHolder: 'Last name',
      formControlProps: {
        isRequired: true
      }
    },
    {
      name: 'email',
      defaultValue: '',
      label: 'Email',
      type: ChakraInputEnum.Input,
      placeHolder: 'Email',
      formControlProps: {
        isRequired: true
      }
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<{
    id?: string;
    email: string;
    last_name: string;
    first_name: string;
  }>({
    id: undefined,
    email: '',
    last_name: '',
    first_name: '',
  })

  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    variables: {
      where: {}
    },
    fetchPolicy: 'no-cache',
  });

  const [insertUser] = useMutation(INSERT_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const handleDelete = (user: User) => {
    deleteUser({
      variables: {
        id: user.id
      },
      onCompleted: refetch
    });
  }

  const onUpdateSubmitCallback = (user: any) => {
    let gqlUser = {
      email: user?.email,
      first_name: user?.first_name,
      last_name: user?.last_name,
    }

    updateUser({
      variables: {
        id: user.id,
        data: gqlUser
      },
      onCompleted: refetch
    });
    
    handleClose();
  }

  const onInsertSubmitCallback = (user: any) => {
    let gqlUser = {
      email: user?.email,
      first_name: user?.first_name,
      last_name: user?.last_name,
    }

    insertUser({
      variables: {
        data: gqlUser
      },
      onCompleted: refetch
    });

    handleClose();
  }

  const handleEdit = (user: User) => {
    setOnSubmitCallback(() => onUpdateSubmitCallback);
    setInitialValues({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    });
    setIsModalOpen(true);
  }

  const handleAdd = () => {
    setOnSubmitCallback(() => onInsertSubmitCallback);
    setInitialValues({
      id: undefined,
      email: '',
      first_name: '',
      last_name: '',
    })
    setIsModalOpen(true);
  }

  const handleClose = () => {
    setIsModalOpen(false);
  }

  const [onSubmitCallback, setOnSubmitCallback] = useState<(user: any) => void>(() => onInsertSubmitCallback);

  return (
    <Flex direction={'column'} h={'100vh'} py={3}>
      <Card 
        w={'100%'}
        h={'full'}
      >
        <CardHeader>
          <Heading
            mb={4}
          >
            <Text fontSize={'5xl'} fontWeight="bold">
              {'Categories'}
            </Text>
          </Heading>
        </CardHeader>
        <CardBody>
          <Stack>
            <Flex pr={5} w={'100%'} direction={'row-reverse'}>
              <Button minWidth={'90px'} onClick={handleAdd}>Add</Button>
            </Flex>
            <DataTable 
              isDisabledEdit={() => { 
                return (
                  session?.user.role !== 'admin' && 
                  session?.user.organization_role !== 'manager'
                ) 
              }}
              isDisabledDelete={() => { 
                return (
                  session?.user.role !== 'admin' && 
                  session?.user.organization_role !== 'manager'
                )
              }}
              handleEdit={data => handleEdit(data)} 
              handleDelete={data => handleDelete(data)} 
              columns={columns} 
              data={loading ? [] : data.users} 
            />
          </Stack>
        </CardBody>
        {isModalOpen && (
          <UpsertModal
            title={'User'}
            isModalOpen={isModalOpen}
            fields={fields}
            onClose={handleClose}
            onSubmitCallback={onSubmitCallback}
            initialValues={initialValues}
          />
        )}
      </Card>
    </Flex>
  );
}

export default UsersPage;