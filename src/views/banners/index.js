import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { ACTION_BANNER, BANNERS } from "../../gql/banners";
import {
  Box,
  Breadcrumbs,
  Button,
  Modal,
  Alert,
  Typography,
  Card,
  CardActions,
  CardMedia,
  CardContent,
} from "@mui/material";
import CreateBanner from "../../components/banners/CreateBanner";
import UpdateBanner from "../../components/banners/UpdateBanner";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100vw",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Banners = () => {
  const [showAlert, setShowAlert] = useState({ message: "", isError: false });
  const [open, setOpen] = useState(false);
  const [openE, setOpenE] = useState(false);
  const [banner, setBanner] = useState(null);

  const result = useQuery(BANNERS);

  const [actionBanner] = useMutation(ACTION_BANNER, {
    onError: (error) => {
      console.log("error: ", error);
    },
    onCompleted: (res) => {
      setShowAlert({
        message: `Banner "${res?.update_banner_by_pk.title}" have been ${
          !res?.update_banner_by_pk.disabled ? "enabled" : "disabled"
        }.`,
        isError: false,
      });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 3000);
    },
    refetchQueries: [BANNERS],
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
  const handleOpenE = (row) => {
    setBanner(row);
    setOpenE(true);
  };
  const handleCloseE = () => {
    result.refetch();
    setOpenE(false);
  };

  const bannerAlert = (message, isError = false) => {
    setShowAlert({ message: message, isError: isError });
    setTimeout(() => {
      setShowAlert({ message: "", isError: false });
    }, 3000);
  };

  const banners = result.data.banner;

  return (
    <div>
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">Dashboard</Link>
          <span>Banners</span>
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
          {open ? "Close" : "Add Banner"}
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
        {banners.map((row, index) => (
          <Card sx={{ maxWidth: 345 }} key={index}>
            <CardMedia
              component="img"
              height="140"
              image={row.image_url}
              alt="Banner"
            />
            <CardContent>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                Title
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                component="a"
                herf={row.external_url}
              >
                {row.title}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                External URL
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                component="a"
                herf={row.external_url}
              >
                {row.external_url}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                color="secondary"
                onClick={() =>
                  actionBanner({
                    variables: {
                      id: row.id,
                      action: !row.disabled,
                    },
                  })
                }
              >
                {row.disabled ? "Enable" : "Disable"}
              </Button>
              <Button
                onClick={() => handleOpenE(row)}
                color="primary"
                size="small"
              >
                Edit
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
      <div style={{ minHeight: "auto" }}>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <CreateBanner bannerAlert={bannerAlert} handleClose={handleClose} />
          </Box>
        </Modal>
      </div>
      <div style={{ minHeight: "auto" }}>
        <Modal
          open={openE}
          onClose={handleCloseE}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <UpdateBanner
              bannerAlert={bannerAlert}
              handleClose={handleCloseE}
              banner={banner}
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

export default Banners;
