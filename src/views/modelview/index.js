import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Button,
  TablePagination,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  Typography,
  Alert,
  Avatar,
} from "@mui/material";
import { useLazyQuery, useMutation } from "@apollo/client";
import { DELETE_MODEL, MODELS } from "../../gql/models";
import CreateModel from "../../components/modelviews/CreateModel";
import UpdateModel from "../../components/modelviews/UpdateModel";

const styleD = {
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

const style = {
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

const styleImg = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  justifyContent: "center",
  maxWidth: 300,
  maxHeight: 500,
};

const Models = () => {
  const [showAlert, setShowAlert] = useState({ message: "", isError: false });
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const [models, setModels] = useState(null);
  const [openD, setOpenD] = useState(false);
  const [model, setModel] = useState(null);
  const [openImg, setOpenImg] = useState(false);
  const [open, setOpen] = useState(false);
  const [openU, setOpenU] = useState(false);
  const [modelImg, setModelImg] = useState("");

  const [loadModels, result] = useLazyQuery(MODELS);

  const [deleteModel] = useMutation(DELETE_MODEL, {
    onError: (error) => {
      console.log("error : ", error);
      setShowAlert({ message: "Error on server", isError: true });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 3000);
      handleCloseD();
    },
    onCompleted: () => {
      setShowAlert({ message: `Model have been removed.`, isError: false });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 3000);
      handleCloseD();
    },
    refetchQueries: [MODELS],
  });

  useEffect(() => {
    loadModels({
      variables: {
        limit: rowsPerPage,
        offset: offset,
      },
    });
  }, [loadModels, rowsPerPage, offset]);

  useEffect(() => {
    if (result.data) {
      setModels(result.data.customization_model);
      setCount(
        Number(result.data?.customization_model_aggregate.aggregate.count)
      );
    }
  }, [result]);

  if (!models) {
    return (
      <div>
        <em>Loading...</em>
      </div>
    );
  }

  const handleOpenD = (row) => {
    setModel(row);
    setOpenD(true);
  };
  const handleCloseD = () => {
    setModel(null);
    setOpenD(false);
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    result.refetch();
    setOpen(false);
  };
  const handleOpenU = (data) => {
    setModel(data);
    setOpenU(true);
  };
  const handleCloseU = () => {
    result.refetch();
    setOpenU(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setOffset(rowsPerPage * newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDelete = () => {
    if (!model) {
      return;
    }
    let image_url1 = model.model_image_url;
    let image_url2 = model.model_device_image_url;
    const image_name1 = image_url1.substring(
      image_url1.lastIndexOf("/") + 1,
      image_url1.lenght
    );
    const image_name2 = image_url2.substring(
      image_url2.lastIndexOf("/") + 1,
      image_url2.lenght
    );
    deleteModel({
      variables: {
        id: model.id,
        image_name1: image_name1,
        image_name2: image_name2,
      },
    });
  };

  const handleOpenImg = (url) => {
    setModelImg(url);
    setOpenImg(true);
  };
  const handleCloseImg = () => setOpenImg(false);

  const modelAlert = (message, isError = false) => {
    setShowAlert({ message: message, isError: isError });
    setTimeout(() => {
      setShowAlert({ message: "", isError: false });
    }, 3000);
  };

  return (
    <div>
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">Dashboard</Link>
          <span>Models</span>
        </Breadcrumbs>
      </div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          my: 2,
        }}
      >
        <Button onClick={handleOpen} variant="contained" sx={{ height: 50 }}>
          {open ? "Close" : "Create Model"}
        </Button>
      </Box>

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
        <TableContainer sx={{ maxHeight: "60vh" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: 50 }}>ID</TableCell>
                <TableCell style={{ minWidth: 50 }}>Name</TableCell>
                <TableCell style={{ minWidth: 50 }}>Model Image</TableCell>
                <TableCell style={{ minWidth: 50 }}>Device Width</TableCell>
                <TableCell style={{ minWidth: 50 }}>Device Height</TableCell>
                <TableCell style={{ minWidth: 50 }}>Device Image</TableCell>
                <TableCell style={{ minWidth: 50 }}>
                  Customization Brand Name
                </TableCell>
                <TableCell style={{ minWidth: 50 }}>Created At</TableCell>
                <TableCell style={{ minWidth: 100 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {models.map((row, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell>{row.id.substring(0, 8)}</TableCell>
                  <TableCell>{row.model_name}</TableCell>
                  <TableCell>
                    <Avatar
                      alt="Model"
                      src={row.model_image_url}
                      sx={{ width: 56, height: 56, cursor: "pointer" }}
                      onClick={() => handleOpenImg(row.model_image_url)}
                    >
                      M
                    </Avatar>
                  </TableCell>
                  <TableCell>{row.model_device_height}</TableCell>
                  <TableCell>{row.model_device_width}</TableCell>
                  <TableCell>
                    <Avatar
                      alt="Device"
                      src={row.model_device_image_url}
                      sx={{ width: 56, height: 56, cursor: "pointer" }}
                      onClick={() => handleOpenImg(row.model_device_image_url)}
                    >
                      D
                    </Avatar>
                  </TableCell>
                  <TableCell>{row.customization_brand.brand_name}</TableCell>
                  <TableCell>{row.created_at.substring(0, 10)}</TableCell>
                  <TableCell>
                    <Button color="primary" onClick={() => handleOpenU(row)}>
                      Edit
                    </Button>
                    <Button color="error" onClick={() => handleOpenD(row)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <Modal
        open={openImg}
        onClose={handleCloseImg}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleImg}>
          <img
            src={modelImg}
            alt=""
            style={{ objectFit: "contain", width: "100%" }}
          ></img>
        </Box>
      </Modal>
      <Modal
        keepMounted
        open={openD}
        onClose={handleCloseD}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={styleD}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            Remove Model
          </Typography>
          <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
            Are you sure want to remove?
          </Typography>
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button color="secondary" onClick={handleCloseD}>
              Cancel
            </Button>
            <Button onClick={handleDelete}>Confirm</Button>
          </Box>
        </Box>
      </Modal>
      <div style={{ minHeight: "auto" }}>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ width: "100vw" }}
        >
          <Box sx={style}>
            <CreateModel handleClose={handleClose} />
          </Box>
        </Modal>
      </div>
      <div style={{ minHeight: "auto" }}>
        <Modal
          open={openU}
          onClose={handleCloseU}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <UpdateModel
              modelAlert={modelAlert}
              model_id={model?.id}
              model={model}
              handleClose={handleCloseU}
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
    </div>
  );
};

export default Models;
