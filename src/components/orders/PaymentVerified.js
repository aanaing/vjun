import React, { useState, useEffect } from 'react'
import { Box, FormControl, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination,
Button, Alert
} from '@mui/material'
import { useLazyQuery, useMutation } from '@apollo/client'
import { ORDERS, UPDATE_ORDER_STATUS } from '../../gql/orders'

const PaymentVerified = ({ detailOrder }) => {

    const [ search, setSearch ] = useState('')
    const [ count, setCount ] = useState(0)
    const [ page, setPage ] = useState(0)
    const [ rowsPerPage, setRowsPerPage ] = useState(10)
    const [ offset, setOffset ] = useState(0)
    const [ orders, setOrders ] = useState(null)
    const [ showAlert, setShowAlert ] = useState({ message: '', isError: false });

    const [ loadOrders, result ] = useLazyQuery(ORDERS)

    const [ update ] = useMutation(UPDATE_ORDER_STATUS, {
      onError: (error) => {
        console.log('error : ', error)
        setShowAlert({ message: 'Error on server', isError: true })
        setTimeout(() => {
            setShowAlert({ message: '', isError: false })
        }, 2000)
      },
      onCompleted: () => {
        setShowAlert({ message: 'Order\'s status have been changed to Delivering.', isError: false })
        setTimeout(() => {
            setShowAlert({ message: '', isError: false })
        }, 2000)
      },
      refetchQueries: [ORDERS]
    })

    useEffect(() => {
        loadOrders({ variables: { limit: rowsPerPage, offset: offset, search: `%${search}%`, status: '%payment_verified%' }})
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
                  <TableCell style={{ minWidth: 70 }}>
                    Status
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
                    <TableCell>
                      <Button size="small" variant="contained" color="success" onClick={() => {
                        update({ variables: { id: row.id, status: 'delivering'} })
                      }}>Change to Delivering</Button>
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
        {
          (showAlert.message && !showAlert.isError) && <Alert sx={{ position: 'absolute', bottom: '1em', right: '1em' }} severity="success">{showAlert.message}</Alert>
        }
        {
          (showAlert.message && showAlert.isError) && <Alert sx={{ position: 'absolute', bottom: '1em', right: '1em' }} severity="warning">{showAlert.message}</Alert>
        }
      </div>
    )
}

export default PaymentVerified