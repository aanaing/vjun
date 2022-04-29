import React, { useState } from "react"
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { ORDERS_ITEM_BY_ID, ORDERS_BY_ID } from '../../gql/orders'
import OrdreItemTable from '../../components/orders/OrderItemTable'

import { Breadcrumbs, Typography, Box, Paper, Card, CardHeader, CardContent, CardMedia, ListItem, ListItemText,
 Alert
} from '@mui/material'

const Product = ({ homeAlert }) => {

    const { id } = useParams()

    const [ showAlert, setShowAlert ] = useState({ message: '', isError: false });
    const result = useQuery(ORDERS_BY_ID, { variables: { id: id } })

    if(result.loading ) {
      return (
        <div>
          <em>Loading...</em>
        </div>
      )
    }

    const order = result.data.user_order_by_pk

    return (
        <div>
          <div role="presentation">
            <Breadcrumbs aria-label="breadcrumb">
              <Link to="/">
                Dashboard
              </Link>
              <Link to="/orders">
                Orders
              </Link>
              <span>
                {id}
              </span>
            </Breadcrumbs>
          </div>
          <Typography variant='h4' component='h2' sx= {{ m: 3 }} >Products</Typography>
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
                              image={order.payment_screenshot_image_url}
                              alt="Payment screenshot"
                          />
                          <Paper sx={{flex: 4, mx: 3, display: 'flex', justifyContent: 'space-around' }}>
                            <Box>
                              <ListItem>
                                <ListItemText
                                  primary="ID"
                                  secondary={order.id}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="User's name"
                                  secondary={order.fk_user_id}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Status"
                                  secondary={order.order_status}
                                />
                              </ListItem>
                            </Box>
                            <Box>
                              <ListItem>
                                <ListItemText
                                  primary="Total Cost"
                                  secondary={order.total_price}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Total Quantity"
                                  secondary={order.total_quantity}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Created At"
                                  secondary={order.created_at}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary="Updated At"
                                  secondary={order.updated_at}
                                />
                              </ListItem>
                            </Box>
                          </Paper>
                      </CardContent>
                  </Card>
              </Paper>
              <OrdreItemTable id={order.id} />
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