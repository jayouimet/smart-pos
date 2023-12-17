import { gql } from "@apollo/client";

////////////////////////////////////////////////////////////////////////////////
/*----------------------------     QUERIES    --------------------------------*/
////////////////////////////////////////////////////////////////////////////////

export const GET_PRODUCTS_PAGE = gql`
  query getProducts (
      $limit: Int!
      $offset: Int!
      $where: products_bool_exp!
    ) {
    products_aggregate(where: $where) {
      aggregate {
        totalCount: count
      }
    }
    products (
      where: $where,
      limit: $limit,
      offset: $offset,
      order_by: {
        name: asc
      }
    ) {
      id
      name
      description
      location
      price
      organization_id
      organization {
        id
        name
      }
      product_categories {
        id
        category_id
        category {
          id
          name
        }
      }
      created_at
      updated_at
    }
  }
`

////////////////////////////////////////////////////////////////////////////////
/*--------------------------     INSERTIONS    -------------------------------*/
////////////////////////////////////////////////////////////////////////////////

export const INSERT_PRODUCT = gql`
  mutation insertProduct ($data: products_insert_input!) {
    insert_products_one(object: $data) {
      id
    }
  }
`

export const INSERT_PRODUCT_CATEGORIES = gql`
  mutation insertProductCategories ($data: [product_categories_insert_input]!) {
    insert_product_categories(objects: $data) {
      returning {
        id
      }
    }
  }
`

////////////////////////////////////////////////////////////////////////////////
/*----------------------------     UPDATES    --------------------------------*/
////////////////////////////////////////////////////////////////////////////////

export const UPDATE_PRODUCT = gql`
  mutation updateProduct ($id: uuid!, $data: products_set_input!) {
    update_products_by_pk (pk_columns: { id: $id }, _set: $data) {
      id
    }
  }
`

////////////////////////////////////////////////////////////////////////////////
/*---------------------------     DELETIONS    -------------------------------*/
////////////////////////////////////////////////////////////////////////////////

export const DELETE_PRODUCT = gql`
  mutation deleteProduct ($id: uuid!) {
    delete_products_by_pk (id: $id) {
      id
    }
  }
`

export const DELETE_PRODUCT_CATEGORIES = gql`
  mutation deleteProductCategories ($where: product_categories_bool_exp!) {
    delete_product_categories (where: $where) {
      returning { 
        id 
      }
    }
  }
`