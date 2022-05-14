import React, { useEffect, useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { 
  Box, Breadcrumbs, Typography, Card, CardMedia, CardContent, Button, Modal, TablePagination, TableContainer, Table, TableHead,
  TableBody, TableRow, TableCell, TextField, FormControl, Avatar
} from '@mui/material'

import { useLazyQuery } from '@apollo/client'
import { PRODUCTS } from '../../gql/loyalty_products'

import CreateProduct from "../../components/products/CreateProduct"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Index = () => {

  const navigate = useNavigate()
  const [ open, setOpen ] = useState(false)
  const [ count, setCount ] = useState(0)
  const [ page, setPage ] = useState(0)
  const [ rowsPerPage, setRowsPerPage ] = useState(10)
  const [ offset, setOffset ] = useState(0)
  const [ products, setProducts ] = useState(null)
  const [ search, setSearch ] = useState('')

  const [ loadProducts, result ] = useLazyQuery(PRODUCTS)

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    result.refetch()
    setOpen(false)
  };

  useEffect(() => {
    loadProducts({ variables: { limit: rowsPerPage, offset: offset, search: `%${search}%` }})
  }, [loadProducts, offset, rowsPerPage, search])

  useEffect(() => {
    if( result.data) {
      setProducts(result.data.loyality_products)
      setCount(Number(result.data?.loyality_products_aggregate.aggregate.count))
    }
  }, [result])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setOffset(rowsPerPage * newPage)
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0);
  };

  if(!products) {
    return (
      <div>
        <em>Loading...</em>
      </div>
    )
  }

  const detailProdcut = (product) => {
    navigate(`/loualty_product/${product.id}`)
  }

  return (
  <div>
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        <Link to="/">
          Dashboard
        </Link>
        <span>
          Loyalty Products
        </span>
      </Breadcrumbs>
    </div>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }} >
      <Button onClick={handleOpen} variant="contained" sx={{ height: 50 }}>{open? 'Close' : 'New Variation'}</Button>
      <FormControl sx={{ width: 300 }} >
        <TextField id="outlined-search" label="Search by Name" type="search" 
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
    <TableContainer sx={{ maxHeight: '60vh' }}>
    <Table stickyHeader aria-label="sticky table">
    <TableHead>
      <TableRow>
        <TableCell style={{ minWidth: 20 }}>
          ID
        </TableCell>
        <TableCell style={{ minWidth: 60 }}>
          Image
        </TableCell>
        <TableCell style={{ minWidth: 70 }}>
          Name
        </TableCell>
        <TableCell style={{ minWidth: 70 }}>
          Category
        </TableCell>
        <TableCell style={{ minWidth: 170 }}>
          Description
        </TableCell>
        <TableCell style={{ minWidth: 70 }}>
          Point Price
        </TableCell>
        <TableCell style={{ minWidth: 70 }}>
          Claimed Amount
        </TableCell>
        <TableCell style={{ minWidth: 70 }}>
          Expired Date
        </TableCell>
        <TableCell style={{ minWidth: 70 }}>
          Created At
        </TableCell>
        <TableCell style={{ minWidth: 70 }}>
          Updated At
        </TableCell>
        <TableCell style={{ minWidth: 50 }}>
          Detail
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {products?.map((row) => {
        return (
          <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
            <TableCell >
              {row.id.substring(0, 8)}
            </TableCell>
            <TableCell>
            <Avatar
              alt="Product"
              src={row.product_image_url}
              sx={{ width: 56, height: 56 }}
            >P</Avatar>
            </TableCell>
            <TableCell >
              {row.name}
            </TableCell>
            <TableCell >
              {row.product_category?.product_category_name}
            </TableCell>
            <TableCell >
              {row?.description.length > 25 ? row.description.substring(0, 24) + '...': row.description}
            </TableCell>
            <TableCell >
              {row.point_price}
            </TableCell>
            <TableCell >
              {row.claimed_amount}
            </TableCell>
            <TableCell >
              {row.expiry_date}
            </TableCell>
            <TableCell >
              {row.created_at.substring(0, 10)}
            </TableCell>
            <TableCell >
              {row.updated_at.substring(0, 10)}
            </TableCell>
            <TableCell >
              <Button size="small" color="secondary" onClick={() => detailProdcut(row)}>Detail</Button>
            </TableCell>
          </TableRow>
        );
      })}
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
    <div style={{ minHeight: 'auto' }}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ width: '100vw' }}
      >
        <Box sx={style}>
          <CreateProduct handleClose={handleClose} />
        </Box>
      </Modal>
    </div>
  </Box>
  </div>
  )
}

export default Index