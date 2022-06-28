import React, { useState } from "react";
import product from "../../services/image";
import { useMutation, useQuery } from "@apollo/client";
import { GET_IMAGE_UPLOAD_URL, MODEL_IDS } from "../../gql/misc";
import { CREATE_PRODUCT_VARIATION } from "../../gql/products";

import {
  Box,
  Card,
  CardContent,
  FormControl,
  TextField,
  CardMedia,
  Alert,
  Typography,
  Button,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
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

let colors = [
  { label: "Red", value: "Red" },
  { label: "Green", value: "Green" },
  { label: "Blue", value: "Blue" },
  { label: "White", value: "White" },
  { label: "Skyblue", value: "Skyblue" },
];

const CreateProductVariation = ({ product_id, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState({ message: "", isError: false });
  const [values, setValues] = useState({
    name: "",
    price: "",
    image_url: "",
    color: "",
    model_id: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    price: "",
    image_url: "",
    color: "",
    model_id: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);

  const result = useQuery(MODEL_IDS);

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
      setImageFileUrl(result.getImageUploadUrl.imageUploadUrl);
      setValues({
        ...values,
        image_url: `https://axra.sgp1.digitaloceanspaces.com/VJun/${result.getImageUploadUrl.imageName}`,
      });
    },
    // refetchQueries: [ { query: PRODUCT_VARIATIONS } ]
  });

  const [createProductVariation] = useMutation(CREATE_PRODUCT_VARIATION, {
    onError: (error) => {
      console.log("error : ", error);
      setShowAlert({ message: "Error on server", isError: true });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 1000);
    },
    onCompleted: () => {
      setValues({
        name: "",
        price: "",
        image_url: "",
        color: "",
        model_id: "",
      });
      setErrors({
        name: "",
        price: "",
        image_url: "",
        color: "",
        model_id: "",
      });
      setImageFile("");
      setImagePreview("");
      setLoading(false);
      setShowAlert({
        message: "Product variation have been created.",
        isError: false,
      });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 1000);
    },
  });

  if (result.loading) {
    return <div>Loading...</div>;
  }

  const imageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      if (!fileTypes.includes(img.type)) {
        setErrors({
          ...errors,
          image_url: "Please select image. (PNG, JPG, JPEG, GIF, ...)",
        });
        return;
      }
      if (img.size > 10485760) {
        setErrors({
          ...errors,
          image_url: "Image file size must be smaller than 10MB.",
        });
        return;
      }
      setImageFile(img);
      setImagePreview(URL.createObjectURL(img));
      getImageUrl();
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    setErrors({ name: "", price: "", image_url: "", color: "", model_id: "" });
    let isErrorExit = false;
    let errorObject = {};
    if (!values.name) {
      errorObject.name = "Name field is required.";
      isErrorExit = true;
    }
    if (!values.price) {
      errorObject.price = "Price field is required.";
      isErrorExit = true;
    }
    if (values.price && isNaN(+values.price)) {
      errorObject.price = "Price filed accepts only numeric number.";
      isErrorExit = true;
    }
    if (!values.image_url || !imageFile) {
      errorObject.image_url = "Image field is required.";
      isErrorExit = true;
    }
    if (!values.color) {
      errorObject.color = "Color field is required.";
      isErrorExit = true;
    }
    if (isErrorExit) {
      setErrors({ ...errorObject });
      setLoading(false);
      return;
    }
    try {
      await product.uploadImage(imageFileUrl, imageFile);
      createProductVariation({
        variables: { ...values, product_id: product_id },
      });
    } catch (error) {
      console.log("error : ", error);
    }
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h2" sx={{ m: 3 }}>
          Create Product Variation
        </Typography>
        <Button
          onClick={handleClose}
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
      <Card sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "column",
            flex: 1,
            my: 5,
            mx: 2,
          }}
        >
          <CardMedia
            component="img"
            image={imagePreview}
            alt="Product"
            sx={{
              bgcolor: "#cecece",
              height: "300px",
              objectFit: "contain",
              borderRadius: "10px",
              padding: 1,
            }}
          />
          <Typography variant="span" component="div">
            1024 * 1024 recommended
          </Typography>
        </Box>
        <CardContent sx={{ flex: 3 }}>
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
                id="price"
                label="General Price"
                value={values.price}
                onChange={handleChange("price")}
                error={errors.price ? true : false}
                helperText={errors.price}
              />
            </FormControl>
            <FormControl sx={{ m: 2 }}>
              <TextField
                id="image"
                placeholder="Upload image"
                InputLabelProps={{ shrink: true }}
                label="Upload Image"
                onChange={imageChange}
                error={errors.image_url ? true : false}
                helperText={errors.image_url}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/gif, image/svg+xml"
              />
            </FormControl>
            <FormControl sx={{ m: 2 }} variant="outlined">
              <InputLabel id="color">Color</InputLabel>
              <Select
                labelId="color"
                value={values.color}
                label="Color"
                onChange={handleChange("color")}
                error={errors.color ? true : false}
              >
                {colors.map((color, index) => (
                  <MenuItem value={color.value} key={index}>
                    {color.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.color && (
                <FormHelperText error>{errors.color}</FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ m: 2 }} variant="outlined">
              <InputLabel id="model_id">Model ID</InputLabel>
              <Select
                labelId="model_id"
                value={values.model_id}
                label="Model ID"
                onChange={handleChange("model_id")}
                error={errors.model_id ? true : false}
              >
                {result.data.customization_model.map((model, index) => (
                  <MenuItem value={model.id} key={index}>
                    {model.model_name}
                  </MenuItem>
                ))}
              </Select>
              {errors.review && (
                <FormHelperText error>{errors.review}</FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ m: 2 }} variant="outlined">
              <LoadingButton
                variant="contained"
                loading={loading}
                onClick={handleCreate}
                sx={{ backgroundColor: "#4b26d1", alignSelf: "end" }}
              >
                Create
              </LoadingButton>
            </FormControl>
          </Box>
        </CardContent>
      </Card>
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

export default CreateProductVariation;
