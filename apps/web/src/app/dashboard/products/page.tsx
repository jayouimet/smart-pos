'use client';

import { useMutation, useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "@gql/categories";
import { DELETE_PRODUCT, DELETE_PRODUCT_CATEGORIES, GET_PRODUCTS_PAGE, INSERT_PRODUCT, INSERT_PRODUCT_CATEGORIES, UPDATE_PRODUCT } from "@gql/products";
import { Button, Card, CardBody, CardHeader, Center, Flex, Heading, Spacer, Stack, Text } from "@chakra-ui/react";
import UpsertModal, { ChakraInputEnum, UpsertModalField } from "@components/modals/UpsertModal";
import DataTable from "@components/tables/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Category from "@pos_types/categories/Category";
import Product from "@pos_types/products/Product";
import PaginationComponent from "@components/tables/PaginationComponent";

const columnHelper = createColumnHelper<Product>();

const columns = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: "Name"
  }),
  columnHelper.accessor("location", {
    cell: (info) => info.getValue(),
    header: "Location"
  }),
  columnHelper.accessor("description", {
    cell: (info) => info.getValue(),
    header: "Description"
  }),
  columnHelper.accessor("price", {
    cell: (info) => (info.getValue() / 100).toFixed(2),
    header: "Price",
    meta: {
      isNumeric: true
    }
  }),
];

