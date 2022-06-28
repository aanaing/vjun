import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Avatar from "@mui/material/Avatar";
import { Button, Alert, Modal, Box, Typography } from "@mui/material";

import { useMutation } from "@apollo/client";
import {
  DELETE_PRODUCT_VARIATION,
  PRODUCT_VARIATIONS,
} from "../../gql/products";

import UpdateProcutVariation from "./UpdateProductVariation";

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

const styleU = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100vw",
  maxHeight: "100vh",
  overflow: "scroll",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ProductVariationTable({ variationsProp, refresh }) {
  const [variations, setVariations] = useState(null);
  const [showAlert, setShowAlert] = React.useState({
    message: "",
    isError: false,
  });
  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const [openU, setOpenU] = useState(false);
  const [variation, setVariation] = useState(null);

  useEffect(() => {
    setVariations(variationsProp);
  }, [variationsProp]);

  const [deleteVariation] = useMutation(DELETE_PRODUCT_VARIATION, {
    onError: (error) => {
      console.log("error : ", error);
      setShowAlert({ message: "Error on server", isError: true });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 3000);
    },
    onCompleted: () => {
      setVariations(variations.filter((v) => v.id !== id));
      setShowAlert({ message: "Variation have been removed.", isError: false });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 3000);
      setId("");
      refresh();
    },
    refetchQueries: [{ query: PRODUCT_VARIATIONS }],
  });

  const handleOpen = (id) => {
    setId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    let variation = variations.find((v) => v.id === id);
    let image_url = variation.variation_image_url;
    let image_name = image_url.substring(
      image_url.lastIndexOf("/") + 1,
      image_url.lenght
    );
    deleteVariation({ variables: { id: id, image_name: image_name } });
    handleClose();
  };

  const handleOpenU = (data) => {
    setVariation(data);
    setOpenU(true);
  };
  const handleCloseU = () => {
    refresh();
    setOpenU(false);
  };

  const variationAlert = (message, isError = false) => {
    setShowAlert({ message: message, isError: isError });
    setTimeout(() => {
      setShowAlert({ message: "", isError: false });
    }, 3000);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell style={{ minWidth: 70 }}>Image</TableCell>
              <TableCell style={{ minWidth: 70 }}>Variation Name</TableCell>
              <TableCell style={{ minWidth: 50 }}>Color</TableCell>
              <TableCell style={{ minWidth: 70 }}>Price</TableCell>
              <TableCell style={{ minWidth: 60 }}>Model</TableCell>
              <TableCell style={{ minWidth: 60 }}>Sold Amount</TableCell>
              <TableCell style={{ minWidth: 50 }}>Created At</TableCell>
              <TableCell style={{ minWidth: 170 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {variations?.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  <TableCell>
                    <Avatar
                      alt="Product"
                      src={row.variation_image_url}
                      sx={{ width: 56, height: 56 }}
                    >
                      P
                    </Avatar>
                  </TableCell>
                  <TableCell>{row.variation_name}</TableCell>
                  <TableCell>{row.color}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.customization_model?.model_name}</TableCell>
                  <TableCell>{row.sold_amount}</TableCell>
                  <TableCell>{row.created_at.substring(0, 10)}</TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      sx={{ mr: 1 }}
                      variant="contained"
                      onClick={() => handleOpenU(row)}
                    >
                      Edit
                    </Button>
                    <Button
                      color="error"
                      variant="contained"
                      onClick={() => handleOpen(row.id)}
                    >
                      Remove
                    </Button>
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
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button color="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleDelete}>Confirm</Button>
          </Box>
        </Box>
      </Modal>
      <div style={{ minHeight: "auto" }}>
        <Modal
          open={openU}
          onClose={handleCloseU}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleU}>
            <UpdateProcutVariation
              product_id={variation?.id}
              handleClose={handleCloseU}
              product={variation}
              variationAlert={variationAlert}
            />
          </Box>
        </Modal>
      </div>
      {showAlert.message && !showAlert.isError && (
        <Alert
          sx={{ position: "fixed", bottom: "1em", right: "1em" }}
          severity="success"
        >
          {showAlert.message}
        </Alert>
      )}
      {showAlert.message && showAlert.isError && (
        <Alert
          sx={{ position: "fixed", bottom: "1em", right: "1em" }}
          severity="warning"
        >
          {showAlert.message}
        </Alert>
      )}
    </Paper>
  );
}
