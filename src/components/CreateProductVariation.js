import React, { useState } from "react"
import product from "../services/product";
import { useMutation } from '@apollo/client'
import { GET_IMAGE_UPLOAD_URL } from '../gql/misc'
import { CREATE_PRODUCT_VARIATION } from '../gql/products'

import { Box, Card, CardContent, FormControl, TextField, CardMedia, Alert } from '@mui/material'
import { LoadingButton } from '@mui/lab';

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
    "image/x-icon"
];

const CreateProductVariation = ({ product_id }) => {

    const [ loading, setLoading ] = useState(false)
    const [ showAlert, setShowAlert ] = useState({ message: '', isError: false });
    const [ values, setValues ] = useState({
        name: '', price: '',  image_url: ''
    })
    const [ errors, setErrors ] = useState({
        name: '', price: '', image_url: ''
    })
    const [ imagePreview, setImagePreview ] = useState(null)
    const [ imageFile, setImageFile ] = useState(null)
    const [ imageFileUrl, setImageFileUrl ] = useState(null)

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const [ getImageUrl ] = useMutation(GET_IMAGE_UPLOAD_URL, {
        onError: (error) => {
            console.log('error : ', error)
            setShowAlert({ message: 'Error on server', isError: true })
            setTimeout(() => {
                setShowAlert({ message: '', isError: false })
            }, 1000)
        },
        onCompleted: (result) => {
            setImageFileUrl(result.getImageUploadUrl.imageUploadUrl)
            setValues({ ...values, image_url: `https://axra.sgp1.digitaloceanspaces.com/VJun/${result.getImageUploadUrl.imageName}` })
        },
        // refetchQueries: [ { query: PRODUCT_VARIATIONS } ]
    })

    const [ createProductVariation ] = useMutation(CREATE_PRODUCT_VARIATION, {
        onError: (error) => {
            console.log('error : ', error)
            setShowAlert({ message: 'Error on server', isError: true })
            setTimeout(() => {
                setShowAlert({ message: '', isError: false })
            }, 1000)
        },
        onCompleted: () => {
            setValues({ name: '', price: '',  image_url: ''})
            setErrors({ name: '', price: '',  image_url: '' })
            setImageFile('')
            setImagePreview('')
            setLoading(false)
            setShowAlert({ message: 'Product variation have been created.', isError: false })
            setTimeout(() => {
                setShowAlert({ message: '', isError: false })
            }, 1000)
        },
    })

    const imageChange = async (e) => {
        if(e.target.files && e.target.files[0]) {
            let img = e.target.files[0]
            if(!fileTypes.includes(img.type)) {
                setErrors({ ...errors, image_url: 'Please select image. (PNG, JPG, JPEG, GIF, ...)' })
                return
            }
            if(img.size > 10485760 ) {
                setErrors({ ...errors, image_url: 'Image file size must be smaller than 10MB.' })
                return
            }
            setImageFile(img)
            setImagePreview(URL.createObjectURL(img))
            getImageUrl()
        }
    }

    const handleCreate = async () => {
        setLoading(true)
        setErrors({name: '', price: '',  image_url: ''})
        let isErrorExit = false
        let errorObject = {}
        if(!values.name) {
            errorObject.name = 'Name field is required.'
            isErrorExit = true
        }
        if(!values.price) {
            errorObject.price = 'Price field is required.'
            isErrorExit = true
        }
        if(values.price && isNaN(+values.price)) {
            errorObject.price = 'Price filed accepts only numeric number.'
            isErrorExit = true
        }
        if(!values.image_url || !imageFile) {
            errorObject.image_url = 'Image field is required.'
            isErrorExit = true
        }
        if(isErrorExit) {
            setErrors({ ...errorObject })
            setLoading(false)
            return
        }
        try {
            await product.uploadImage(imageFileUrl, imageFile)
            createProductVariation({variables: { ...values, product_id: product_id }})
        } catch (error) {
            console.log('error : ', error)
        }
    }

    return (
        <div>
            <Card sx={{ display: 'flex', justifyContent: 'space-between', }}>
                <CardMedia
                    component="img"
                    image={imagePreview}
                    alt="Product"
                    sx={{flex: 1, m: 5, bgcolor: '#cecece', maxHeight: 300}}
                />
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
                            <TextField id="price" label="General Price"
                                value={values.price}
                                onChange={handleChange('price')}
                                error={errors.price? true: false}
                                helperText={errors.price}
                            />
                        </FormControl>
                        <FormControl sx={{ m: 2 }}>
                            <TextField id="image" placeholder="Upload image" InputLabelProps={{ shrink: true }} label="Upload Image"
                                onChange={imageChange}
                                error={errors.image_url? true: false}
                                helperText={errors.image_url}
                                type="file" accept="image/png, image/jpeg, image/jpg, image/gif, image/svg+xml"
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
        {
            (showAlert.message && !showAlert.isError) && <Alert sx={{ position: 'absolute', bottom: '1em', right: '1em' }} severity="success">{showAlert.message}</Alert>
        }
        {
            (showAlert.message && showAlert.isError) && <Alert sx={{ position: 'absolute', bottom: '1em', right: '1em' }} severity="warning">{showAlert.message}</Alert>
        }
        </div>
    )
}

export default CreateProductVariation