const ProductsPage = () => {
  const { data: session } = useSession();

  const [fields, setFields] = useState<Array<UpsertModalField>>([
    {
      name: 'name',
      defaultValue: '',
      label: 'Name',
      type: ChakraInputEnum.Input,
      placeHolder: 'Name',
      formControlProps: {
        isRequired: true
      },
      inputProps: {
        maxLength: 250,
      }
    },
    {
      name: 'description',
      defaultValue: '',
      label: 'Description',
      type: ChakraInputEnum.Textarea,
      placeHolder: 'Description',
      formControlProps: {
        isRequired: true,
      },
      textareaProps: {
        maxLength: 650,
        resize: 'vertical',
      }
    },
    {
      name: 'location',
      defaultValue: '',
      label: 'Location',
      type: ChakraInputEnum.Input,
      placeHolder: 'Location',
      formControlProps: {
        isRequired: true
      }
    },
    {
      name: 'price',
      defaultValue: 0,
      label: 'Price',
      type: ChakraInputEnum.NumberInput,
      placeHolder: 'Price',
      formControlProps: {
        isRequired: true
      },
      numberInputProps: {
        precision: 0,
        step: 1,
        min: 0,
        max: 100000,
        keepWithinRange: true,
        clampValueOnBlur: true,
      },
      format: (data) => { return (data / 100).toFixed(2); },
    },
    {
      name: 'categories',
      defaultValues: [],
      selectOptions: [],
      label: 'Categories',
      type: ChakraInputEnum.MultiSelect,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [numberOfPages, setNumberOfPages] = useState<number>(1);
  const [initialValues, setInitialValues] = useState<{
    id?: string;
    name: string;
    description: string;
    price: number;
    location: string;
    categories: Array<string>;
  }>({
    id: undefined,
    name: '',
    description: '',
    location: '',
    price: 0,
    categories: []
  })

  const { data: products_data, loading: products_loading, error: products_error, refetch: products_refetch } = useQuery(GET_PRODUCTS_PAGE, {
    variables: {
      where: {},
      limit: 5,
      offset: (pageIndex - 1) * 5,
    },
    onCompleted: (data) => {
      setNumberOfPages(data.products_aggregate.aggregate.totalCount > 0 ? Math.ceil(data.products_aggregate.aggregate.totalCount / 5) : 0);
    },
    fetchPolicy: 'no-cache',
  });

  const { data: categories_data, loading: categories_loading, error: categories_error, refetch: categories_refetch } = useQuery(GET_CATEGORIES, {
    variables: {
      where: {},
    },
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      let categories = data.categories.map((category: Category) => {
        return {
          name: category.name,
          value: category.id,
          key: category.id
        }
      })
      let fs = [...fields];
      const i = fs.findIndex(f => f.name === 'categories');
      if (i === -1) {
        return;
      }
      fs[i].selectOptions = categories;
      setFields([...fs]);
    }
  });

  const deleteEmbedding = async (id: string) => {
    if (!session?.user?.organization_id) return;

    await axios.post(
      '/api/embeddings/delete',
      {
        ids: [id],
        collection_name: `organization_${session.user.organization_id}`
      }
    );
  }

  const resetEmbeddings = async () => {
    if (!session?.user?.organization_id) return;

    await axios.post('/api/embeddings/reset');
  }

  const upsertEmbeddings = async (id: string, product: Product) => {
    if (!session?.user?.organization_id) return;

    await axios.post(
      '/api/embeddings/upsert',
      {
        contents: [
          {
            id: id,
            pageContent: `${product.name}: ${product.description}`,
            metadata: product
          }
        ],
        collection_name: `organization_${session.user.organization_id}`
      }
    );
  }

  const [insertProduct] = useMutation(INSERT_PRODUCT);
  const [insertProductCategories] = useMutation(INSERT_PRODUCT_CATEGORIES);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [deleteProductCategories] = useMutation(DELETE_PRODUCT_CATEGORIES);

  const [deleteProduct, { data: delete_data, loading: delete_loading, error: delete_error }] = useMutation(DELETE_PRODUCT);

  const handleDelete = (product: Product) => {
    deleteProduct({
      variables: {
        id: product.id
      },
      onCompleted: (data) => {
        deleteEmbedding(data.delete_products_by_pk.id);
        products_refetch();
      }
    });
  }

  const onUpdateSubmitCallback = (product: any) => {
    let gqlProduct = {
      name: product?.name,
      description: product?.description,
      price: parseInt(product?.price),
      organization_id: session?.user.organization_id,
      location: product?.location
    }

    deleteProductCategories({
      variables: {
        where: {
          product_id: {
            _eq: product.id
          }
        }
      },
      onCompleted: () => {
        updateProduct({
          variables: {
            id: product.id,
            data: gqlProduct
          },
          onCompleted: (productData) => {
            upsertEmbeddings(
              productData.update_products_by_pk.id,
              gqlProduct
            );
            insertProductCategories({
              variables: {
                data: product.categories.map((cat) => {
                  return {
                    product_id: product.id,
                    category_id: cat
                  }
                })
              },
              onCompleted: products_refetch
            })
          }
        });
      }
    })

    handleClose();
  }

  const onInsertSubmitCallback = (product: any) => {
    let gqlProduct = {
      name: product?.name,
      description: product?.description,
      price: parseInt(product?.price),
      organization_id: session?.user.organization_id,
      location: product?.location,
      product_categories: {
        data: product.categories.map((cat) => {
          return {
            category_id: cat
          }
        })
      }
    }

    insertProduct({
      variables: {
        data: gqlProduct
      },
      onCompleted: (productData) => {
        upsertEmbeddings(
          productData.insert_products_one.id,
          { ...gqlProduct, product_categories: undefined}
        );
        products_refetch();
      }
    });

    handleClose();
  }

  const handleEdit = (product: Product) => {
    setOnSubmitCallback(() => onUpdateSubmitCallback);
    setInitialValues({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      location: product.location,
      categories: product?.product_categories ? product.product_categories.map((prod_cat) => {
        return prod_cat.category_id || '';
      }) : []
    });
    setIsModalOpen(true);
  }

  const handleAdd = () => {
    setOnSubmitCallback(() => onInsertSubmitCallback);
    setInitialValues({
      id: undefined,
      name: '',
      description: '',
      location: '',
      price: 0,
      categories: []
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

  const [onSubmitCallback, setOnSubmitCallback] = useState<(product: any) => void>(() => onInsertSubmitCallback);

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
              {'Products'}
            </Text>
          </Heading>
        </CardHeader>
        <CardBody>
          <Stack>
            <Flex pr={5} w={'100%'} direction={'row-reverse'}>
              <Button minWidth={'90px'} onClick={resetEmbeddings}>Reset</Button>
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
              data={products_loading || !products_data ? [] : products_data.products}
            />
          <Center>
            <PaginationComponent handlePageChange={handlePageChange} pageIndex={pageIndex} numberOfPages={numberOfPages}/>
          </Center>
          </Stack>
        </CardBody>
        {isModalOpen && (
          <UpsertModal
            title={'Product'}
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

export default ProductsPage;