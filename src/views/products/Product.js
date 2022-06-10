import React, { useState } from "react"
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { PRODUCT_BY_ID, DELETE_PRODUCT } from '../../gql/products'

import { Breadcrumbs, Typography, Box, Paper, Card, CardHeader, CardContent, CardMedia, ListItem, ListItemText,
  CardActions, Button, Modal, Alert
} from '@mui/material'
import ProductVariationTable from '../../components/products/ProductVariationTable'
import CreateProductVariation from "../../components/products/CreateProductVariation"
import UpdateProduct from "../../components/products/UpdateProduct"
import Reviews from '../../components/products/Reviews'

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

const styleP = {
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


const Product = ({ homeAlert }) => {

    const navigate = useNavigate()
    const { id } = useParams()

    const result = useQuery(PRODUCT_BY_ID, { variables: {id: id} })
    const [ open, setOpen ] = useState(false);
    const [ openP, setOpenP ] = useState(false)
    const [ openU, setOpenU ] = useState(false)
    const [ showAlert, setShowAlert ] = useState({ message: '', isError: false })

    const productAlert = (message, isError = false) => {
      setShowAlert({ message: message, isError: isError})
      setTimeout(() => {
        setShowAlert({ message: '', isError: false })
      }, 3000)
    }

    const handleOpenP = () => {
      result.refetch()
      setOpenP(true)
    }
    const handleCloseP = () => setOpenP(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
      result.refetch()
      setOpen(false)
    };
    const handleOpenU = () => setOpenU(true);
    const handleCloseU = () => {
      result.refetch()
      setOpenU(false)
    };

    const [ deleteProduct ] = useMutation(DELETE_PRODUCT, {
      onError: (error) => {
        console.log('error : ', error)
        setShowAlert({ message: 'Error on server', isError: true })
        setTimeout(() => {
          setShowAlert({ message: '', isError: false })
        }, 3000)
      },
      onCompleted: () => {
        homeAlert('Product have been removed.', false)
        navigate('/products')
      },
    })

    if(result.loading) {
      return (
        <div>
          <em>Loading...</em>
        </div>
      )
    }

    const product = result.data.products_by_pk

    const handleDelete = () => {
      if(product.product_variations.length > 0) {
        setShowAlert({ message: 'Please, make sure all of its variations have been removed.', isError: true })
        setTimeout(() => {
          setShowAlert({ message: '', isError: false })
        }, 3000)
        setOpenP(false)
        return
      }
      let image_url = product.product_image_url
      let image_name = image_url.substring(image_url.lastIndexOf('/') + 1,image_url.lenght )
      deleteProduct({ variables: {id: product.id, image_name: image_name} })
    }

    return (
        <div>
          <div role="presentation">
            <Breadcrumbs aria-label="breadcrumb">
              <Link to="/">
                Dashboard
              </Link>
              <Link to="/products">
                Products
              </Link>
              <span>
                {id}
              </span>
            </Breadcrumbs>
          </div>
          <Typography variant='h4' component='h2' sx= {{ m: 3 }} >Product</Typography>
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
              <Paper elevation={3} >
                  <Card>
                      <CardHeader>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>Product</Typography>
                      </CardHeader>
                      <CardContent sx={{ display: 'flex' }}>
                          {/* <CardMedia sx={{ flex: 1, bgcolor: '#cecece', maxHeight: 300, objectFit: 'contain' }}
                            component="img"
                            height="194"
                            image={product.product_image_url}
                            alt="Product"
                          /> */}
                          {
                          (product.product_image_url && product.product_image_url !== 'null' ) && <CardMedia sx={{ flex: 1}}
                            component="img"
                            height="194"
                            image={product.product_image_url}
                            alt="Product"
                            className="card-media"
                          />
                        }
                          <Box sx={{flex: 4, mx: 3, py: 2, display: 'flex', justifyContent: 'space-around' }}>
                            <Box>
                              <ListItem>
                                <ListItemText
                                  primary="ID"
                                  secondary={product.id}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Name"
                                  secondary={product.name}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Price"
                                  secondary={product.price}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Category"
                                  secondary={product.category?.product_category_name}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Brand"
                                  secondary={product.brand_name?.name}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Barcode"
                                  secondary={product.barcode}
                                />
                              </ListItem>
                            </Box>
                            <Box>
                              <ListItem>
                                <ListItemText
                                  primary="Reviews"
                                  secondary={product.show_reviews? 'Show' : 'Not show'}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Discount"
                                  secondary={product.discount_eligible? 'eligible' : 'ineligible'}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Sold Amount"
                                  secondary={product.sold_amount}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Created At"
                                  secondary={product.created_at}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Updated At"
                                  secondary={product.updated_at}
                                />
                              </ListItem>
                            </Box>
                          </Box>
                      </CardContent>
                      <CardContent>
                        <Typography sx={{ fontSize: 16 }} color="text" gutterBottom>Description</Typography>
                        <Box sx={{ p: 2, bgcolor: '#f7f7f5', borderRadius: 2 }}>
                          <div dangerouslySetInnerHTML={{ __html: product.description }}></div>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Button onClick={handleOpenU} size="small" color="primary">
                          Edit
                        </Button>
                        <Button size="small" color="error" onClick={handleOpenP}>
                          Remove
                        </Button>
                      </CardActions>
                  </Card>
                  <Modal
                      keepMounted
                      open={openP}
                      onClose={handleCloseP}
                      aria-labelledby="keep-mounted-modal-title"
                      aria-describedby="keep-mounted-modal-description"
                    >
                      <Box sx={styleP}>
                        <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                          Remove proudct
                        </Typography>
                        <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                          Are you sure want to remove? And please, make sure all of its variations are removed
                        </Typography>
                        <Box sx={{ textAlign: 'right', mt: 2 }}>
                          <Button color='secondary' onClick={handleCloseP} >Cancel</Button>
                          <Button onClick={handleDelete} >Confirm</Button>
                        </Box>
                      </Box>
                  </Modal>
              </Paper>
              <div style={{ minHeight: 'auto' }}>
                <Button onClick={handleOpen} variant="contained">{open? 'Close' : 'New Variation'}</Button>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <CreateProductVariation product_id={product.id} handleClose={handleClose} />
                  </Box>
                </Modal>
              </div>
              <div style={{ minHeight: 'auto' }}>
                <Modal
                  open={openU}
                  onClose={handleCloseU}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <UpdateProduct productAlert={productAlert} product_id={product.id} product={{ ...product, product_variations: undefined, brand_name: undefined, category: undefined }} handleClose={handleCloseU} />
                  </Box>
                </Modal>
              </div>
              <ProductVariationTable refresh={() =>  result.refetch()} variationsProp={product?.product_variations} />
              <Reviews productAlert={productAlert} product_id={product?.id} />
          </Box>
          {
            (showAlert.message && !showAlert.isError) && <Alert sx={{ position: 'fixed', bottom: '1em', right: '1em' }} severity="success">{showAlert.message}</Alert>
          }
          {
            (showAlert.message && showAlert.isError) && <Alert sx={{ position: 'fixed', bottom: '1em', right: '1em' }} severity="warning">{showAlert.message}</Alert>
          }
        </div>
    )
}

export default Product