import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import { Button, Alert, Modal, Box, Typography } from '@mui/material'

import { useMutation } from '@apollo/client'
import { DELETE_PRODUCT_VARIATION, PRODUCT_VARIATIONS } from '../../gql/products'

const style = {
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

export default function ProductVariationTable({ variationsProp }) {
  const [ variations, setVariations ] = useState(null)
  const [ showAlert, setShowAlert ] = React.useState({ message: '', isError: false });
  const [ id, setId ] = useState('')
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setVariations(variationsProp)
  }, [variationsProp])

  const [ deleteVariation ] = useMutation(DELETE_PRODUCT_VARIATION, {
    onError: (error) => {
      console.log('error : ', error)
      setShowAlert({ message: 'Error on server', isError: true })
      setTimeout(() => {
        setShowAlert({ message: '', isError: false })
      }, 3000)
    },
    onCompleted: (result) => {
      setVariations(variations.filter(v => v.id !== id))
      setShowAlert({ message: 'Variation have been removed.', isError: false })
      setTimeout(() => {
        setShowAlert({ message: '', isError: false })
      }, 3000)
      setId('')
    },
    refetchQueries: [{ query: PRODUCT_VARIATIONS }]
  })

  const handleOpen = (id) => {
    setId(id)
    setOpen(true)
  };
  const handleClose = () => {
    setOpen(false)
  };

  const handleDelete = () => {
    let variation = variations.find(v => v.id === id)
    let image_url = variation.variation_image_url
    let image_name = image_url.substring(image_url.lastIndexOf('/') + 1,image_url.lenght )
    deleteVariation({ variables: {id: id, image_name: image_name} })
    handleClose()
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
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
                  Collection
                </TableCell>
                <TableCell style={{ minWidth: 70 }}>
                  Material
                </TableCell>
                <TableCell style={{ minWidth: 170 }}>
                  Description
                </TableCell>
                <TableCell style={{ minWidth: 70 }}>
                  Price
                </TableCell>
                <TableCell style={{ minWidth: 70 }}>
                  Facebook
                </TableCell>
                <TableCell style={{ minWidth: 70 }}>
                  Tiktok
                </TableCell>
                <TableCell style={{ minWidth: 70 }}>
                  Instagram
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
                       {row.variation_name}
                    </TableCell>
                    <TableCell >
                       {row.variation_name}
                    </TableCell>
                    <TableCell >
                       {row.variation_name}
                    </TableCell>
                    <TableCell >
                       {row.variation_name}
                    </TableCell>
                    <TableCell >
                       {row.price}
                    </TableCell>
                    <TableCell >
                       {row.variation_name}
                    </TableCell>
                    <TableCell >
                       {row.variation_name}
                    </TableCell>
                    <TableCell >
                       {row.variation_name}
                    </TableCell>
                    <TableCell >
                      {row.created_at.substring(0, 10)}
                    </TableCell>
                    <TableCell >
                      {row.updated_at.substring(0, 10)}
                    </TableCell>
                    <TableCell >
                        <Button color="primary">Edit</Button>
                        <Button color="secondary" onClick={() => handleOpen(row.id)}>Remove</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            Remove proudct's variation
          </Typography>
          <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
            Are you sure want to remove?
          </Typography>
          <Box sx={{ textAlign: 'right', mt: 2 }}>
            <Button color='secondary' onClick={handleClose} >Cancel</Button>
            <Button onClick={handleDelete} >Confirm</Button>
          </Box>
        </Box>
      </Modal>
      {
        (showAlert.message && !showAlert.isError) && <Alert sx={{ position: 'fixed', bottom: '1em', right: '1em' }} severity="success">{showAlert.message}</Alert>
      }
      {
        (showAlert.message && showAlert.isError) && <Alert sx={{ position: 'fixed', bottom: '1em', right: '1em' }} severity="warning">{showAlert.message}</Alert>
      }
    </Paper>
  );
}