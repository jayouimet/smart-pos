import { gql } from "@apollo/client";

////////////////////////////////////////////////////////////////////////////////
/*----------------------------     QUERIES    --------------------------------*/
////////////////////////////////////////////////////////////////////////////////

export const GET_CATEGORIES = gql`
  query getCategories ($where: categories_bool_exp!) {
    categories (
      where: $where,
      order_by: {
        name: asc
      }
    ) {
      id
      name
      organization_id
      created_at
      updated_at
    }
  }
`

export const GET_CATEGORIES_PAGE = gql`
  query getCategories (
    $limit: Int!
    $offset: Int!
    $where: categories_bool_exp!
  ) {
    categories_aggregate(where: $where) {
      aggregate {
        totalCount: count
      }
    }
    categories (
      where: $where,
      limit: $limit,
      offset: $offset,
      order_by: {
        name: asc
      }
    ) {
      id
      name
      organization_id
      created_at
      updated_at
    }
  }
`

////////////////////////////////////////////////////////////////////////////////
/*--------------------------     INSERTIONS    -------------------------------*/
////////////////////////////////////////////////////////////////////////////////

export const INSERT_CATEGORY = gql`
  mutation insertCategory ($data: categories_insert_input!) {
    insert_categories_one(object: $data) {
      id
    }
  }
`

////////////////////////////////////////////////////////////////////////////////
/*----------------------------     UPDATES    --------------------------------*/
////////////////////////////////////////////////////////////////////////////////

export const UPDATE_CATEGORY = gql`
  mutation updateCategory ($id: uuid!, $data: categories_set_input!) {
    update_categories_by_pk (pk_columns: { id: $id }, _set: $data) {
      id
    }
  }
`

////////////////////////////////////////////////////////////////////////////////
/*---------------------------     DELETIONS    -------------------------------*/
////////////////////////////////////////////////////////////////////////////////

export const DELETE_CATEGORY = gql`
  mutation deleteCategory ($id: uuid!) {
    delete_categories_by_pk (id: $id) {
      id
    }
  }
`