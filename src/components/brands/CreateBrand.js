import React, { useState } from "react"
import { useMutation } from '@apollo/client'
import { CREATE_BRAND } from '../../gql/brands'

import { Box, Card, CardContent, FormControl, TextField, Typography, Button, } from '@mui/material'
import { LoadingButton } from '@mui/lab';

const CreateBrand = ({ handleClose, brandAlert }) => {

    const [ loading, setLoading ] = useState(false)
    const [ values, setValues ] = useState({ name: '' })
    const [ errors, setErrors ] = useState({ name: '' })

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const [ createBrand ] = useMutation(CREATE_BRAND, {
        onError: (error) => {
            console.log('error : ', error)
            setLoading(false)
        },
        onCompleted: () => {
            setValues({ name: '' })
            setErrors({ name: '' })
            setLoading(false)
            brandAlert('Brand have been created')
            handleClose()
        },
    })

    const handleCreate = async () => {
        setLoading(true)
        setErrors({name: ''})
        let isErrorExit = false
        let errorObject = {}
        if(!values.name) {
            errorObject.name = 'Name field is required.'
            isErrorExit = true
        }
        if(isErrorExit) {
            setErrors({ ...errorObject })
            setLoading(false)
            return
        }
        try {
            createBrand({variables: { ...values }})
        } catch (error) {
            console.log('error : ', error)
        }
    }

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                <Typography variant='h4' component='h2' sx= {{ m: 3 }} >Create Brand</Typography>
                <Button onClick={handleClose} variant="outlined" sx={{ height: 50 }}>Close</Button>
            </Box>
            <Card sx={{ display: 'flex', justifyContent: 'space-between', }}>
                <CardContent sx={{flex: 3}}>
                    <Box sx={{ display: 'flex', flexDirection: 'column'}} >
                        <FormControl sx={{ m: 2 }} variant="outlined">
                            <TextField id="name" label="Name"
                                value={values.name}
                                onChange={handleChange('name')}
                                error={errors.name? true: false}
                                helperText={errors.name}
                            />
                        </FormControl>
                        <FormControl sx={{ m: 2 }} variant="outlined">
                            <LoadingButton
                                variant="contained"
                                loading={loading}
                                onClick={handleCreate}
                                sx={{ backgroundColor: '#4b26d1', alignSelf: 'end' }}
                            >
                                Create
                            </LoadingButton>
                        </FormControl>
                    </Box>
                </CardContent>
            </Card>
        </div>
    )
}

export default CreateBrand