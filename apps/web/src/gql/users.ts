import { gql } from "@apollo/client";

////////////////////////////////////////////////////////////////////////////////
/*----------------------------     QUERIES    --------------------------------*/
////////////////////////////////////////////////////////////////////////////////

export const GET_USER = gql`
  query getUser ($id: uuid!) {
    users_by_pk(id: $id) {
      id
      email
      first_name
      last_name
      created_at
      updated_at
    }
  }
`

export const GET_USERS = gql`
  query getUsers ($where: users_bool_exp!) {
    users (
      where: $where,
      order_by: {
        first_name: asc
      }
    ) {
      id
      email
      first_name
      last_name
      created_at
      updated_at
    }
  }
`

////////////////////////////////////////////////////////////////////////////////
/*--------------------------     INSERTIONS    -------------------------------*/
////////////////////////////////////////////////////////////////////////////////

export const INSERT_USER = gql`
  mutation insertUser ($data: users_insert_input!) {
    insert_users_one(object: $data) {
      id
    }
  }
`

////////////////////////////////////////////////////////////////////////////////
/*----------------------------     UPDATES    --------------------------------*/
////////////////////////////////////////////////////////////////////////////////

export const UPDATE_USER = gql`
  mutation updateUser ($id: uuid!, $data: users_set_input!) {
    update_users_by_pk (pk_columns: { id: $id }, _set: $data) {
      id
    }
  }
`

////////////////////////////////////////////////////////////////////////////////
/*---------------------------     DELETIONS    -------------------------------*/
////////////////////////////////////////////////////////////////////////////////

export const DELETE_USER = gql`
  mutation deleteUser ($id: uuid!) {
    delete_users_by_pk (id: $id) {
      id
    }
  }
`