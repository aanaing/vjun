import React, { useEffect, useState } from "react"
import product from "../../services/image";
import { useMutation, useQuery } from '@apollo/client'
import { GET_IMAGE_UPLOAD_URL, CATEGORIES, BRANDS, DELETE_IMAGE } from '../../gql/misc'
import { UPDATE } from '../../gql/loyalty_products'

import { Box, Card, CardContent, FormControl, TextField, Typography, CardMedia, Alert, Select, InputLabel, MenuItem, FormHelperText,
    Button
} from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LoadingButton } from '@mui/lab';
import RichTextEditor from 'react-rte'

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

const UpdateLoyaltyProduct = (props) => {

    const [ loading, setLoading ] = useState(false)
    const [ showAlert, setShowAlert ] = useState({ message: '', isError: false });
    const [ values, setValues ] = useState({
        name: '', price: '', description: '', image_url: '', amount_left: '', category_id: '', brand_id: '', date: new Date().toISOString()
    })
    const [ errors, setErrors ] = useState({
        name: '', price: '', description: '', image_url: '', amount_left: '', category_id: '', brand_id: '', date: ''
    })
    const [ textValue, setTextValue ] = useState(RichTextEditor.createEmptyValue())
    const [ imagePreview, setImagePreview ] = useState(null)
    const [ imageFile, setImageFile ] = useState(null)
    const [ imageFileUrl, setImageFileUrl ] = useState(null)
    const [ isImageChange, setIsImageChange ] = useState(false)
    const [ oldImageName, setOldImageName ] = useState(null)

    const category_result = useQuery(CATEGORIES)
    const brand_result = useQuery(BRANDS)

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
            setIsImageChange(true)
            setValues({ ...values, image_url: `https://axra.sgp1.digitaloceanspaces.com/VJun/${result.getImageUploadUrl.imageName}` })
        },
    })

    const [ deleteImage ] = useMutation(DELETE_IMAGE, {
        onError: (error) => {
            console.log('error : ', error)
            setLoading(false)
        },
    })

    const [ updateProduct ] = useMutation(UPDATE, {
        onError: (error) => {
            console.log('error : ', error)
            setShowAlert({ message: 'Error on server', isError: true })
            setTimeout(() => {
                setShowAlert({ message: '', isError: false })
            }, 1000)
            setLoading(false)
        },
        onCompleted: () => {
            setValues({name: '', price: '', description: '', image_url: '', amount_left: '', category_id: '', brand_id: '', date: new Date().toISOString()})
            setErrors({name: '', price: '', description: '', image_url: '', amount_left: '', category_id: '', brand_id: '', date: ''})
            setImageFile('')
            setImagePreview('')
            setLoading(false)
            props.productAlert('Loyalty Product have been updated', false)
            props.handleClose()
        },
    })

    useEffect(() => {
        let product = props.product
        setValues({ name:  product.name, price: product.point_price, description: product.description, amount_left: product.amount_left, image_url: product.product_image_url, category_id: product.fk_product_category_id, brand_id: product.fk_brand_id, date: product.expiry_date})
        setTextValue(RichTextEditor.createValueFromString(product.description, 'html'))
        setImagePreview(product.product_image_url)
        let image_url = product.product_image_url
        setOldImageName(image_url.substring(image_url.lastIndexOf('/') + 1,image_url.lenght ))
    }, [props.product])

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
        setErrors({name: '', price: '', description: '', image_url: '', amount_left: '', category_id: '', brand_id: '', date: ''})
        let isErrorExit = false
        let errorObject = {}
        if(!values.name) {
            errorObject.name = 'Name field is required.'
            isErrorExit = true
        }
        if(!values.price) {
            errorObject.price = 'Point Price field is required.'
            isErrorExit = true
        }
        if(values.price && isNaN(+values.price)) {
            errorObject.price = 'Point Price filed accepts only numeric number.'
            isErrorExit = true
        }
        if(!values.description) {
            errorObject.description = 'Description field is required.'
            isErrorExit = true
        }
        if(!values.image_url) {
            errorObject.image_url = 'Image field is required.'
            isErrorExit = true
        }
        if(!values.category_id) {
            errorObject.category_id = 'Category field is required.'
            isErrorExit = true
        }
        if(!values.brand_id) {
            errorObject.brand_id = 'Brand field is required.'
            isErrorExit = true
        }
        if(isNaN(values.amount_left)) {
            errorObject.amount_left = 'Amount Left field is required.'
            isErrorExit = true
        }
        if(isErrorExit) {
            setErrors({ ...errorObject })
            setLoading(false)
            return
        }
        try {
            if(isImageChange) {
                await product.uploadImage(imageFileUrl, imageFile)
                deleteImage({ variables: { image_name: oldImageName } })
            }
            updateProduct({variables: { ...values, id: props.product.id, image_name: oldImageName }})
        } catch (error) {
            console.log('error : ', error)
        }
    }

    if(category_result.loading || brand_result.loading) {
        return (
          <div>
            <em>Loading...</em>
          </div>
        )
    }

    const toolbarConfig = {
        // Optionally specify the groups to display (displayed in the order listed).
        display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
        INLINE_STYLE_BUTTONS: [
          {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
          {label: 'Italic', style: 'ITALIC'},
          {label: 'Underline', style: 'UNDERLINE'}
        ],
        BLOCK_TYPE_DROPDOWN: [
          {label: 'Normal', style: 'unstyled'},
          {label: 'Heading Large', style: 'header-one'},
          {label: 'Heading Medium', style: 'header-two'},
          {label: 'Heading Small', style: 'header-three'}
        ],
        BLOCK_TYPE_BUTTONS: [
          {label: 'UL', style: 'unordered-list-item'},
          {label: 'OL', style: 'ordered-list-item'}
        ]
      };

    const onChange = (value) => {
        setTextValue(value)
       setValues({ ...values, description: value.toString('html') })
    }

    return (
        <div style={{ position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
            <Typography variant='h4' component='h2' sx= {{ m: 3 }} >Update Loyalty Product</Typography>
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
            <Card sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }} >
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ display: 'inline-flex', flexDirection: 'column', flex: 1, my: 5, mx: 2 }}>
                    <CardMedia
                        component="img"
                        image={imagePreview}
                        alt="Product"
                        sx={{flex: 1, bgcolor: '#cecece', maxHeight: 300, objectFit: 'contain'}}
                    />
                    <Typography variant="span" component="div" >1024 * 1024 recommended</Typography>
                </Box>
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
                            <TextField id="price" label="Point Price"
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
                          <InputLabel id="category">Category</InputLabel>
                          <Select
                            labelId="category"
                            value={values.category_id}
                            label="Category"
                            onChange={handleChange('category_id')}
                            error={errors.category? true:false}
                          >
                            {
                                category_result.data.product_categories.map(c => (
                                    <MenuItem key={c.id} value={c.id} >{c.product_category_name}</MenuItem>
                                ))
                            }
                          </Select>
                          {
                            errors.category_id && <FormHelperText error >{errors.category_id}</FormHelperText>
                          }
                        </FormControl>
                        <FormControl sx={{ m: 2 }} variant="outlined">
                          <InputLabel id="brand">Brand</InputLabel>
                          <Select
                            labelId="brand"
                            value={values.brand_id}
                            label="Brand"
                            onChange={handleChange('brand_id')}
                            error={errors.brand_id? true:false}
                          >
                            {
                                brand_result.data.brand_name.map(b => (
                                    <MenuItem key={b.id} value={b.id} >{b.name}</MenuItem>
                                ))
                            }
                          </Select>
                          {
                            errors.brand_id && <FormHelperText error >{errors.brand_id}</FormHelperText>
                          }
                        </FormControl>
                        <FormControl sx={{ m: 2 }}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DesktopDatePicker
                                    label="Expire Date"
                                    value={values.date}
                                    onChange={(newValue) => {
                                        setValues({ ...values, date: newValue })
                                    }}
                                    error={errors.date? true: false}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </FormControl>
                        <FormControl sx={{ m: 2 }} variant="outlined">
                            <TextField id="amount_left" label="Amount Left"
                                value={values.amount_left}
                                onChange={handleChange('amount_left')}
                                error={errors.amount_left? true: false}
                                helperText={errors.amount_left}
                                type="number"
                            />
                        </FormControl>
                    </Box>
                </CardContent>
                <Box sx={{ my: 1 }}>
                    <InputLabel>Description</InputLabel>
                    <RichTextEditor style={{ height: '500px' }} value={textValue} onChange={onChange} toolbarConfig={toolbarConfig} />
                    {
                        errors.description && <FormHelperText error >{ errors.description }</FormHelperText>
                    }
                </Box>
            </Box>
                <FormControl sx={{ m: 2 }} variant="outlined">
                    <LoadingButton
                        variant="contained"
                        loading={loading}
                        onClick={handleCreate}
                        sx={{ backgroundColor: '#4b26d1', alignSelf: 'end' }}
                    >
                        Update
                    </LoadingButton>
                </FormControl>
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

export default UpdateLoyaltyProduct