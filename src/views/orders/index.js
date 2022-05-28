import React, { useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { 
  Box, Breadcrumbs, Tabs, Tab, Typography, Card
} from '@mui/material'
import Pending from "../../components/orders/Pending"
import PaymentVerified from "../../components/orders/PaymentVerified"
import Delivering from "../../components/orders/Delivering"
import Completed from "../../components/orders/Completed"
import Cancelled from '../../components/orders/Cancelled'
import PropTypes from 'prop-types';

import { useQuery } from '@apollo/client'
import { ALL_ORDER_COUNT } from '../../gql/orders'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const Index = () => {

  const [value, setValue] = useState(0);

  const navigate = useNavigate()

  const result = useQuery(ALL_ORDER_COUNT)

  if(result.loading) {
    return (
      <div>
        <em>Loading...</em>
      </div>
    )
  }

  const counts = result.data

  const detailOrder = (order) => {
    navigate(`/order/${order.id}`)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
          <Box>
            <Typography variant='h4' component='h2' sx={{ my: 2, fontWeight: 'bold' }} >Orders</Typography>
          </Box>
        </div>
        <Box sx={{ my: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 130 }}>
          <Card className="order-card order-card-1" sx={{ flex: 1, minHeight: '100%', color: 'white', mr: 2 }}>
            <div className="card-bg-hover card-bg-1"></div>
            <Typography variant='h6' component='h4' sx={{ my: 1, mx: 2, zIndex: 2 }} >All Orders</Typography>
            <Typography variant='h2' component='h1' sx={{ my: 1, mx: 2, textAlign: 'end', fontWeight: 'bolder', zIndex: 2 }} >{counts.all.aggregate.count}</Typography>
          </Card>
          <Card className="order-card order-card-2" sx={{ flex: 1, minHeight: '100%', color: 'white', mr: 2 }}>
            <div className="card-bg-hover card-bg-2"></div>
            <Typography variant='h6' component='h4' sx={{ my: 1, mx: 2, zIndex: 2 }} >Pending</Typography>
            <Typography variant='h2' component='h1' sx={{ my: 1, mx: 2, textAlign: 'end', fontWeight: 'bolder', zIndex: 2 }} >{counts.pending.aggregate.count}</Typography>
          </Card>
          <Card className="order-card order-card-3" sx={{ flex: 1, minHeight: '100%', color: 'white', mr: 2 }}>
            <div className="card-bg-hover card-bg-3"></div>
            <Typography variant='h6' component='h4' sx={{ my: 1, mx: 2, zIndex: 2 }} >Payment Verified</Typography>
            <Typography variant='h2' component='h1' sx={{ my: 1, mx: 2, textAlign: 'end', fontWeight: 'bolder', zIndex: 2 }} >{counts.verified.aggregate.count}</Typography>
          </Card>
          <Card className="order-card order-card-4" sx={{ flex: 1, minHeight: '100%', color: 'white' }}>
            <div className="card-bg-hover card-bg-4"></div>
            <Typography variant='h6' component='h4' sx={{ my: 1, mx: 2, zIndex: 2 }} >Delivering</Typography>
            <Typography variant='h2' component='h1' sx={{ my: 1, mx: 2, textAlign: 'end', fontWeight: 'bolder', zIndex: 2 }} >{counts.delivering.aggregate.count}</Typography>
          </Card>
        </Box>
        <Box className="tag-container" sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Pending" id='tab-pending' aria-controls='tabpanel-pending' />
              <Tab label="Verified" id='tab-payment-verified' aria-controls='tabpanel-payment-verified' />
              <Tab label="Delivering" id='tab-delivering' aria-controls='tabpanel-delivering' />
              <Tab label="Completed" id='tab-completed' aria-controls='tabpanel-completed' />
              <Tab label="Cancelled" id='tab-cancelled' aria-controls='tabpanel-cancelled' />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Pending detailOrder={detailOrder} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <PaymentVerified detailOrder={detailOrder} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Delivering detailOrder={detailOrder} />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Completed detailOrder={detailOrder} />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <Cancelled detailOrder={detailOrder} />
          </TabPanel>
        </Box>
    </div>
  )
}

export default Index