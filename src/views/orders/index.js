import React, { useState, useEffect } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client'
import { ORDERS, ORDERS_BY_ID } from '../../gql/orders'
import { 
  Box, Breadcrumbs, Button, TablePagination, TableContainer, Table, TableHead,
  TableBody, TableRow, TableCell, TextField, FormControl, Chip
} from '@mui/material'

const Index = () => {

  const [ search, setSearch ] = useState('')
  const [ count, setCount ] = useState(0)
  const [ page, setPage ] = useState(0)
  const [ rowsPerPage, setRowsPerPage ] = useState(10)
  const [ offset, setOffset ] = useState(0)
  const [ orders, setOrders ] = useState(null)
  const [ order, setOrder ] = useState(null)

  const navigate = useNavigate()

  const [ loadOrders, result ] = useLazyQuery(ORDERS)
  const [ loadOdersById, resultById ] = useLazyQuery(ORDERS_BY_ID)

  useEffect(() => {
    if(search && Number(search)) {
      loadOdersById({ variables: { id: Number(search) } })
    } else if(!search) {
      loadOrders({ variables: { limit: rowsPerPage, offset: offset }})
    }
  }, [loadOdersById, loadOrders, offset, rowsPerPage, search])

  useEffect(() => {
    if(!search && result.data) {
      setOrders(result.data.user_order)
      setCount(Number(result.data?.user_order_aggregate.aggregate.count))
    } else if(Number(search) && resultById.data) {
      setOrder(resultById.data.user_order_by_pk)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, resultById])

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

  const detailProdcut = (product) => {
    navigate(`/order/${product.id}`)
  }

  return (
    <div>
        <div role="presentation">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to='/' >
              Dashboard
            </Link>
            <span>
              Orders
            </span>
          </Breadcrumbs>
        </div>
        <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', my: 2, width: '100%' }} >
          <FormControl sx={{ width: 300 }} >
            <TextField id="outlined-search" label="Search by User's name or Order's ID" type="search" 
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
        {
        (window.innerWidth > 820) ? (
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
                    <TableCell style={{ minWidth: 30 }} >
                      Status
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
                  !(Number(search)) ? 
                    orders.map((row, index) => (
                      <TableRow onClick={() => null} key={index} hover role="checkbox" tabIndex={-1} >
                          <TableCell>
                            {row.id}
                          </TableCell>
                          <TableCell>
                            {row.fk_user_id}
                          </TableCell>
                          <TableCell>
                            {row.total_price}
                          </TableCell>
                          <TableCell>
                            {row.total_quantity}
                          </TableCell>
                          <TableCell>
                            <Chip label={row.order_status} variant="outlined" />
                          </TableCell>
                          <TableCell >
                            {row.created_at.substring(0, 10)}
                          </TableCell>
                          <TableCell >
                            {row.updated_at.substring(0, 10)}
                          </TableCell>
                          <TableCell>
                            <Button size="small" onClick={() => detailProdcut(row)}>Detail</Button>
                          </TableCell>
                      </TableRow>
                    ))
                   : 
                    order ? (
                    <TableRow onClick={() => null} hover role="checkbox" tabIndex={-1} >
                      <TableCell>
                        {order.id}
                      </TableCell>
                      <TableCell>
                        {order.fk_user_id}
                      </TableCell>
                      <TableCell>
                        {order.number}
                      </TableCell>
                      <TableCell>
                        {order.fk_user_id}
                      </TableCell>
                      <TableCell>
                        {order.totalCost}
                      </TableCell>
                      <TableCell>
                        <Chip label={order.status} variant="outlined" />
                      </TableCell>
                      <TableCell >
                        {order.created_at.substring(0, 10)}
                      </TableCell>
                      <TableCell >
                        {order.updated_at.substring(0, 10)}
                      </TableCell>
                      <TableCell>
                        <Button size="small" onClick={() => detailProdcut(order)}>Detail</Button>
                      </TableCell>
                    </TableRow>
                   ) :
                   (
                  
                     <TableRow>
                        <TableCell colSpan={9}>There is no row!!</TableCell>
                     </TableRow>
                  )
                }
              </TableBody>
            </Table>
          </TableContainer>
        ) : 
          {/* orders?.rows?.map((order, index) => (
            <Accordion sx={{my: 2, bgcolor: '#b3e5fc'}} expanded={expanded === index} onChange={handleChange(index)} key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id={`${index}bh-header`}
              >
                <Typography sx={{ width: '10%', flexShrink: 0 }}>
                  {order.id}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>Number : {order.number}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography component="div" variant="body2" color="text"
                  sx={{p: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start' }}
                >
                  <ListItem sx={{ flex: 1}} className="scroll-paragraph">
                    <ListItemText primary="Total Quantity" secondary={order?.totalQuantity} />
                  </ListItem>
                  <ListItem sx={{ flex: 1}} className="scroll-paragraph">
                    <ListItemText primary="Total Cost" secondary={order?.totalCost} />
                  </ListItem>
                  <ListItem sx={{ flex: 1, minWidth: 200}} className="scroll-paragraph">
                    <ListItemText primary="Status" secondary={order?.status} />
                  </ListItem>
                  <ListItem sx={{ flex: 1}} className="scroll-paragraph">
                    <ListItemText primary="Created At" secondary={order?.createdAt.substring(0, 10)} />
                  </ListItem>
                </Typography>
              </AccordionDetails>
              <AccordionActions>
                <Button onClick={() => handleRoute(order.id)} >See more</Button>
              </AccordionActions>
            </Accordion>
            )) */}
          }
          {
            !(orders.length <= 1 && search) && (
              <TablePagination
                rowsPerPageOptions={[ 10, 25, 100]}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )
          }
        </Box>
    </div>
  )
}

export default Index