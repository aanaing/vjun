import { gql } from "@apollo/client";

export const LOGIN = gql`
mutation AdminLogIn($name: String!, $password: String!) {
    AdminLogIn(password: $password, name: $name) {
      accessToken
      message
      error
    }
}  
`