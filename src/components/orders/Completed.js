import React, { useState, useEffect } from 'react'
import { Box, FormControl, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination,
Button,
} from '@mui/material'
import { useLazyQuery } from '@apollo/client'
import { ORDERS } from '../../gql/orders'

const Completed = ({ detailOrder }) => {

    const [ search, setSearch ] = useState('')
    const [ count, setCount ] = useState(0)
    const [ page, setPage ] = useState(0)
    const [ rowsPerPage, setRowsPerPage ] = useState(10)
    const [ offset, setOffset ] = useState(0)
    const [ orders, setOrders ] = useState(null)

    const [ loadOrders, result ] = useLazyQuery(ORDERS)

    useEffect(() => {
        loadOrders({ variables: { limit: rowsPerPage, offset: offset, search: `%${search}%`, status: '%completed%' }})
    }, [loadOrders, offset, rowsPerPage, search])

    useEffect(() => {
        if(result.data) {
        setOrders(result.data.user_order)
        setCount(Number(result.data?.user_order_aggregate.aggregate.count))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result ])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        setOffset(rowsPerPage * newPage)
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0);
    };

    if(!orders) {
        return (
        <div>
            <em>Loading...</em>
        </div>
        )
    }

    return (
        <div>
        <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', width: '100%' }} >
          <FormControl sx={{ width: 300 }} >
            <TextField id="outlined-search" label="Search by User's name" type="search" 
              value={search}
              onChange={(e) => { setSearch(e.target.value) }}
            />
          </FormControl>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'wrap row',
            '& > :not(style)': {
              m: 1,
              width: '100%',
              minHeight: '25vh',
            },
            }}
        >
        <TableContainer sx={{ maxHeight: '75vh' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                  <TableCell style={{ minWidth: 10 }} >
                    ID
                  </TableCell>
                  <TableCell style={{ minWidth: 100 }} >
                    User Name
                  </TableCell>
                  <TableCell style={{ minWidth: 70 }} >
                    Total Price
                  </TableCell>
                  <TableCell style={{ minWidth: 70 }} >
                    Total Quantity
                  </TableCell>
                  <TableCell style={{ minWidth: 70 }} >
                    Updated At
                  </TableCell>
                  <TableCell style={{ minWidth: 70 }} >
                    Created At
                  </TableCell>
                  <TableCell style={{ minWidth: 70 }} >
                    Detail
                  </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                orders.map((row, index) => (
                  <TableRow onClick={() => null} key={index} hover role="checkbox" tabIndex={-1} >
                    <TableCell>
                      {row.id.substring(0,8)}
                    </TableCell>
                    <TableCell>
                      {row.user.name}
                    </TableCell>
                    <TableCell>
                      {row.total_price}
                    </TableCell>
                    <TableCell>
                      {row.total_quantity}
                    </TableCell>
                    <TableCell >
                      {row.created_at.substring(0, 10)}
                    </TableCell>
                    <TableCell >
                      {row.updated_at.substring(0, 10)}
                    </TableCell>
                    <TableCell>
                      <Button color="secondary" size="small" onClick={() => detailOrder(row)}>Detail</Button>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
          <TablePagination
            rowsPerPageOptions={[ 10, 25, 100]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
        </div>
    )
}

export default Completed