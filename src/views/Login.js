import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../gql/auth";
import * as jose from "jose";
import { useNavigate } from "react-router-dom";

import { TextField, Alert } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import logo from "../static/logo192.png";

const Login = () => {
  const [values, setValues] = React.useState({
    name: "", //
    password: "", //
    showPassword: false,
  });
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({
    phone: "",
    password: "",
  });
  const [showAlert, setShowAlert] = useState({ message: "", isError: false });
  const navigate = useNavigate();

  const [postLogin] = useMutation(LOGIN, {
    onError: (error) => {
      console.log("error : ", error);
      setShowAlert({ message: "Error on server", isError: true });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 3000);
    },
    onCompleted: (result) => {
      console.log(result);
      setValues({ name: "", password: "", showPassword: false });
      setLoading(false);
      if (result.AdminLogIn.error) {
        setShowAlert({ message: result.AdminLogIn.message, isError: true });
        setTimeout(() => {
          setShowAlert({ message: "", isError: false });
        }, 3000);
        return;
      }
      const decodedToken = jose.decodeJwt(result.AdminLogIn.accessToken);
      console.log(decodedToken);
      const data = JSON.stringify({
        token: result.AdminLogIn.accessToken,
        // userID: decodedToken.hasura['x-hasura-user-id']
        userID: decodedToken.user_id,
      });
      console.log(data);
      window.localStorage.setItem("loggedUser", data);
      navigate("/");
    },
  });

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClick = async () => {
    setErrors({
      name: "",
      password: "",
    });
    setLoading(true);
    let errorExist = false;
    const tempErrors = {};
    if (!values.name) {
      tempErrors.name = "Name field is required.";
      errorExist = true;
    }
    if (!values.password) {
      tempErrors.password = "Password field is required.";
      errorExist = true;
    }
    if (errorExist) {
      setErrors({ ...tempErrors });
      setLoading(false);
      return;
    }
    console.log("values : ", values);
    postLogin({ variables: { name: values.name, password: values.password } });
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            bgcolor: "#c4c4c4",
          }}
        >
          <Box sx={{ m: 1 }}>
            <img alt="V.Jun" src={logo} width="130" />
            <Typography variant="h4" paragraph>
              V.Jun Admin Dashboard
            </Typography>
            <Typography variant="subtitle2" component="p">
              Enter your credentials to continue
            </Typography>
          </Box>
          <Box>
            <FormControl sx={{ m: 2, width: "300px" }} variant="outlined">
              <TextField
                id="name"
                label="Name"
                value={values.name}
                onChange={handleChange("name")}
                error={errors.name ? true : false}
                helperText={errors.name}
              />
            </FormControl>
            <FormControl sx={{ m: 2, width: "300px" }} variant="outlined">
              <TextField
                id="password"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange("password")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" backgroundColor="#fff">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                label="Password"
                error={errors.password ? true : false}
                helperText={errors.password}
              />
            </FormControl>
            <FormControl sx={{ m: 2, width: "300px" }}>
              <LoadingButton
                onClick={handleClick}
                loading={loading}
                variant="contained"
                sx={{ backgroundColor: "#fff" }}
              >
                Sign In
              </LoadingButton>
            </FormControl>
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
      </Container>
    </>
  );
};

export default Login;
