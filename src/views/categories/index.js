import React, { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import { useLazyQuery, useMutation } from '@apollo/client'
import { CATEGORIES, DELETE_CATEGORY, UPDATE_POSITION } from '../../gql/categories'
import { 
  Box, Breadcrumbs, Button, TableContainer, Table, TableHead, Avatar, Modal,
  TableBody, TableRow, TableCell, Alert, Typography
} from '@mui/material'

import CreateCategory from '../../components/categories/CreateCategory'
import EditCategory from "../../components/categories/EditCategory"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100vw',
  height: '100vh',
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

  const [ categories, setCategories ] = useState(null)
  const [open, setOpen] = useState(false)
  const [ openD, setOpenD ] = useState(false)
  const [ openE, setOpenE ] = useState(false)
  const [ category, setCategory ] = useState(null)
  const [ showAlert, setShowAlert ] = useState({ message: '', isError: false })

  const [ load, result ] = useLazyQuery(CATEGORIES)
  const [ deleteCategory ] = useMutation(DELETE_CATEGORY, {
    onError: (error) => {
      console.log('error : ', error)
      setShowAlert({ message: 'Error on server', isError: true })
      setTimeout(() => {
        setShowAlert({ message: '', isError: false })
      }, 3000)
      handleCloseD()
    },
    onCompleted: (res) => {
      setShowAlert({ message: `Category "${res?.delete_product_categories_by_pk.product_category_name}" have been removed.`, isError: false })
      setTimeout(() => {
        setShowAlert({ message: '', isError: false })
      }, 3000)
      handleCloseD()
    }
  })

  const [ updatePosition ] = useMutation(UPDATE_POSITION, {
    onError: (error) => {
      console.log('error: ', error)
    },
    onCompleted: (res) => {
      setShowAlert({ message: `Category "${res?.update_product_categories_by_pk.product_category_name}" have been put to the top.`, isError: false })
      setTimeout(() => {
        setShowAlert({ message: '', isError: false })
      }, 3000)
      handleCloseD()
    },
    refetchQueries: [CATEGORIES]
  })

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if(result.data) {
      setCategories(result.data.product_categories)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result ])

  if(!categories) {
    return (
      <div>
        <em>Loading...</em>
      </div>
    )
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    result.refetch()
    setOpen(false)
  };
  const handleOpenD = (row) => {
   setCategory(row)
    setOpenD(true)
  }
  const handleCloseD = () => {
    result.refetch()
    setOpenD(false)
  }
  const handleOpenE = (row) => {
    setCategory(row)
    setOpenE(true)
  }
  const handleCloseE = () => {
    result.refetch()
    setOpenE(false)
  }

  const handleDelete = () => {
    if(!category) {
      return
    }
    let image_url = category.product_category_image_url
    const image_name = image_url.substring(image_url.lastIndexOf('/') + 1,image_url.lenght )
    deleteCategory({ variables: { id: category.id, image_name: image_name } })
  }

  return (
    <div>
        <div role="presentation">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to='/' >
              Dashboard
            </Link>
            <span>
              Product Category
            </span>
          </Breadcrumbs>
        </div>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }} >
          <Button onClick={handleOpen} variant="contained" sx={{ height: 50 }}>{open? 'Close' : 'Add Category'}</Button>
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
                  <TableCell style={{ minWidth: 70 }} >
                    Image
                  </TableCell>
                  <TableCell style={{ minWidth: 100 }} >
                    Category Name
                  </TableCell>
                  <TableCell style={{ minWidth: 70 }} >
                    Device Type
                  </TableCell>
                  <TableCell style={{ minWidth: 70 }} >
                    Updated At
                  </TableCell>
                  <TableCell style={{ minWidth: 70 }} >
                    Created At
                  </TableCell>
                  <TableCell style={{ minWidth: 70 }} >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  categories.map((row, index) => (
                    <TableRow onClick={() => null} key={index} hover role="checkbox" tabIndex={-1} >
                      <TableCell>
                        {row.id}
                      </TableCell>
                    <TableCell >
                      <Avatar
                          alt="Category"
                          src={row.product_category_image_url}
                          sx={{ width: 56, height: 56 }}
                      >C</Avatar>
                    </TableCell>
                    <TableCell>
                      {row.product_category_name}
                    </TableCell>
                    <TableCell>
                      {row.device_type}
                    </TableCell>
                    <TableCell >
                      {row.created_at.substring(0, 10)}
                    </TableCell>
                    <TableCell >
                      {row.updated_at.substring(0, 10)}
                    </TableCell>
                    <TableCell >
                      <Button color="secondary" onClick={() => updatePosition({ variables: { id: row.id, updateAt: new Date().toISOString() } })}>Put to Top</Button>
                      <Button color="primary" onClick={() => handleOpenE(row)}>Edit</Button>
                      <Button color="error" onClick={() => handleOpenD(row)} >Remove</Button>
                    </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Modal
          keepMounted
          open={openD}
          onClose={handleCloseD}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={styleD}>
            <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
              Remove Category
            </Typography>
            <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
              Are you sure want to remove?
            </Typography>
            <Box sx={{ textAlign: 'right', mt: 2 }}>
              <Button color='secondary' onClick={handleCloseD} >Cancel</Button>
              <Button onClick={handleDelete} >Confirm</Button>
            </Box>
          </Box>
        </Modal>
        <Modal
          keepMounted
          open={openE}
          onClose={handleCloseE}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style}>
            <EditCategory handleClose={handleCloseE} category={category} />
          </Box>
        </Modal>
      <div style={{ minHeight: 'auto' }}>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ width: '100vw' }}
        >
          <Box sx={style}>
            <CreateCategory handleClose={handleClose} />
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