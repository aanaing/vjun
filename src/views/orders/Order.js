import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { ORDERS_BY_ID, UPDATE_ORDER_STATUS } from "../../gql/orders";
import OrdreItemTable from "../../components/orders/OrderItemTable";

import {
  Breadcrumbs,
  Typography,
  Box,
  CardContent,
  CardMedia,
  ListItem,
  ListItemText,
  CardActions,
  Button,
  Modal,
  Alert,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Order = () => {
  const { id } = useParams();
  const [showAlert, setShowAlert] = useState({ message: "", isError: false });
  const [open, setOpen] = useState(false);
  const result = useQuery(ORDERS_BY_ID, { variables: { id: id } });

  const [update] = useMutation(UPDATE_ORDER_STATUS, {
    onError: (error) => {
      console.log("error : ", error);
      setShowAlert({ message: "Error on server", isError: true });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 2000);
    },
    onCompleted: () => {
      handleClose();
      setShowAlert({
        message: "Order's status have been changed to cancelled.",
        isError: false,
      });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 2000);
    },
  });

  const [updateStatus] = useMutation(UPDATE_ORDER_STATUS, {
    onError: (error) => {
      console.log("error : ", error);
    },
    onCompleted: (r) => {
      setShowAlert({
        message: `Order's status have been changed to ${r.update_user_order_by_pk.order_status}`,
        isError: false,
      });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 2000);
      result.refetch();
    },
  });

  if (result.loading) {
    return (
      <div>
        <em>Loading...</em>
      </div>
    );
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    result.refetch();
    setOpen(false);
  };

  const order = result?.data.user_order_by_pk;

  return (
    <div>
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">Dashboard</Link>
          <Link to="/orders">Orders</Link>
          <span>{id}</span>
        </Breadcrumbs>
      </div>
      <Typography
        variant="h4"
        component="h2"
        sx={{ my: 2, fontWeight: "bold" }}
      >
        {order.order_status[0].toUpperCase() +
          order.order_status.slice(1, order.order_status.length)}{" "}
        Order
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexFlow: "wrap row",
          "& > :not(style)": {
            m: 1,
            width: "100%",
            minHeight: "25vh",
          },
        }}
      >
        <Box>
          <Box>
            <CardContent sx={{ display: "flex", paddingInline: "0" }}>
              {order.payment_screenshot_image_url &&
                order.payment_screenshot_image_url !== "null" && (
                  <CardMedia
                    sx={{ flex: 1 }}
                    component="img"
                    height="194"
                    image={order.payment_screenshot_image_url}
                    alt="Payment screenshot"
                    className="card-media order-card-media"
                  />
                )}
              <Box
                sx={{
                  flex: 4,
                  mx: 3,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <ListItem>
                    <ListItemText
                      primary="Order ID"
                      secondary={order.order_readable_id}
                      primaryTypographyProps={{ fontWeight: "bold" }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      // primary="User's name"
                      secondary={order.user.name}
                      primaryTypographyProps={{ fontWeight: "bold" }}
                    >
                      <Link to={`/user/${order.user.id}`}>User's name</Link>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Status"
                      secondary={order.order_status}
                      primaryTypographyProps={{ fontWeight: "bold" }}
                      secondaryTypographyProps={{ fontWeight: "bold" }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Payment Method"
                      secondary={order.payment_method}
                      primaryTypographyProps={{ fontWeight: "bold" }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Address"
                      secondary={`${JSON.parse(order.address).phone}, ${
                        JSON.parse(order.address).address
                      }`}
                      primaryTypographyProps={{ fontWeight: "bold" }}
                    />
                  </ListItem>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <ListItem>
                    <ListItemText
                      primary="Total Cost"
                      secondary={order.total_price}
                      primaryTypographyProps={{ fontWeight: "bold" }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Total Quantity"
                      secondary={order.total_quantity}
                      primaryTypographyProps={{ fontWeight: "bold" }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Created At"
                      secondary={order.created_at.substring(0, 10)}
                      primaryTypographyProps={{ fontWeight: "bold" }}
                    />
                  </ListItem>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <ListItem>
                    <ListItemText
                      primary="Reciver Account Name"
                      secondary={order.payment_receiver_account_number}
                      primaryTypographyProps={{ fontWeight: "bold" }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Reciver Name"
                      secondary={order.payment_receiver_name}
                      primaryTypographyProps={{ fontWeight: "bold" }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Payment Service Name"
                      secondary={order.payment_service_name}
                      primaryTypographyProps={{ fontWeight: "bold" }}
                    />
                  </ListItem>
                </Box>
              </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              {!order.order_status?.includes("pending") && (
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => {
                    updateStatus({
                      variables: { id: order.id, status: "pending" },
                    });
                  }}
                >
                  Pending
                </Button>
              )}
              {!order.order_status?.includes("verified") && (
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => {
                    updateStatus({
                      variables: { id: order.id, status: "verified" },
                    });
                  }}
                >
                  Verifie
                </Button>
              )}
              {!order.order_status?.includes("delivering") && (
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => {
                    updateStatus({
                      variables: { id: order.id, status: "delivering" },
                    });
                  }}
                >
                  Delivering
                </Button>
              )}
              {!order.order_status?.includes("completed!") && (
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => {
                    updateStatus({
                      variables: { id: order.id, status: "completed" },
                    });
                  }}
                >
                  Completed
                </Button>
              )}
              {!order.order_status.includes("reject") && (
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => {
                    updateStatus({
                      variables: { id: order.id, status: "reject" },
                    });
                  }}
                >
                  Reject
                </Button>
              )}
              {!order.order_status.includes("cancelled") && (
                <Button variant="contained" color="error" onClick={handleOpen}>
                  Cancel
                </Button>
              )}
            </CardActions>
          </Box>
          <Modal
            keepMounted
            open={open}
            onClose={handleClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
          >
            <Box sx={style}>
              <Typography
                id="keep-mounted-modal-title"
                variant="h6"
                component="h2"
              >
                Confirmation
              </Typography>
              <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                Are you sure want to move this order to cancelled
              </Typography>
              <Box sx={{ textAlign: "right", mt: 2 }}>
                <Button color="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    update({ variables: { id: order.id, status: "cancelled" } })
                  }
                >
                  Confirm
                </Button>
              </Box>
            </Box>
          </Modal>
        </Box>
        <OrdreItemTable items={order.order_items} />
      </Box>
      {showAlert.message && !showAlert.isError && (
        <Alert
          sx={{ position: "fixed", bottom: "1em", right: "1em", zIndex: 10 }}
          severity="success"
        >
          {showAlert.message}
        </Alert>
      )}
      {showAlert.message && showAlert.isError && (
        <Alert
          sx={{ position: "fixed", bottom: "1em", right: "1em", zIndex: 10 }}
          severity="warning"
        >
          {showAlert.message}
        </Alert>
      )}
    </div>
  );
};

export default Order;
