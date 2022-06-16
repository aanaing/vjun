import React, { useState } from "react"
import { Link, useParams, useNavigate } from 'react-router-dom'
import imageService from "../../services/image"
import { useQuery, useMutation } from '@apollo/client'
import { PRODUCT_BY_ID, DELETE_PRODUCT, CREATE_PRODUCT_PHOTO, DELETE_PRODUCT_PHOTO } from '../../gql/products'
import { GET_IMAGE_UPLOAD_URL } from '../../gql/misc'

import { Breadcrumbs, Typography, Box, Paper, Card, CardHeader, CardContent, CardMedia, ListItem, ListItemText, styled,
  CardActions, Button, Modal, Alert, ImageList, ImageListItem, ImageListItemBar, IconButton,
} from '@mui/material'
import ProductVariationTable from '../../components/products/ProductVariationTable'
import CreateProductVariation from "../../components/products/CreateProductVariation"
import UpdateProduct from "../../components/products/UpdateProduct"
import Reviews from '../../components/products/Reviews'

import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';

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
const Input = styled('input')({
  display: 'none',
});
const fileTypes = [
  "image/apng",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  "image/svg+xml",
  "image/tiff",
  "image/webp",
  "image/x-icon"
];


const Product = ({ homeAlert }) => {

    const navigate = useNavigate()
    const { id } = useParams()

    const result = useQuery(PRODUCT_BY_ID, { variables: {id: id} })
    const [ open, setOpen ] = useState(false);
    const [ openP, setOpenP ] = useState(false)
    const [ openU, setOpenU ] = useState(false)
    const [ openRI, setOpenRI ] = useState(false)
    const [ productImage, setProductImage ] = useState(null)
    const [ showAlert, setShowAlert ] = useState({ message: '', isError: false })

    const [ getImageUrl ] = useMutation(GET_IMAGE_UPLOAD_URL, {
      onError: (error) => {
        setShowAlert({ message: 'Error on server', isError: true })
        setTimeout(() => {
            setShowAlert({ message: '', isError: false })
        }, 1000)
      },
    })

    const [ createImage ] = useMutation(CREATE_PRODUCT_PHOTO, {
      onError: () => {
        setShowAlert({ message: 'Error on server', isError: true })
        setTimeout(() => {
            setShowAlert({ message: '', isError: false })
        }, 1000)
      },
      onCompleted: (result) => {
        setShowAlert({ message: 'Image have been created.', isError: false })
        setTimeout(() => {
            setShowAlert({ message: '', isError: false })
        }, 1000)
      },
      refetchQueries: [PRODUCT_BY_ID]
    })

    const [ removeImage ] = useMutation(DELETE_PRODUCT_PHOTO, {
      onError: (error) => {
        setShowAlert({ message: 'Error on server', isError: true })
        setTimeout(() => {
            setShowAlert({ message: '', isError: false })
        }, 1000)
      },
      onCompleted: (result) => {
        setOpenRI(false)
        setShowAlert({ message: 'Image have been removed.', isError: false })
        setTimeout(() => {
            setShowAlert({ message: '', isError: false })
        }, 1000)
      },
      refetchQueries: [PRODUCT_BY_ID]
    })

  const handleMoreUpload = async (e) => {
    if(e.target.files && e.target.files[0]) {
      let img = e.target.files[0]
      if(!fileTypes.includes(img.type)) {
        setShowAlert({ message: 'Please select image. (PNG, JPG, JPEG, GIF, ...)', isError: true })
        setTimeout(() => {
            setShowAlert({ message: '', isError: false })
        }, 1000)
        return
      }
      if(img.size > 10485760 ) {
        setShowAlert({ message: 'Image file size must be smaller than 10MB.', isError: true })
        setTimeout(() => {
            setShowAlert({ message: '', isError: false })
        }, 1000)
        return
      }
      const res = await getImageUrl()
      let imageFileUrl = res.data.getImageUploadUrl.imageUploadUrl
      let imageUrl = `https://axra.sgp1.digitaloceanspaces.com/VJun/${res.data.getImageUploadUrl.imageName}`
      await imageService.uploadImage(imageFileUrl, img)
      createImage({ variables: { id: product.id, image_url: imageUrl } })
    }
  }

    const productAlert = (message, isError = false) => {
      setShowAlert({ message: message, isError: isError})
      setTimeout(() => {
        setShowAlert({ message: '', isError: false })
      }, 3000)
    }

    const handleOpenP = () => setOpenP(true)
    const handleCloseP = () => {
      result.refetch()
      setOpenP(false)
    }
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

    const handleOpenRI = (productImage) => {
      setOpenRI(true)
      setProductImage(productImage)

    };
    const handleCloseRI = () => setOpenRI(false)

    const [ deleteProduct ] = useMutation(DELETE_PRODUCT, {
      onError: () => {
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
      if(product.product_photos.length > 0) {
        setShowAlert({ message: 'Please, make sure all of its images have been removed.', isError: true })
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
                      <CardContent>
                        {
                          product.product_photos && (product.product_photos.length > 0) && (
                            <ImageList sx={{ width: '100%', height: 500 }} cols={5} rowHeight={400} >
                            {product.product_photos.map((item) => (
                              <ImageListItem key={item.id}>
                                <ImageListItemBar
                                  sx={{
                                    background:
                                      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, ' +
                                      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                                  }}
                                  position="bottom"
                                  actionIcon={
                                    <IconButton
                                      sx={{ color: 'white' }}
                                      aria-label={`remove ${item.id}`}
                                      onClick={() => handleOpenRI(item)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  }
                                  actionPosition="right"
                                />
                                <img
                                  src={`${item.product_image_url}`}
                                  alt={'more'}
                                  loading="lazy"
                                />
                              </ImageListItem>
                            ))}
                          </ImageList>
                          )
                        }
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'space-between' }}>
                        <label htmlFor="contained-button-file">
                          <Input accept="image/*" id="contained-button-file" multiple type="file" onChange={handleMoreUpload} />
                          <Button variant="contained" color="success" component="span" startIcon={<PhotoCamera />} >
                              Upload more
                          </Button>
                        </label>
                        <Box>
                          <Button onClick={handleOpenU} size="small" color="primary">
                            Edit
                          </Button>
                          <Button size="small" color="error" onClick={handleOpenP}>
                            Remove
                          </Button>
                        </Box>
                      </CardActions>
                  </Card>
                  <Modal
                    keepMounted
                    open={openRI}
                    onClose={handleCloseRI}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                  >
                    <Box sx={styleP}>
                      <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Remove Image
                      </Typography>
                      <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                        Are you sure want to remove?
                      </Typography>
                      <Box sx={{ textAlign: 'right', mt: 2 }}>
                        <Button color='secondary' onClick={handleCloseRI} >Cancel</Button>
                        <Button onClick={() => {
                          let image_url = productImage.product_image_url
                          let image_name = image_url.substring(image_url.lastIndexOf('/') + 1,image_url.lenght )
                          removeImage({ variables: { id: productImage.id, image_name: image_name } })
                        }} >Confirm</Button>
                      </Box>
                    </Box>
                  </Modal>
                  <Modal
                    keepMounted
                    open={openP}
                    onClose={handleCloseP}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                  >
                    <Box sx={styleP}>
                      <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Remove Proudct
                      </Typography>
                      <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                        Are you sure want to remove? And please, make sure all of its variations and images are removed
                      </Typography>
                      <Box sx={{ textAlign: 'right', mt: 2 }}>
                        <Button color='secondary' onClick={handleCloseP} >Cancel</Button>
                        <Button onClick={handleDelete} >Confirm</Button>
                      </Box>
                    </Box>
                  </Modal>
              </Paper>
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
              <div style={{ minHeight: 'auto' }}>
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
                <Button onClick={handleOpen} variant="contained">{open? 'Close' : 'New Variation'}</Button>
              </div>
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