import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Button,
  Modal,
  TablePagination,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
} from "@mui/material";

import { useLazyQuery, useMutation } from "@apollo/client";
import { BLOGS, UPDATE_POSITION } from "../../gql/blog";
import CreateBlog from "../../components/blogs/CreateBlog";

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
const Index = ({ homeAlert }) => {
  const navigate = useNavigate();

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const [blogs, setBlogs] = useState(null);
  const [open, setOpen] = useState(false);

  const [loadBlogs, result] = useLazyQuery(BLOGS);

  const [updatePosition] = useMutation(UPDATE_POSITION, {
    onError: (error) => {
      console.log("error: ", error);
    },
    onCompleted: (res) => {
      homeAlert(`Blog have been put to the top.`);
    },
    refetchQueries: [BLOGS],
  });

  useEffect(() => {
    loadBlogs({
      variables: {
        limit: rowsPerPage,
        offset: offset,
      },
    });
  }, [loadBlogs, offset, rowsPerPage]);

  useEffect(() => {
    if (result.data) {
      setBlogs(result.data.blog_data);
      setCount(Number(result.data?.blog_data_aggregate.aggregate.count));
    }
  }, [result]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setOffset(rowsPerPage * newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (!blogs) {
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

  const detailBlog = (product) => {
    navigate(`/blog/${product.id}`);
  };

  return (
    <div>
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">Dashboard</Link>
          <span>Blogs</span>
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
          {open ? "Close" : "Create Blog"}
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
                <TableCell style={{ minWidth: 70 }}>Title</TableCell>
                <TableCell style={{ minWidth: 60 }}>Image</TableCell>
                <TableCell style={{ minWidth: 60 }}>Created At</TableCell>
                <TableCell style={{ minWidth: 70 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blogs?.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>
                      <Avatar
                        alt="Product"
                        src={row.title_image_url}
                        sx={{ width: 56, height: 56 }}
                      >
                        B
                      </Avatar>
                    </TableCell>
                    <TableCell>{row.created_at.substring(0, 10)}</TableCell>
                    <TableCell>
                      <Button
                        color="primary"
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
                        size="small"
                        color="secondary"
                        onClick={() => detailBlog(row)}
                      >
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
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
      <div style={{ minHeight: "auto" }}>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ width: "100vw" }}
        >
          <Box sx={style}>
            <CreateBlog handleClose={handleClose} />
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Index;
