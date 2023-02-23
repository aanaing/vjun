import React, { useState } from "react"
import { useMutation } from '@apollo/client'
import { CREATE_BANKING_ACCOUNT } from '../../gql/banking_accounts'

import { Box, Card, CardContent, FormControl, TextField, Typography, Button, } from '@mui/material'
import { LoadingButton } from '@mui/lab';

const CreateBankingAccount = ({ handleClose, bankingAlert }) => {

    const [ loading, setLoading ] = useState(false)
    const [ values, setValues ] = useState({ account_number: '', service_name: '', receiver_name: '' })
    const [ errors, setErrors ] = useState({ account_number: '', service_name: '', receiver_name: '' })

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const [ createAccount ] = useMutation(CREATE_BANKING_ACCOUNT, {
        onError: (error) => {
            console.log('error : ', error)
            setLoading(false)
        },
        onCompleted: () => {
            setValues({ account_number: '', service_name: '', receiver_name: '' })
            setErrors({ account_number: '', service_name: '', receiver_name: '' })
            setLoading(false)
            bankingAlert('Brand have been created')
            handleClose()
        },
    })

    const handleCreate = async () => {
        setLoading(true)
        setErrors({account_number: '', service_name: '', receiver_name: ''})
        let isErrorExit = false
        let errorObject = {}
        if(!values.account_number) {
            errorObject.account_number = 'Account Number field is required.'
            isErrorExit = true
        }
        if(!values.service_name) {
            errorObject.service_name = 'Service Name field is required.'
            isErrorExit = true
        }
        if(!values.receiver_name) {
            errorObject.receiver_name = 'Receiver Name field is required.'
            isErrorExit = true
        }
        if(isErrorExit) {
            setErrors({ ...errorObject })
            setLoading(false)
            return
        }
        try {
            createAccount({variables: { ...values }})
        } catch (error) {
            console.log('error : ', error)
        }
    }

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                <Typography variant='h4' component='h2' sx= {{ m: 3 }} >Create Bandking Accont</Typography>
                <Button onClick={handleClose} variant="outlined" sx={{ height: 50 }}>Close</Button>
            </Box>
            <Card sx={{ display: 'flex', justifyContent: 'space-between', }}>
                <CardContent sx={{flex: 3}}>
                    <Box sx={{ display: 'flex', flexDirection: 'column'}} >
                        <FormControl sx={{ m: 2 }} variant="outlined">
                            <TextField id="service_name" label="Service Name"
                                value={values.service_name}
                                onChange={handleChange('service_name')}
                                error={errors.service_name? true: false}
                                helperText={errors.service_name}
                            />
                        </FormControl>
                        <FormControl sx={{ m: 2 }} variant="outlined">
                            <TextField id="receiver_name" label="receiver_name"
                                value={values.receiver_name}
                                onChange={handleChange('receiver_name')}
                                error={errors.receiver_name? true: false}
                                helperText={errors.receiver_name}
                            />
                        </FormControl>
                        <FormControl sx={{ m: 2 }} variant="outlined">
                            <TextField id="account_number" label="Account Number"
                                value={values.account_number}
                                onChange={handleChange('account_number')}
                                error={errors.account_number? true: false}
                                helperText={errors.account_number}
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

export default CreateBankingAccount

