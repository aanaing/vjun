import React, { useState } from "react"
import product from "../../services/product";
import { useMutation, useQuery } from '@apollo/client'
import { GET_IMAGE_UPLOAD_URL } from '../../gql/misc'
import { CREATE_PRODUCT, CATEGORIES } from '../../gql/products'

import { Box, Card, CardContent, FormControl, TextField, Typography, CardMedia, Alert, Select, InputLabel, MenuItem, FormHelperText,
    Button
} from '@mui/material'
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

const CreateProduct = (props) => {

    const [ loading, setLoading ] = useState(false)
    const [ showAlert, setShowAlert ] = useState({ message: '', isError: false });
    const [ values, setValues ] = useState({
        name: '', price: '', description: '', product_image_url: '', category: ''
    })
    const [ errors, setErrors ] = useState({
        name: '', price: '', description: '', product_image_url: '', category: ''
    })
    const [ imagePreview, setImagePreview ] = useState(null)
    const [ imageFile, setImageFile ] = useState(null)
    const [ imageFileUrl, setImageFileUrl ] = useState(null)

    const result = useQuery(CATEGORIES)

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
            setValues({ ...values, product_image_url: `https://axra.sgp1.digitaloceanspaces.com/VJun/${result.getImageUploadUrl.imageName}` })
        },
    })

    // const updateCache = (cache, {data}) => {
    //     const existingProducts = cache.readQuery({
    //         query: PRODUCTS,
    //         variables: { limit: props.limit, offset: props.offset }
    //     })
    //     console.log(existingProducts)
    //     const newProducts = data.insert_products_one
    //     cache.writeQuery({
    //         query: PRODUCTS,
    //         data: { products: [ newProducts, ...existingProducts.products ], products_aggregate: existingProducts.products_aggregate }
    //     })
    // }

    const [ createProduct ] = useMutation(CREATE_PRODUCT, {
        onError: (error) => {
            console.log('error : ', error)
            setShowAlert({ message: 'Error on server', isError: true })
            setTimeout(() => {
                setShowAlert({ message: '', isError: false })
            }, 1000)
            setLoading(false)
        },
        onCompleted: () => {
            setValues({name: '', price: '', description: '', product_image_url: '', category: ''})
            setErrors({name: '', price: '', description: '', product_image_url: '', category: ''})
            setImageFile('')
            setImagePreview('')
            setLoading(false)
            setShowAlert({ message: 'Product have been created.', isError: false })
            setTimeout(() => {
                setShowAlert({ message: '', isError: false })
            }, 1000)
        },
        // update: updateCache
    })

    const imageChange = async (e) => {
        if(e.target.files && e.target.files[0]) {
            let img = e.target.files[0]
            if(!fileTypes.includes(img.type)) {
                setErrors({ ...errors, product_image_url: 'Please select image. (PNG, JPG, JPEG, GIF, ...)' })
                return
            }
            if(img.size > 10485760 ) {
                setErrors({ ...errors, product_image_url: 'Image file size must be smaller than 10MB.' })
                return
            }
            setImageFile(img)
            setImagePreview(URL.createObjectURL(img))
            getImageUrl()
        }
    }

    const handleCreate = async () => {
        setLoading(true)
        setErrors({name: '', price: '', description: '', product_image_url: '', category: ''})
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
        if(!values.description) {
            errorObject.description = 'Description field is required.'
            isErrorExit = true
        }
        if(!values.product_image_url || !imageFile) {
            errorObject.product_image_url = 'Image field is required.'
            isErrorExit = true
        }
        if(!values.category) {
            errorObject.category = 'Category field is required.'
            isErrorExit = true
        }
        if(isErrorExit) {
            setErrors({ ...errorObject })
            setLoading(false)
            return
        }
        try {
            await product.uploadImage(imageFileUrl, imageFile)
            createProduct({variables: { ...values }})
        } catch (error) {
            console.log('error : ', error)
        }
    }

    if(result.loading) {
        return (
          <div>
            <em>Loading...</em>
          </div>
        )
    }

    return (
        <div style={{ position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
            <Typography variant='h4' component='h2' sx= {{ m: 3 }} >Create Product</Typography>
            <Button onClick={props.handleClose} variant="outlined" sx={{ height: 50 }}>Close</Button>
        </Box>
        <Box
            sx={{
            display: 'flex',
            '& > :not(style)': {
                m: 1,
                width: '100%',
                minHeight: '83vh',
            },
            flexDirection: 'column'
            }}
        >
            <Card sx={{ display: 'flex', justifyContent: 'center' }} >
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
                        <FormControl sx={{ m: 2 }} variant="outlined">
                            <TextField id="description" label="Description"
                                value={values.description}
                                onChange={handleChange('description')}
                                error={errors.description? true: false}
                                helperText={errors.description}
                                multiline
                                rows={3}
                            />
                        </FormControl>
                        <FormControl sx={{ m: 2 }}>
                            <TextField id="image" placeholder="Upload image" InputLabelProps={{ shrink: true }} label="Upload Image"
                                onChange={imageChange}
                                error={errors.product_image_url? true: false}
                                helperText={errors.product_image_url}
                                type="file" accept="image/png, image/jpeg, image/jpg, image/gif, image/svg+xml"
                            />
                        </FormControl>
                        <FormControl sx={{ m: 2 }} variant="outlined">
                          <InputLabel id="category">Category</InputLabel>
                          <Select
                            labelId="category"
                            value={values.category}
                            label="Category"
                            onChange={handleChange('category')}
                            error={errors.category? true:false}
                          >
                            {
                                result.data.product_categories.map(c => (
                                    <MenuItem key={c.id} value={c.id} >{c.product_category_name}</MenuItem>
                                ))
                            }
                          </Select>
                          {
                            errors.category && <FormHelperText error >{errors.category}</FormHelperText>
                          }
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
        </Box>
        {
            (showAlert.message && !showAlert.isError) && <Alert sx={{ position: 'absolute', bottom: '1em', right: '1em' }} severity="success">{showAlert.message}</Alert>
        }
        {
            (showAlert.message && showAlert.isError) && <Alert sx={{ position: 'absolute', bottom: '1em', right: '1em' }} severity="warning">{showAlert.message}</Alert>
        }
        </div>
    )
}

export default CreateProduct