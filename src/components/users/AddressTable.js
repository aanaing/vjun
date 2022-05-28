import React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/material'

export default function AddressTable({ addresses }) {

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
                    Name
                </TableCell>
                <TableCell style={{ minWidth: 50 }}>
                  Phone
                </TableCell>
                <TableCell style={{ minWidth: 70 }}>
                  Address
                </TableCell>
                <TableCell style={{ minWidth: 70 }}>
                  City
                </TableCell>
                <TableCell style={{ minWidth: 50 }}>
                  Created At
                </TableCell>
                <TableCell style={{ minWidth: 170 }}>
                  Action
                </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {addresses?.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell >
                       {row.id}
                    </TableCell>
                    <TableCell >
                       {row.name}
                    </TableCell>
                    <TableCell >
                       {row.phone}
                    </TableCell>
                    <TableCell >
                       {row.address}
                    </TableCell>
                    <TableCell >
                       {row.city}
                    </TableCell>
                    <TableCell >
                      {row.created_at.substring(0, 10)}
                    </TableCell>
                    <TableCell >
                      <Button color="primary" >Edit</Button>
                      <Button color="error" >Remove</Button>
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