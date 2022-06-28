import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Modal,
  TablePagination,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  FormControl,
  Avatar,
  IconButton,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import { useLazyQuery } from "@apollo/client";
import { PRODUCTS } from "../../gql/products";

import CreateProduct from "../../components/products/CreateProduct";

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

const Index = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const [products, setProducts] = useState(null);
  const [search, setSearch] = useState("");
  const [sortingCreatedAt, setSortingCreatedAt] = useState("asc");
  const [sortingAmount, setSortingAmount] = useState(null);

  const [loadProducts, result] = useLazyQuery(PRODUCTS);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    result.refetch();
    setOpen(false);
  };

  useEffect(() => {
    loadProducts({
      variables: {
        limit: rowsPerPage,
        offset: offset,
        search: `%${search}%`,
        sorting_created_at: sortingCreatedAt,
        amount: sortingAmount,
      },
    });
  }, [
    loadProducts,
    offset,
    rowsPerPage,
    search,
    sortingCreatedAt,
    sortingAmount,
  ]);

  useEffect(() => {
    if (result.data) {
      setProducts(result.data.products);
      setCount(Number(result.data?.products_aggregate.aggregate.count));
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

  if (!products) {
    return (
      <div>
        <em>Loading...</em>
      </div>
    );
  }

  const alterSorting = (property, sort) => {
    switch (property) {
      case "created_at":
        setSortingCreatedAt(
          sortingCreatedAt === "asc" || sortingCreatedAt === null
            ? "desc"
            : "asc"
        );
        setSortingAmount(null);
        break;
      case "amount":
        setSortingAmount(
          sortingAmount === "asc" || sortingAmount === null ? "desc" : "asc"
        );
        setSortingCreatedAt(null);
        break;
      default:
        break;
    }
  };

  const detailProdcut = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div>
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">Dashboard</Link>
          <span>Products</span>
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
          {open ? "Close" : "Create Product"}
        </Button>
        <FormControl sx={{ width: 300 }}>
          <TextField
            id="outlined-search"
            label="Search by Name or Barcode"
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </FormControl>
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
        {window.innerWidth > 620 ? (
          <TableContainer sx={{ maxHeight: "60vh" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ minWidth: 70 }}>Name</TableCell>
                  <TableCell style={{ minWidth: 60 }}>Image</TableCell>
                  <TableCell style={{ mimWidth: 60 }}>Category</TableCell>
                  <TableCell style={{ mimWidth: 60 }}>Brand</TableCell>
                  <TableCell style={{ minWidth: 70 }}>Price</TableCell>
                  <TableCell style={{ minWidth: 70 }}>Barcode</TableCell>
                  <TableCell style={{ minWidth: 70 }}>
                    Sold Amount
                    <IconButton
                      onClick={() => alterSorting("amount")}
                      color={!sortingAmount ? "default" : "primary"}
                      sx={{ ml: 1 }}
                      size="small"
                      component="span"
                    >
                      {sortingAmount === "asc" ? (
                        <ArrowDownwardIcon />
                      ) : (
                        <ArrowUpwardIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell style={{ minWidth: 70 }}>
                    Created At
                    <IconButton
                      onClick={() => alterSorting("created_at")}
                      color={!sortingCreatedAt ? "default" : "primary"}
                      sx={{ ml: 1 }}
                      size="small"
                      component="span"
                    >
                      {sortingCreatedAt === "asc" ? (
                        <ArrowUpwardIcon />
                      ) : (
                        <ArrowDownwardIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell style={{ minWidth: 50 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products?.map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>
                        <Avatar
                          alt="Product"
                          src={row.product_image_url}
                          sx={{ width: 56, height: 56 }}
                        >
                          P
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        {row.category?.product_category_name}
                      </TableCell>
                      <TableCell>{row.brand_name?.name}</TableCell>
                      <TableCell>{row.price}</TableCell>
                      <TableCell>{row.barcode}</TableCell>
                      <TableCell>{row.sold_amount}</TableCell>
                      <TableCell>{row.created_at.substring(0, 10)}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          color="secondary"
                          onClick={() => detailProdcut(row)}
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
        ) : (
          products.map((row, index) => (
            <Card
              sx={{ maxWidth: 100 }}
              key={index}
              onClick={() => detailProdcut(row)}
              className="card"
            >
              <CardMedia
                component="img"
                height="100"
                image={row.product_image_url}
                alt="product"
              />
              <CardContent className="card-text">
                <Typography gutterBottom variant="h5" component="div">
                  {row.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {row.description.substring(0, 20) + "..."}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <div style={{ minHeight: "auto" }}>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ width: "100vw" }}
          >
            <Box sx={style}>
              <CreateProduct handleClose={handleClose} />
            </Box>
          </Modal>
        </div>
      </Box>
    </div>
  );
};

export default Index;
