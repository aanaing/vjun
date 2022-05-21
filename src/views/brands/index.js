import React, { useState } from "react"
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { BRANDS, DELETE_BRAND } from '../../gql/brands'
import { 
  Box, Breadcrumbs, Button, TableContainer, Table, TableHead, Modal,
  TableBody, TableRow, TableCell, Alert, Typography
} from '@mui/material'
import CreateBrand from "../../components/brands/CreateBrand"
import UpdateBrand from "../../components/brands/UpdateBrand"

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

  const [ showAlert, setShowAlert ] = useState({ message: '', isError: false })
  const [ open, setOpen ] = useState(false)
  const [ openE, setOpenE ] = useState(false)
  const [ openD, setOpenD ] = useState(false)
  const [ brand, setBrand ] = useState(null)

  const result = useQuery(BRANDS)

  const [ deleteBrand ] = useMutation(DELETE_BRAND, {
    onError: (error) => {
      console.log('error : ', error)
      setShowAlert({ message: 'Error on server', isError: true })
      setTimeout(() => {
        setShowAlert({ message: '', isError: false })
      }, 3000)
      handleCloseD()
    },
    onCompleted: () => {
      setShowAlert({ message: `Brand have been removed.`, isError: false })
      setTimeout(() => {
        setShowAlert({ message: '', isError: false })
      }, 3000)
      handleCloseD()
    }
  })

  if(result.loading) {
    return (
      <div>
        <em>Loading...</em>
      </div>
    )
  }

  const brandAlert = (message, isError = false) => {
    setShowAlert({ message: message, isError: isError})
    setTimeout(() => {
      setShowAlert({ message: '', isError: false })
    }, 3000)
  }

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        result.refetch()
        setOpen(false)
    };
    const handleOpenE = (row) => {
        setBrand(row)
        setOpenE(true)
    };
    const handleCloseE = () => {
        result.refetch()
        setOpenE(false)
    };
    const handleOpenD = (row) => {
        setBrand(row)
        setOpenD(true)
    };
    const handleCloseD = () => {
        result.refetch()
        setOpenD(false)
    };
    
  const handleDelete = () => {
    if(!brand) {
      return
    }
    deleteBrand({ variables: { id: brand.id } })
  }

  return (
    <div>
        <div role="presentation">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to='/' >
              Dashboard
            </Link>
            <span>
              Brands
            </span>
          </Breadcrumbs>
        </div>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }} >
          <Button onClick={handleOpen} variant="contained" sx={{ height: 50 }}>{open? 'Close' : 'Add Brand'}</Button>
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
                    Name
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
                  result?.data?.brand_name.map((row, index) => (
                    <TableRow onClick={() => null} key={index} hover role="checkbox" tabIndex={-1} >
                        <TableCell>
                            {row.id}
                        </TableCell>
                        <TableCell>
                            {row.name}
                        </TableCell>
                        <TableCell >
                            {row.created_at.substring(0, 10)}
                        </TableCell>
                        <TableCell >
                            {row.updated_at.substring(0, 10)}
                        </TableCell>
                        <TableCell >
                            <Button onClick={() => handleOpenE(row)} color="primary" >Edit</Button>
                            <Button onClick={() => handleOpenD(row)} color="error" >Remove</Button>
                        </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
          <Modal
            keepMounted
            open={openD}
            onClose={handleCloseD}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
            >
            <Box sx={styleD}>
            <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                Remove brand "{brand?.name}"
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
        </Box>
        <div style={{ minHeight: 'auto' }}>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <CreateBrand brandAlert={brandAlert} handleClose={handleClose} />
                </Box>
            </Modal>
        </div>
        <div style={{ minHeight: 'auto' }}>
            <Modal
                open={openE}
                onClose={handleCloseE}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <UpdateBrand brandAlert={brandAlert} handleClose={handleCloseE} brand={brand} brand_id={brand?.id} />
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