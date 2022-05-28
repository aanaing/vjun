import { gql } from '@apollo/client'

export const CLAIM_HISTORIES = gql`
query Claim_History ($limit: Int!, $offset: Int!, $search: String, $sorting_created_at: order_by) {
    claim_history (limit: $limit, offset: $offset, order_by: { created_at: $sorting_created_at }, where: {user: {name: {_ilike: $search}}}) {
      claim_status
      created_at
      user {
        name
        id
      }
      id
      loyalty_points_used
      loyalty_product {
        id
        name
      }
    }
    claim_history_aggregate (where: {user: {name: {_ilike: $search}}}) {
        aggregate {
          count
        }
    }
}
`

export const CLAIM_HISTORIESWITHDATE = gql`
query Claim_History ($limit: Int!, $offset: Int!, $search: String, $sorting_created_at: order_by, $start: timestamptz, $end: timestamptz) {
    claim_history (limit: $limit, offset: $offset, order_by: { created_at: $sorting_created_at}, where: {_and: {user: {name: {_ilike: $search}, _or: {created_at: {_gte: $start, _lt: $end}}}}}) {
      claim_status
      created_at
      user {
        name
        id
      }
      id
      loyalty_points_used
      loyalty_product {
        id
        name
      }
    }
    claim_history_aggregate (where: {_and: {user: {name: {_ilike: $search}, _or: {created_at: {_gte: $start, _lt: $end}}}}}) {
        aggregate {
          count
        }
    }
}
`