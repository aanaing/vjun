import React, { useState } from "react"
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { PRODUCT } from '../../gql/loyalty_products'

import { Breadcrumbs, Typography, Box, Paper, Card, CardHeader, CardContent, CardMedia, ListItem, ListItemText,
  CardActions, Button, Modal, Alert
} from '@mui/material'

import LoyaltyProductVariationTable from "../../components/LoyaltyProducts/LoyaltyProductVariationTable"

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

const LoyaltyProduct = ({ homeAlert }) => {

    const navigate = useNavigate()
    const { id } = useParams()

    const result = useQuery(PRODUCT, { variables: {id: id} })
    const [ openP, setOpenP ] = useState(false)
    const [ showAlert, setShowAlert ] = useState({ message: '', isError: false });

    const handleOpenP = () => {
      result.refetch()
      setOpenP(true)
    }
    const handleCloseP = () => setOpenP(false)

    if(result.loading) {
      return (
        <div>
          <em>Loading...</em>
        </div>
      )
    }

    const product = result.data.loyality_products_by_pk

    return (
        <div>
          <div role="presentation">
            <Breadcrumbs aria-label="breadcrumb">
              <Link to="/">
                Dashboard
              </Link>
              <Link to="/loyalty_products">
                Loyalty Products
              </Link>
              <span>
                {id}
              </span>
            </Breadcrumbs>
          </div>
          <Typography variant='h4' component='h2' sx= {{ m: 3 }} >Loyalty Product</Typography>
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
                          <CardMedia sx={{ flex: 1 }}
                              component="img"
                              height="194"
                              image={product.product_image_url}
                              alt="Product"
                          />
                          <Paper sx={{flex: 4, mx: 3, py: 2, display: 'flex', justifyContent: 'space-around' }}>
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
                                  primary="Point Price"
                                  secondary={product.point_price}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Brand"
                                  secondary={product.brand_name.name}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Description"
                                  secondary={product.description}
                                />
                              </ListItem>
                            </Box>
                            <Box>
                                <ListItem>
                                    <ListItemText
                                    primary="Claimed Amount"
                                    secondary={product.claimed_amount}
                                    />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Category"
                                  secondary={product.product_category?.product_category_name}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Expired Date"
                                  secondary={product.expiry_date}
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
                          </Paper>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Button size="small" color="primary">
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
                          <Button >Confirm</Button>
                        </Box>
                      </Box>
                  </Modal>
              </Paper>
              <LoyaltyProductVariationTable variationsProp={product?.loyalty_products_variations} />
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

export default LoyaltyProduct