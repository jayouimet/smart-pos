import { gql } from "@apollo/client";

////////////////////////////////////////////////////////////////////////////////
/*----------------------------     QUERIES    --------------------------------*/
////////////////////////////////////////////////////////////////////////////////

export const GET_ORGANIZATIONS = gql`
  query getOrganizations ($where: organizations_bool_exp!) {
    organizations (
      where: $where,
      order_by: {
        name: asc
      }
    ) {
      id
      name
      created_at
      updated_at
    }
  }
`

////////////////////////////////////////////////////////////////////////////////
/*--------------------------     INSERTIONS    -------------------------------*/
////////////////////////////////////////////////////////////////////////////////

export const INSERT_ORGANIZATION = gql`
  mutation insertOrganization ($data: organizations_insert_input!) {
    insert_organizations_one(object: $data) {
      id
    }
  }
`

////////////////////////////////////////////////////////////////////////////////
/*----------------------------     UPDATES    --------------------------------*/
////////////////////////////////////////////////////////////////////////////////

export const UPDATE_ORGANIZATION = gql`
  mutation updateOrganization ($id: uuid!, $data: organizations_set_input!) {
    update_organizations_by_pk (pk_columns: { id: $id }, _set: $data) {
      id
    }
  }
`

////////////////////////////////////////////////////////////////////////////////
/*---------------------------     DELETIONS    -------------------------------*/
////////////////////////////////////////////////////////////////////////////////

export const DELETE_ORGANIZATION = gql`
  mutation deleteOrganization ($id: uuid!) {
    delete_organizations_by_pk (id: $id) {
      id
    }
  }
`