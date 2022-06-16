import React, { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { 
  Box, Breadcrumbs, TablePagination, TableContainer, Table, TableHead, Button, Avatar, Modal, Typography,
  TableBody, TableRow, TableCell, IconButton, Alert
} from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import CreateShop from "../../components/shops/CreateShop";

import { useLazyQuery, useMutation } from '@apollo/client'
import { SHOPS, REMOVE_SHOP } from '../../gql/shops'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100vw',
  maxHeight: '100vh',
  overflow: 'scroll',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const styleD = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Index = () => {

  const [open, setOpen] = useState(false)
  const [ openD, setOpenD ] = useState(false)
  const [ count, setCount ] = useState(0)
  const [ page, setPage ] = useState(0)
  const [ rowsPerPage, setRowsPerPage ] = useState(10)
  const [ offset, setOffset ] = useState(0)
  const [ shops, setShops ] = useState(null)
  const [ sortingCreatedAt, setSortingCreatedAt ] = useState('asc')
  const [ shop, setShop ] = useState(null)
  const [ showAlert, setShowAlert ] = useState({ message: '', isError: false })

  const [ loadShops, result ] = useLazyQuery(SHOPS)

  useEffect(() => {
    loadShops({ variables: { limit: rowsPerPage, offset: offset, sorting_created_at: sortingCreatedAt } })
  }, [loadShops, offset, rowsPerPage, sortingCreatedAt])

  useEffect(() => {
    if(result.data) {
      setShops(result.data.shop_data)
      setCount(Number(result.data?.shop_data_aggregate.aggregate.count))
    }
  }, [result])

  const [ deleteShop ] = useMutation(REMOVE_SHOP, {
    onError: (error) => {
      console.log('error : ', error)
      setShowAlert({ message: 'Error on server', isError: true })
      setTimeout(() => {
        setShowAlert({ message: '', isError: false })
      }, 3000)
    },
    onCompleted: () => {
      setOpenD(false)
      setShowAlert({ message: 'Shop have been removed.', isError: true })
      setTimeout(() => {
        setShowAlert({ message: '', isError: false })
      }, 3000)
    },
    refetchQueries: [SHOPS]
  })

  if(!shops) {
    return (
      <div>
        <em>Loading...</em>
      </div>
    )
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setOffset(rowsPerPage * newPage)
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0);
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    result.refetch()
    setOpen(false)
  };
  const handleOpenD = () => setOpenD(true)
  const handleCloseD = () => setOpenD(false)

  const alterSorting = (property, sort) => {
    switch (property) {
      case 'created_at':
        setSortingCreatedAt((sortingCreatedAt==='asc' || sortingCreatedAt === null) ? 'desc': 'asc')
        break;
      default:
        break;
    }
  }

  const handleDelete = () => {
    let image_url = shop.shop_photo
    let image_name = image_url.substring(image_url.lastIndexOf('/') + 1,image_url.lenght )
    deleteShop({ variables: {id: shop.id, image_name: image_name} })
  }

  return (
  <div>
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        <Link to="/">
          Dashboard
        </Link>
        <span>
          Shops
        </span>
      </Breadcrumbs>
    </div>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }} >
      <Button onClick={handleOpen} variant="contained" sx={{ height: 50 }}>{open? 'Close' : 'Create Shop'}</Button>
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
              <TableCell style={{ minWidth: 60 }}>
                Name
              </TableCell>
              <TableCell style={{ minWidth: 60 }}>
                Photo
              </TableCell>
              <TableCell style={{ minWidth: 70 }}>
                Address
              </TableCell>
              <TableCell style={{ minWidth: 100 }}>
                Map Link
              </TableCell>
              <TableCell style={{ minWidth: 70 }}>
                Created At
                <IconButton onClick={() => alterSorting('created_at')} color={ !sortingCreatedAt? 'default': 'primary' } sx={{ ml: 1 }} size="small" component="span">
                  {
                    (sortingCreatedAt === 'asc') ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
                  }
                </IconButton>
              </TableCell>
              <TableCell style={{ minWidth: 70 }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shops?.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell >
                      {row.shop_name}
                    </TableCell>
                    <TableCell >
                      <Avatar
                        alt="shop"
                        src={row.shop_photo}
                        sx={{ width: 56, height: 56 }}
                      >S</Avatar>
                    </TableCell>
                    <TableCell >
                      {row.address}
                    </TableCell>
                    <TableCell >
                      {row.map_link}
                    </TableCell>
                    <TableCell >
                      {row.created_at.substring(0, 10)}
                    </TableCell>
                    <TableCell>
                      <Button size="small" color="error" onClick={() => {
                        setShop(row)
                        handleOpenD()
                      }}>Remove</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
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
        keepMounted
        open={openD}
        onClose={handleCloseD}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
          <Box sx={styleD}>
            <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
              Remove Shop
            </Typography>
            <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
              Are you sure want to remove {shop?.shop_name} ?
            </Typography>
            <Box sx={{ textAlign: 'right', mt: 2 }}>
              <Button color='secondary' onClick={handleCloseD} >Cancel</Button>
              <Button onClick={handleDelete} >Confirm</Button>
            </Box>
          </Box>
      </Modal>
    </div>
    <div style={{ minHeight: 'auto' }}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ width: '100vw' }}
      >
        <Box sx={style}>
          <CreateShop handleClose={handleClose} />
        </Box>
      </Modal>
    </div>
    {
      (showAlert.message && !showAlert.isError) && <Alert sx={{ position: 'fixed', bottom: '1em', right: '1em' }} severity="success">{showAlert.message}</Alert>
    }
    {
      (showAlert.message && showAlert.isError) && <Alert sx={{ position: 'fixed', bottom: '1em', right: '1em' }} severity="warning">{showAlert.message}</Alert>
    }
  </div>
  )
}

export default Index