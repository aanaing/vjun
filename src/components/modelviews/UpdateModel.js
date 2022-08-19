import React, { useState, useEffect } from "react";
import imageService from "../../services/image";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_IMAGE_UPLOAD_URL,
  CUSTOMIZATION_MODELS,
  DELETE_IMAGE,
} from "../../gql/misc";
import { UPDATED_MODEL } from "../../gql/models";

import {
  Box,
  FormControl,
  TextField,
  Typography,
  Alert,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";

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
  "image/x-icon",
];

let whichFile = "";

const UpdateModel = (props) => {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState({ message: "", isError: false });
  const [values, setValues] = useState({
    name: "",
    width: "",
    height: "",
    url: "",
    device_url: "",
    brand: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    width: "",
    height: "",
    url: "",
    device_url: "",
    brand: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [oldImageName, setOldImageName] = useState({});
  const [isImageChange, setIsImageChange] = useState({});

  const brand_result = useQuery(CUSTOMIZATION_MODELS);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const [getImageUrl] = useMutation(GET_IMAGE_UPLOAD_URL, {
    onError: (error) => {
      console.log("error : ", error);
      setShowAlert({ message: "Error on server", isError: true });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 1000);
    },
    onCompleted: (result) => {
      setImageFileUrl({
        ...imageFileUrl,
        [whichFile]: result.getImageUploadUrl.imageUploadUrl,
      });
      setIsImageChange({ ...isImageChange, [whichFile]: true });
      setValues({
        ...values,
        [whichFile]: `https://axra.sgp1.digitaloceanspaces.com/VJun/${result.getImageUploadUrl.imageName}`,
      });
    },
  });

  const [deleteImage] = useMutation(DELETE_IMAGE, {
    onError: (error) => {
      console.log("error : ", error);
      setLoading(false);
    },
  });

  const [updateModel] = useMutation(UPDATED_MODEL, {
    onError: (error) => {
      console.log("error : ", error);
      setShowAlert({ message: "Error on server", isError: true });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 1000);
      setLoading(false);
    },
    onCompleted: () => {
      setValues({
        name: "",
        width: "",
        height: "",
        url: "",
        device_url: "",
        brand: "",
      });
      setErrors({
        name: "",
        width: "",
        height: "",
        url: "",
        device_url: "",
        brand: "",
      });
      setImageFile({});
      setLoading(false);
      props.modelAlert("Model have been updated.", false);
      props.handleClose();
    },
  });

  useEffect(() => {
    let model = props.model;
    setValues({
      name: model.model_name,
      width: model.model_device_width,
      height: model.model_device_height,
      url: model.model_image_url,
      device_url: model.model_device_image_url,
      brand: model.customization_brand.id,
    });
    let url = model.model_image_url;
    let device_url = model.model_device_image_url;
    setOldImageName({
      url: url.substring(url.lastIndexOf("/") + 1, url.lenght),
      device_url: device_url.substring(
        device_url.lastIndexOf("/") + 1,
        device_url.lenght
      ),
    });
  }, [props.model]);

  const imageChange = async (e, name) => {
    whichFile = name;
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      if (!fileTypes.includes(img.type)) {
        setErrors({
          ...errors,
          product_image_url: "Please select image. (PNG, JPG, JPEG, GIF, ...)",
        });
        return;
      }
      if (img.size > 10485760) {
        setErrors({
          ...errors,
          product_image_url: "Image file size must be smaller than 10MB.",
        });
        return;
      }
      setImageFile({ ...imageFile, [name]: img });
      getImageUrl();
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setErrors({
      name: "",
      width: "",
      height: "",
      url: "",
      device_url: "",
      brand: "",
    });
    let isErrorExit = false;
    let errorObject = {};
    if (!values.name) {
      errorObject.name = "Name field is required.";
      isErrorExit = true;
    }
    if (!values.width) {
      errorObject.width = "Device Width field is required.";
      isErrorExit = true;
    }
    if (!values.height) {
      errorObject.height = "Device Height filed is required.";
      isErrorExit = true;
    }
    if (!values.brand) {
      errorObject.brand = "Barnd field is required.";
      isErrorExit = true;
    }
    if (!values.url) {
      errorObject.url = "Image field is required.";
      isErrorExit = true;
    }
    if (!values.device_url) {
      errorObject.device_url = "Device Image field is required.";
      isErrorExit = true;
    }
    if (isErrorExit) {
      setErrors({ ...errorObject });
      setLoading(false);
      return;
    }
    try {
      if (isImageChange.url) {
        await imageService.uploadImage(imageFileUrl["url"], imageFile["url"]);
        deleteImage({ variables: { image_name: oldImageName["url"] } });
      }
      if (isImageChange.device_url) {
        await imageService.uploadImage(
          imageFileUrl["device_url"],
          imageFile["device_url"]
        );
        deleteImage({ variables: { image_name: oldImageName["device_url"] } });
      }
      updateModel({ variables: { ...values, id: props.model_id } });
    } catch (error) {
      console.log("error : ", error);
    }
  };

  if (brand_result.loading) {
    return (
      <div>
        <em>Loading...</em>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <Box
        sx={{
          display: "flex",
          "& > :not(style)": {
            m: 1,
            width: "100%",
            // minHeight: "83vh",
          },
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="h2" sx={{ m: 3 }}>
            Update Model
          </Typography>
          <Button
            onClick={props.handleClose}
            variant="contained"
            sx={{
              height: 40,
              minWidth: "auto",
              width: 40,
              borderRadius: "50%",
              bgcolor: "black",
            }}
          >
            <CloseIcon />
          </Button>
        </Box>
        <Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <FormControl sx={{ m: 2 }} variant="outlined">
              <TextField
                id="name"
                label="Name"
                value={values.name}
                onChange={handleChange("name")}
                error={errors.name ? true : false}
                helperText={errors.name}
              />
            </FormControl>
            <FormControl sx={{ m: 2 }} variant="outlined">
              <TextField
                id="width"
                label="Device Width"
                value={values.width}
                onChange={handleChange("width")}
                error={errors.width ? true : false}
                helperText={errors.width}
              />
            </FormControl>
            <FormControl sx={{ m: 2 }} variant="outlined">
              <TextField
                id="height"
                label="Device height"
                value={values.height}
                onChange={handleChange("height")}
                error={errors.height ? true : false}
                helperText={errors.height}
              />
            </FormControl>
            <FormControl sx={{ m: 2 }}>
              <TextField
                id="image"
                placeholder="Upload Image"
                InputLabelProps={{ shrink: true }}
                label="Upload Image"
                onChange={(e) => imageChange(e, "url")}
                error={errors.url ? true : false}
                helperText={errors.url}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/gif, image/svg+xml"
              />
            </FormControl>
            <FormControl sx={{ m: 2 }}>
              <TextField
                id="device_image"
                placeholder="Upload Device Image"
                InputLabelProps={{ shrink: true }}
                label="Upload Device Image"
                onChange={(e) => imageChange(e, "device_url")}
                error={errors.device_url ? true : false}
                helperText={errors.device_url}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/gif, image/svg+xml"
              />
            </FormControl>
            <FormControl sx={{ m: 2 }} variant="outlined">
              <InputLabel id="brand">Customization Brand</InputLabel>
              <Select
                labelId="brand"
                value={values.brand}
                label="Customization Brand"
                onChange={handleChange("brand")}
                error={errors.brand ? true : false}
              >
                {brand_result.data.customization_brand.map((b) => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.brand_name}
                  </MenuItem>
                ))}
              </Select>
              {errors.brand && (
                <FormHelperText error>{errors.brand}</FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ m: 2 }} variant="outlined">
              <LoadingButton
                variant="contained"
                loading={loading}
                onClick={handleUpdate}
                sx={{ backgroundColor: "#4b26d1", alignSelf: "end" }}
              >
                Update
              </LoadingButton>
            </FormControl>
          </Box>
        </Box>
      </Box>
      {showAlert.message && !showAlert.isError && (
        <Alert
          sx={{ position: "absolute", bottom: "1em", right: "1em" }}
          severity="success"
        >
          {showAlert.message}
        </Alert>
      )}
      {showAlert.message && showAlert.isError && (
        <Alert
          sx={{ position: "absolute", bottom: "1em", right: "1em" }}
          severity="warning"
        >
          {showAlert.message}
        </Alert>
      )}
    </div>
  );
};

export default UpdateModel;
