import React, { useState } from "react";
import imageService from "../../services/image";
import { useMutation } from "@apollo/client";
import { GET_IMAGE_UPLOAD_URL } from "../../gql/misc";
import RichTextEditor from "react-rte";

import {
  Box,
  FormControl,
  TextField,
  Typography,
  CardMedia,
  Alert,
  InputLabel,
  FormHelperText,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import { CREATE_BLOG } from "../../gql/blog";

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

const CreateBlog = (props) => {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState({ message: "", isError: false });
  const [values, setValues] = useState({
    title: "",
    paragraph: "",
    image_url: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    paragraph: "",
    image_url: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);

  const [textValue, setTextValue] = useState(RichTextEditor.createEmptyValue());

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
  });

  const [createBlog] = useMutation(CREATE_BLOG, {
    onError: (error) => {
      console.log("error : ", error);
      setShowAlert({ message: "Error on server", isError: true });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 1000);
      setLoading(false);
    },
    onCompleted: () => {
      setValues({ title: "", paragraph: "", image_url: "" });
      setErrors({ title: "", paragraph: "", image_url: "" });
      setTextValue(RichTextEditor.createEmptyValue());
      setImageFile("");
      setImagePreview("");
      setLoading(false);
      setShowAlert({ message: "Blog have been created.", isError: false });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 1000);
    },
  });

  const imageChange = async (e) => {
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
      setImageFile(img);
      setImagePreview(URL.createObjectURL(img));
      getImageUrl();
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    setErrors({ title: "", paragraph: "", image_url: "" });
    let isErrorExit = false;
    let errorObject = {};
    if (!values.title) {
      errorObject.title = "Title field is required.";
      isErrorExit = true;
    }
    if (!values.paragraph) {
      errorObject.paragraph = "Paragraph field is required.";
      isErrorExit = true;
    }
    if (!values.image_url || !imageFile) {
      errorObject.image_url = "Image field is required.";
      isErrorExit = true;
    }
    if (isErrorExit) {
      setErrors({ ...errorObject });
      setLoading(false);
      return;
    }
    try {
      await imageService.uploadImage(imageFileUrl, imageFile);
      createBlog({ variables: { ...values } });
    } catch (error) {
      console.log("error : ", error);
    }
  };

  const onChange = (value) => {
    setTextValue(value);
    setValues({ ...values, paragraph: value.toString("html") });
  };

  return (
    <div style={{ position: "relative" }}>
      <Box
        sx={{
          display: "flex",
          "& > :not(style)": {
            m: 1,
            width: "100%",
            minHeight: "83vh",
          },
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            // display: "flex",
            // flexDirection: "row",
            justifyContent: "center",
            display: "grid",
            gridTemplateColumns: "2fr 5fr",
          }}
        >
          <Box sx={{ flex: 2 }}>
            <Box
              sx={{
                display: "inline-flex",
                flexDirection: "column",
                flex: 3,
                width: "100%",
                minHeight: "300px",
                my: 2,
              }}
            >
              <CardMedia
                component="img"
                image={imagePreview}
                alt="Blog"
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
          </Box>
          <Box sx={{ flex: 5, ml: 5 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" component="h2" sx={{ m: 3 }}>
                Create Blog
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
            <Box sx={{ flex: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <FormControl sx={{ m: 2 }} variant="outlined">
                  <TextField
                    id="title"
                    label="Title"
                    value={values.title}
                    onChange={handleChange("title")}
                    error={errors.title ? true : false}
                    helperText={errors.title}
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
            </Box>
          </Box>
          <Box sx={{ gridColumn: "1/-1" }}>
            <InputLabel>Paragraph</InputLabel>
            <RichTextEditor
              style={{ height: "100px", overflow: "scroll" }}
              value={textValue}
              onChange={onChange}
            />
            {errors.paragraph && (
              <FormHelperText error>{errors.paragraph}</FormHelperText>
            )}
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

export default CreateBlog;
