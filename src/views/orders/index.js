import React, { useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { 
  Box, Breadcrumbs, Tabs, Tab, 
} from '@mui/material'
import Pending from "../../components/orders/Pending"
import PaymentVerified from "../../components/orders/PaymentVerified"
import Delivering from "../../components/orders/Delivering"
import Completed from "../../components/orders/Completed"

import PropTypes from 'prop-types';

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
        </div>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Pending" id='tab-pending' aria-controls='tabpanel-pending' />
              <Tab label="Payment Verified" id='tab-payment-verified' aria-controls='tabpanel-payment-verified' />
              <Tab label="Delivering" id='tab-delivering' aria-controls='tabpanel-delivering' />
              <Tab label="Completed" id='tab-completed' aria-controls='tabpanel-completed' />
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
        </Box>
    </div>
  )
}

export default Index