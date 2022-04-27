import { gql } from "@apollo/client";

export const LOGIN = gql`
mutation LogIn($phone: String!, $password: String!) {
    LogIn(password: $password, phone: $phone) {
      accessToken
      message
      error
    }
}  
`