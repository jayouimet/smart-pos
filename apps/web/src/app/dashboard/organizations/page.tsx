'use client';

import { useMutation, useQuery } from "@apollo/client";
import { DELETE_CATEGORY, GET_CATEGORIES, INSERT_CATEGORY, UPDATE_CATEGORY } from "@app/gql/categories";
import { DELETE_ORGANIZATION, GET_ORGANIZATIONS, INSERT_ORGANIZATION, UPDATE_ORGANIZATION } from "@app/gql/organizations";
import { Button, Card, CardBody, CardHeader, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import UpsertModal, { ChakraInputEnum } from "@components/modals/UpsertModal";
import DataTable from "@components/tables/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Category from "@type/categories/Category";
import Organization from "@type/organizations/Organization";

const columnHelper = createColumnHelper<Category>();

const columns = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: "Name"
  }),
];

const OrganizationsPage = () => {
  const { data: session } = useSession();

  const [fields, setFields] = useState([
    {
      name: 'name',
      defaultValue: '',
      label: 'Name',
      type: ChakraInputEnum.Input,
      placeHolder: 'Name',
      formControlProps: {
        isRequired: true
      }
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<{
    id?: string;
    name: string;
  }>({
    id: undefined,
    name: '',
  })

  const { data, loading, error, refetch } = useQuery(GET_ORGANIZATIONS, {
    variables: {
      where: {}
    },
    fetchPolicy: 'no-cache',
  });

  const [insertOrganization] = useMutation(INSERT_ORGANIZATION);
  const [updateOrganization] = useMutation(UPDATE_ORGANIZATION);
  const [deleteOrganization] = useMutation(DELETE_ORGANIZATION);

  const handleDelete = (organization: Organization) => {
    deleteOrganization({
      variables: {
        id: organization.id
      },
      onCompleted: refetch
    });
  }

  const onUpdateSubmitCallback = (organization: any) => {
    let gqlOrganization = {
      name: organization?.name,
    }

    updateOrganization({
      variables: {
        id: organization.id,
        data: gqlOrganization
      },
      onCompleted: refetch
    });
    
    handleClose();
  }

  const onInsertSubmitCallback = (organization: any) => {
    let gqlOrganization = {
      name: organization?.name,
    }

    insertOrganization({
      variables: {
        data: gqlOrganization
      },
      onCompleted: refetch
    });

    handleClose();
  }

  const handleEdit = (organization: Organization) => {
    setOnSubmitCallback(() => onUpdateSubmitCallback);
    setInitialValues({
      id: organization.id,
      name: organization.name,
    });
    setIsModalOpen(true);
  }

  const handleAdd = () => {
    setOnSubmitCallback(() => onInsertSubmitCallback);
    setInitialValues({
      id: undefined,
      name: '',
    })
    setIsModalOpen(true);
  }

  const handleClose = () => {
    setIsModalOpen(false);
  }

  const [onSubmitCallback, setOnSubmitCallback] = useState<(organization: any) => void>(() => onInsertSubmitCallback);

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
              isDisabledEdit={() => { return session?.user.role !== 'admin' }}
              isDisabledDelete={() => { return session?.user.role !== 'admin' }}
              handleEdit={data => handleEdit(data)} 
              handleDelete={data => handleDelete(data)} 
              columns={columns} 
              data={loading ? [] : data.organizations} 
            />
          </Stack>
        </CardBody>
        {isModalOpen && (
          <UpsertModal
            title={'Category'}
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

export default OrganizationsPage;