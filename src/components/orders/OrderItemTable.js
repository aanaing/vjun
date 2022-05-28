import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, Avatar } from '@mui/material'

import { Link } from 'react-router-dom'

export default function ProductVariationTable({ items }) {

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
                <TableCell style={{ minWidth: 70 }} className='MuiTableCell-head-secondary' >
                  Product Name
                </TableCell>
                <TableCell style={{ minWidth: 70 }} className='MuiTableCell-head-secondary'>
                  Product Variation
                </TableCell>
                <TableCell style={{ minWidth: 70 }} className='MuiTableCell-head-secondary'>
                  Image
                </TableCell>
                <TableCell style={{ minWidth: 70 }} className='MuiTableCell-head-secondary'>
                  Quantity
                </TableCell>
                <TableCell style={{ minWidth: 70 }} className='MuiTableCell-head-secondary'>
                  Order Price For one Item
                </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items?.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell >
                       {row.product_variation?.product?.name}
                    </TableCell>
                    <TableCell >
                      <Link to={`/product/${row?.product_variation.product.id}`}>{row.product_variation?.variation_name}</Link>
                    </TableCell>
                    <TableCell>
                      <Avatar
                        alt="User"
                        src={row.product_variation?.variation_image_url}
                        sx={{ width: 56, height: 56 }}
                      >P</Avatar>
                    </TableCell>
                    <TableCell >
                       {row.quantity}
                    </TableCell>
                    <TableCell >
                       {row.order_price_for_one_item}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}