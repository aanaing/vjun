import React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';

import { useQuery } from '@apollo/client'
import { ORDER_ITEMS_BY_ID } from '../../gql/orders'

export default function ProductVariationTable({ id }) {

    const result = useQuery(ORDER_ITEMS_BY_ID, { variables: { id: id } })

    if(result.loading ) {
        return (
          <div>
            <em>Loading...</em>
          </div>
        )
    }

    const items = result.data.order_item

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
                <TableCell style={{ minWidth: 70 }}>
                  ID
                </TableCell>
                <TableCell style={{ minWidth: 50 }}>
                  Product Variation ID
                </TableCell>
                <TableCell style={{ minWidth: 70 }}>
                  Quantity
                </TableCell>
                <TableCell style={{ minWidth: 70 }}>
                  Order Price For one Item
                </TableCell>
                <TableCell style={{ minWidth: 50 }}>
                  Created At
                </TableCell>
                <TableCell style={{ minWidth: 50 }}>
                  Updated At
                </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items?.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell >
                       {row.id}
                    </TableCell>
                    <TableCell >
                       {row.fk_product_variation_id}
                    </TableCell>
                    <TableCell >
                       {row.quantity}
                    </TableCell>
                    <TableCell >
                       {row.order_price_for_one_item}
                    </TableCell>
                    <TableCell>
                      {row.created_at.substring(0, 10)}
                    </TableCell>
                    <TableCell >
                      {row.updated_at.substring(0, 10)}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}