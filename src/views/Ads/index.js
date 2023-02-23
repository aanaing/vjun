import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { ADS, DELETE_ADS, UPDATE_POSITION } from "../../gql/ads";
import { DELETE_IMAGE } from "../../gql/misc";
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
import CreateAds from "../../components/Ads/CreateAds";
import UpdateAds from "../../components/Ads/UpdateAds";

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

const Index = () => {
  const [showAlert, setShowAlert] = useState({ message: "", isError: false });
  const [open, setOpen] = useState(false);
  const [openE, setOpenE] = useState(false);
  const [openD, setOpenD] = useState(false);
  const [ad, setAd] = useState(null);

  const result = useQuery(ADS);

  const [deleteAds] = useMutation(DELETE_ADS, {
    onError: (error) => {
      console.log("error : ", error);
    },
    onCompleted: () => {
      setShowAlert({ message: `Ads have been removed.`, isError: false });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 3000);
      handleCloseD();
    },
  });

  const [deleteImage] = useMutation(DELETE_IMAGE, {
    onError: (error) => {
      console.log("error : ", error);
    },
  });

  const [updatePosition] = useMutation(UPDATE_POSITION, {
    onError: (error) => {
      console.log("error: ", error);
    },
    onCompleted: (res) => {
      setShowAlert({
        message: `Ads "${res?.update_ads_by_pk.title}" have been put to the top.`,
        isError: false,
      });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 3000);
      handleCloseD();
    },
    refetchQueries: [ADS],
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
    setAd(row);
    setOpenE(true);
  };
  const handleCloseE = () => {
    result.refetch();
    setOpenE(false);
  };
  const handleOpenD = (row) => {
    setAd(row);
    setOpenD(true);
  };
  const handleCloseD = () => {
    result.refetch();
    setOpenD(false);
  };

  const adsAlert = (message, isError = false) => {
    setShowAlert({ message: message, isError: isError });
    setTimeout(() => {
      setShowAlert({ message: "", isError: false });
    }, 3000);
  };

  const handleDelete = () => {
    if (!ad) {
      return;
    }

    let image_url = ad.image_url;
    let image_name = image_url.substring(
      image_url.lastIndexOf("/") + 1,
      image_url.lenght
    );
    deleteAds({ variables: { id: ad.id } });
    deleteImage({ variables: { image_name: image_name } });
  };

  const ads = result.data.ads;

  return (
    <div>
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">Dashboard</Link>
          <span>Ads</span>
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
        <Button onClick={handleOpen} variant="contained" sx={{ height: 100 }}>
          {open ? "Close" : "Add Ads"}
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
        {ads.map((row, index) => (
          <Card sx={{ maxWidth: 345 }} key={index}>
            <CardMedia
              component="img"
              height="140"
              image={row.image_url}
              alt="Ads"
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
                variant="contained"
                onClick={() =>
                  updatePosition({
                    variables: {
                      id: row.id,
                      updateAt: new Date().toISOString(),
                    },
                  })
                }
              >
                Put to Top
              </Button>
              <Button
                onClick={() => handleOpenE(row)}
                color="primary"
                size="small"
                variant="contained"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleOpenD(row)}
                color="error"
                size="small"
                variant="contained"
              >
                Remove
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
      <Modal
        keepMounted
        open={openD}
        onClose={handleCloseD}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={styleD}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            Remove Ads
          </Typography>
          <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
            Are you sure want to remove?
          </Typography>
          <Box sx={{ textAlign: "center", mt: 2, alignItems: "center" }}>
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
        >
          <Box sx={style}>
            <CreateAds adsAlert={adsAlert} handleClose={handleClose} />
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
            <UpdateAds adsAlert={adsAlert} handleClose={handleCloseE} ad={ad} />
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

export default Index;
