import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Typography,
  Button,
  TablePagination,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { useLazyQuery } from "@apollo/client";
import { CUSTOMIZE_ORDRES } from "../../gql/customization_order";

const Index = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const [orders, setOrders] = useState(null);

  const [loadOrders, result] = useLazyQuery(CUSTOMIZE_ORDRES);

  useEffect(() => {
    loadOrders({ variables: { limit: rowsPerPage, offset: offset } });
  }, [loadOrders, offset, rowsPerPage]);

  useEffect(() => {
    if (result.data) {
      setOrders(result.data.customization_order);
      setCount(
        Number(result.data?.customization_order_aggregate.aggregate.count)
      );
    }
  }, [result.data]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setOffset(rowsPerPage * newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (!orders) {
    return (
      <div>
        <em>Loading...</em>
      </div>
    );
  }

  const detail = (product) => {
    navigate(`/customize_order/${product.id}`);
  };

  return (
    <div>
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">Dashboard</Link>
          <span>Cutomize Orders</span>
        </Breadcrumbs>
      </div>
      <Box>
        <Typography
          variant="h4"
          component="h2"
          sx={{ my: 2, fontWeight: "bold" }}
        >
          Customize Orders
        </Typography>
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
                <TableCell style={{ minWidth: 60 }}>ID</TableCell>
                <TableCell style={{ mimWidth: 60 }}>Customer's Name</TableCell>
                <TableCell style={{ mimWidth: 60 }}>Model Name</TableCell>
                <TableCell style={{ mimWidth: 60 }}>Brand</TableCell>
                <TableCell style={{ mimWidth: 60 }}>Status</TableCell>
                <TableCell style={{ mimWidth: 60 }}>Total Price</TableCell>
                <TableCell style={{ mimWidth: 60 }}>Total Quantity</TableCell>
                <TableCell style={{ minWidth: 70 }}>Created At</TableCell>
                <TableCell style={{ minWidth: 50 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell>{row.order_readable_id}</TableCell>
                    <TableCell>{row.user?.name}</TableCell>
                    <TableCell>{row.model_name}</TableCell>
                    <TableCell>{row.brand_name}</TableCell>
                    <TableCell>{row.order_status}</TableCell>
                    <TableCell>{row.total_price}</TableCell>
                    <TableCell>{row.total_quantity}</TableCell>
                    <TableCell>{row.created_at.substring(0, 10)}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        color="secondary"
                        onClick={() => detail(row)}
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
    </div>
  );
};

export default Index;
