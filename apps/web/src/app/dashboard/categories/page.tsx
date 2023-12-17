'use client';

import { useMutation, useQuery } from "@apollo/client";
import { DELETE_CATEGORY, GET_CATEGORIES_PAGE, INSERT_CATEGORY, UPDATE_CATEGORY } from "@gql/categories";
import { Button, Card, CardBody, CardHeader, Center, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import UpsertModal, { ChakraInputEnum } from "@components/modals/UpsertModal";
import DataTable from "@components/tables/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Category from "@pos_types/categories/Category";
import PaginationComponent from "@components/tables/PaginationComponent";

const columnHelper = createColumnHelper<Category>();

const columns = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: "Name"
  }),
];

const CategoriesPage = () => {
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
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [numberOfPages, setNumberOfPages] = useState<number>(1);
  const [initialValues, setInitialValues] = useState<{
    id?: string;
    name: string;
  }>({
    id: undefined,
    name: '',
  })

  const { data, loading, error, refetch } = useQuery(GET_CATEGORIES_PAGE, {
    variables: {
      where: {},
      limit: 7,
      offset: (pageIndex - 1) * 7,
    },
    onCompleted: (data) => {
      setNumberOfPages(data.categories_aggregate.aggregate.totalCount > 0 ? Math.ceil(data.categories_aggregate.aggregate.totalCount / 7) : 0);
    },
    fetchPolicy: 'no-cache',
  });

  const [insertCategory] = useMutation(INSERT_CATEGORY);
  const [updateCategory] = useMutation(UPDATE_CATEGORY);
  const [deleteCategory] = useMutation(DELETE_CATEGORY);

  const handleDelete = (category: Category) => {
    deleteCategory({
      variables: {
        id: category.id
      },
      onCompleted: refetch
    });
  }

  const onUpdateSubmitCallback = (category: any) => {
    let gqlCategory = {
      name: category?.name,
      organization_id: session?.user.organization_id
    }

    updateCategory({
      variables: {
        id: category.id,
        data: gqlCategory,
      },
      onCompleted: refetch
    });
    
    handleClose();
  }

  const onInsertSubmitCallback = (category: any) => {
    let gqlCategory = {
      name: category?.name,
      organization_id: session?.user.organization_id
    }

    insertCategory({
      variables: {
        data: gqlCategory
      },
      onCompleted: refetch
    });

    handleClose();
  }

  const handleEdit = (category: Category) => {
    setOnSubmitCallback(() => onUpdateSubmitCallback);
    setInitialValues({
      id: category.id,
      name: category.name,
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

  const handlePageChange = (page: number) => {
    console.log(page);
    setPageIndex(page);
  };

  const [onSubmitCallback, setOnSubmitCallback] = useState<(category: any) => void>(() => onInsertSubmitCallback);

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
              data={loading ? [] : data.categories} 
            />
            <Center>
              <PaginationComponent handlePageChange={handlePageChange} pageIndex={pageIndex} numberOfPages={numberOfPages}/>
            </Center>
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

export default CategoriesPage;