import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import { Button, Alert } from '@mui/material'

export default function LoyaltyProductVariationTable({ variationsProp }) {
  const [ variations, setVariations ] = useState(null)
  const [ showAlert, setShowAlert ] = React.useState({ message: '', isError: false });

  useEffect(() => {
    setVariations(variationsProp)
  }, [variationsProp])

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
                <TableCell style={{ minWidth: 70 }}>
                  ID
                </TableCell>
                <TableCell style={{ minWidth: 70 }}>
                  Image
                </TableCell>
                <TableCell style={{ minWidth: 70 }}>
                  Variation Name
                </TableCell>
                <TableCell style={{ minWidth: 50 }}>
                  Color
                </TableCell>
                <TableCell style={{ minWidth: 70 }}>
                  Point Price
                </TableCell>
                <TableCell style={{ minWidth: 70 }}>
                  Claimed Amount
                </TableCell>
                <TableCell style={{ minWidth: 50 }}>
                  Created At
                </TableCell>
                <TableCell style={{ minWidth: 50 }}>
                  Updated At
                </TableCell>
                <TableCell style={{ minWidth: 170 }}>
                  Action
                </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {variations?.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell>
                        {row.id.substring(0, 8)}
                    </TableCell>
                    <TableCell >
                      <Avatar
                          alt="Product"
                          src={row.variation_image_url}
                          sx={{ width: 56, height: 56 }}
                      >P</Avatar>
                    </TableCell>
                    <TableCell >
                       {row.variation_name}
                    </TableCell>
                    <TableCell >
                       {row.color}
                    </TableCell>
                    <TableCell >
                       {row.point_price}
                    </TableCell>
                    <TableCell >
                       {row.claimed_amount}
                    </TableCell>
                    <TableCell >
                      {row.created_at.substring(0, 10)}
                    </TableCell>
                    <TableCell >
                      {row.updated_at.substring(0, 10)}
                    </TableCell>
                    <TableCell >
                      <Button color="primary">Edit</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {
        (showAlert.message && !showAlert.isError) && <Alert sx={{ position: 'fixed', bottom: '1em', right: '1em' }} severity="success">{showAlert.message}</Alert>
      }
      {
        (showAlert.message && showAlert.isError) && <Alert sx={{ position: 'fixed', bottom: '1em', right: '1em' }} severity="warning">{showAlert.message}</Alert>
      }
    </Paper>
  );
}