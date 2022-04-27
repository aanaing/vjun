import React, { useState } from 'react';
import { useMutation } from '@apollo/client'
import { LOGIN } from '../gql/auth'
import * as jose from 'jose'
import { useNavigate } from 'react-router-dom'

import { TextField, Alert } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';

const Login = () => {

    const [values, setValues] = React.useState({
        phone: '', //
        password: '', //
        showPassword: false,
    });
    const [loading, setLoading] = React.useState(false);
    const [ errors, setErrors ] = React.useState({
        phone: '',
        password: '',
    })
    const [ showAlert, setShowAlert ] = useState({ message: '', isError: false });
    const navigate = useNavigate()

    const [ postLogin ] = useMutation(LOGIN, {
        onError: (error) => {
            console.log('error : ', error)
            setShowAlert({ message: 'Error on server', isError: true })
            setTimeout(() => {
                setShowAlert({ message: '', isError: false })
            }, 3000)
        },
        onCompleted: (result) => {
            console.log(result)
            setValues({ phone: '', password: '', showPassword: false })
            setLoading(false)
            if(result.LogIn.error) {
                setShowAlert({ message: result.LogIn.message, isError: true })
                setTimeout(() => {
                    setShowAlert({ message: '', isError: false })
                }, 3000)
                return
            }
            const decodedToken = jose.decodeJwt(result.LogIn.accessToken)
            const data = JSON.stringify({
                token: result.LogIn.accessToken,
                userID: decodedToken.hasura['x-hasura-user-id']
            })
            console.log(data)
            window.localStorage.setItem('loggedUser', data)
            navigate('/')
        }
    })

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
            phone: '',
            password: '',
        })
        setLoading(true);
        let errorExist = false
        const tempErrors = {}
        if(!values.phone) {
            tempErrors.phone = 'Phone field is required.'
            errorExist = true;
        }
        if(!values.password) {
            tempErrors.password = 'Password field is required.'
            errorExist = true;
        }
        if(errorExist) {
            setErrors({ ...tempErrors })
            setLoading(false)
            return
        }
        postLogin({ variables: { phone: values.phone, password: values.password } })
    }

    return (
        <>
            <CssBaseline />
            <Container maxWidth="sm">
                <Box sx={{ height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                }} >
                    <Box  sx={{ m: 5 }}>
                        <Typography variant='h4' paragraph>
                           V.Jun Admin Dashboard
                        </Typography>
                        <Typography variant="subtitle2" component="p" >
                            Enter your credentials to continue
                        </Typography>
                    </Box>
                    <Box>
                        <FormControl sx={{ m: 2, width: '300px' }} variant="outlined">
                            <TextField id="phone" label="Phone"
                                value={values.phone}
                                onChange={handleChange('phone')}
                                error={errors.phone? true: false}
                                helperText={errors.phone}
                            />
                        </FormControl>
                        <FormControl sx={{ m: 2, width: '300px' }} variant="outlined">
                            <TextField
                                id="password"
                                type={values.showPassword ? 'text' : 'password'}
                                value={values.password}
                                onChange={handleChange('password')}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                label="Password"
                                error={errors.password? true: false}
                                helperText={errors.password}
                            />
                        </FormControl>
                        <FormControl sx={{ m: 2, width: '300px' }} >
                            <LoadingButton
                                onClick={handleClick}
                                loading={loading}
                                variant="contained"
                                sx={{ backgroundColor: '#4b26d1' }}
                            >
                                Sign In
                            </LoadingButton>
                        </FormControl>
                    </Box>
                </Box>
                {
                    (showAlert.message && !showAlert.isError) && <Alert sx={{ position: 'absolute', bottom: '1em', right: '1em' }} severity="success">{showAlert.message}</Alert>
                }
                {
                    (showAlert.message && showAlert.isError) && <Alert sx={{ position: 'absolute', bottom: '1em', right: '1em' }} severity="warning">{showAlert.message}</Alert>
                }
            </Container>
        </>
    )
}

export default Login