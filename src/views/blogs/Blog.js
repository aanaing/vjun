import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { BLOG, DELETE_BLOG } from "../../gql/blog";
import {
  Breadcrumbs,
  Typography,
  Box,
  Paper,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  ListItem,
  ListItemText,
  CardActions,
  Button,
  Modal,
  Alert,
} from "@mui/material";
import UpdateBlog from "../../components/blogs/UpdateBlog";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100vw",
  height: "100vh",
  overflow: "scroll",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const styleR = {
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

const Blog = ({ homeAlert }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const result = useQuery(BLOG, { variables: { id: id } });
  const [showAlert, setShowAlert] = useState({ message: "", isError: false });
  const [openU, setOpenU] = useState(false);
  const [openR, setOpenR] = useState(false);

  const blogAlert = (message, isError = false) => {
    setShowAlert({ message: message, isError: isError });
    setTimeout(() => {
      setShowAlert({ message: "", isError: false });
    }, 3000);
  };

  const [deleteBlog] = useMutation(DELETE_BLOG, {
    onError: (error) => {
      console.log(error);
      setShowAlert({ message: "Error on server", isError: true });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 3000);
    },
    onCompleted: () => {
      homeAlert("Blog have been removed.", false);
      navigate("/blogs");
    },
  });

  if (result.loading) {
    return (
      <div>
        <em>Loading...</em>
      </div>
    );
  }

  const handleOpenU = () => setOpenU(true);
  const handleCloseU = () => setOpenU(false);
  const handleOpenR = () => setOpenR(true);
  const handleCloseR = () => setOpenR(false);

  const blog = result.data.blog_data_by_pk;

  const handleDelete = () => {
    let image_url = blog.title_image_url;
    let image_name = image_url.substring(
      image_url.lastIndexOf("/") + 1,
      image_url.lenght
    );
    deleteBlog({ variables: { id: blog.id, image_name: image_name } });
  };

  return (
    <div>
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">Dashboard</Link>
          <Link to="/blogs">Blogs</Link>
          <span>{id}</span>
        </Breadcrumbs>
      </div>
      <Typography variant="h4" component="h2" sx={{ m: 3 }}>
        Blog
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
        <Paper elevation={3}>
          <Card>
            <CardHeader>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Blog
              </Typography>
            </CardHeader>
            <CardContent sx={{ display: "flex", justifyContent: "center" }}>
              {blog.title_image_url && blog.title_image_url !== "null" && (
                <CardMedia
                  sx={{ flex: 1 }}
                  component="img"
                  height="auto"
                  image={blog.title_image_url}
                  alt="Product"
                  className="card-media"
                />
              )}
              <Box
                sx={{
                  flex: 2,
                  mx: 1,
                  py: 1,
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <Box>
                  <ListItem>
                    <ListItemText primary="ID" secondary={blog.id} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Title" secondary={blog.title} />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Created At"
                      secondary={blog.created_at.substring(0, 10)}
                    />
                  </ListItem>
                </Box>
              </Box>
            </CardContent>

            <CardContent>
              <Typography sx={{ fontSize: 16 }} color="text" gutterBottom>
                Paragraph
              </Typography>
              <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
                <div dangerouslySetInnerHTML={{ __html: blog.body }}></div>
              </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: "flex-end" }}>
              <Box>
                <Button size="small" color="primary" onClick={handleOpenU}>
                  Edit
                </Button>
                <Button size="small" color="error" onClick={handleOpenR}>
                  Remove
                </Button>
              </Box>
            </CardActions>
          </Card>
        </Paper>
      </Box>
      <Modal
        keepMounted
        open={openR}
        onClose={handleCloseR}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={styleR}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            Confirmation
          </Typography>
          <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
            Are you sure want to remove this blog?
          </Typography>
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button color="secondary" onClick={handleCloseR}>
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
          sx={{ width: "100vw" }}
        >
          <Box sx={style}>
            <UpdateBlog
              blog={blog}
              handleClose={handleCloseU}
              blogAlert={blogAlert}
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

export default Blog;
