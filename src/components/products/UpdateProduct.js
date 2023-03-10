import React, { useEffect, useState } from "react"
import imageService from "../../services/image";
import { useMutation, useQuery } from '@apollo/client'
import { GET_IMAGE_UPLOAD_URL, CATEGORIES, BRANDS, DELETE_IMAGE } from '../../gql/misc'
import { UPDATE_PRODUCT } from '../../gql/products'

import { Box, FormControl, TextField, Typography, CardMedia, Alert, Select, InputLabel, MenuItem, FormHelperText,
    Button,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
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

const UpdateProduct = (props) => {

    const [ loading, setLoading ] = useState(false)
    const [ showAlert, setShowAlert ] = useState({ message: '', isError: false });
    const [ values, setValues ] = useState({
        name: '', price: '', description: '', product_image_url: '', category: '', brand: '', discount: '', review: '', barcode: ''
    })
    const [ errors, setErrors ] = useState({
        name: '', price: '', description: '', product_image_url: '', category: '', brand: '', discount: '', review: '', barcode: ''
    })
    const [ imagePreview, setImagePreview ] = useState(null)
    const [ oldImageName, setOldImageName ] = useState(null)
    const [ imageFile, setImageFile ] = useState(null)
    const [ imageFileUrl, setImageFileUrl ] = useState(null)
    const [ isImageChange, setIsImageChange ] = useState(false)
    const [ textValue, setTextValue ] = useState(RichTextEditor.createEmptyValue())

    const category_result = useQuery(CATEGORIES)
    const brand_result = useQuery(BRANDS)

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const [ deleteImage ] = useMutation(DELETE_IMAGE, {
        onError: (error) => {
            console.log('error : ', error)
            setLoading(false)
        },
    })

    const [ getImageUrl ] = useMutation(GET_IMAGE_UPLOAD_URL, {
        onError: () => {
            setShowAlert({ message: 'Error on server', isError: true })
            setTimeout(() => {
                setShowAlert({ message: '', isError: false })
            }, 1000)
        },
        onCompleted: (result) => {
            setImageFileUrl(result.getImageUploadUrl.imageUploadUrl)
            setIsImageChange(true)
            setValues({ ...values, product_image_url: `https://axra.sgp1.digitaloceanspaces.com/VJun/${result.getImageUploadUrl.imageName}` })
        },
    })

    const [ updateProduct ] = useMutation(UPDATE_PRODUCT, {
        onError: (error) => {
            console.log('error : ', error)
            setShowAlert({ message: 'Error on server', isError: true })
            setTimeout(() => {
                setShowAlert({ message: '', isError: false })
            }, 1000)
            setLoading(false)
        },
        onCompleted: () => {
            setValues({name: '', price: '', description: '', product_image_url: '', category: '', brand: '', discount: '', review: '', barcode: '' })
            setErrors({name: '', price: '', description: '', product_image_url: '', category: '', brand: '', discount: '', review: '', barcode: '' })
            setImageFile('')
            setImagePreview('')
            setLoading(false)
            props.productAlert('Product have been updated.', false)
            props.handleClose()
        },
    })

    useEffect(() => {
        let product = props.product
        setValues({ name: product.name, price: product.price, barcode: product.barcode??'', description: product.description, category: product.fk_product_category_id, brand: product.fk_brand_id, product_image_url: product.product_image_url, discount: product.discount_eligible, review: product.show_reviews })
        setTextValue(RichTextEditor.createValueFromString(product.description, 'html'))
        setImagePreview(product.product_image_url)
        let image_url = product.product_image_url
        setOldImageName(image_url.substring(image_url.lastIndexOf('/') + 1,image_url.lenght ))
    }, [props.product])

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

    const handleUpdate = async () => {
        setLoading(true)
        setErrors({name: '', price: '', description: '', product_image_url: '', category: '', brand: '', discount: '', review: '', barcode: '' })
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
        if(!values.product_image_url) {
            errorObject.product_image_url = 'Image field is required.'
            isErrorExit = true
        }
        if(!values.category) {
            errorObject.category = 'Category field is required.'
            isErrorExit = true
        }
        if(!values.brand) {
            errorObject.brand = 'Brand field is required.'
            isErrorExit = true
        }
        if(isErrorExit) {
            setErrors({ ...errorObject })
            setLoading(false)
            return
        }
        try {
            if(isImageChange) {
                await imageService.uploadImage(imageFileUrl, imageFile)
                deleteImage({ variables: { image_name: oldImageName } })
            }
            updateProduct({variables: { ...values, id: props.product_id }})
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

    const onChange = (value) => {
        setTextValue(value)
       setValues({ ...values, description: value.toString('html') })
    }

    return (
        <div>
        <Box
            sx={{
            display: 'flex',
            flexDirection: 'column'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
                <Box sx={{ flex: 2 }}>
                    <Box sx={{ display: 'inline-flex', flexDirection: 'column', flex: 3, width: '100%', minHeight: '300px', my: 2 }}>
                        <CardMedia
                            component="img"
                            image={imagePreview}
                            alt="Product"
                            sx={{ bgcolor: '#cecece', height: '300px', objectFit: 'contain', borderRadius: '10px', padding: 1 }}
                        />
                        <Typography variant="span" component="div" >1024 * 1024 recommended</Typography>
                    </Box>
                    <Box>
                        <InputLabel>Description</InputLabel>
                        <RichTextEditor style={{ height: '100px' }} value={textValue} onChange={onChange} toolbarConfig={toolbarConfig} />
                        {
                            errors.description && <FormHelperText error >{ errors.description }</FormHelperText>
                        }
                    </Box>
                </Box>
                <Box sx={{ flex: 5, ml: 5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                        <Typography variant='h4' component='h2' sx= {{ m: 3 }} >Update Product</Typography>
                        <Button onClick={props.handleClose} variant="contained" sx={{ height: 40, minWidth: 'auto', width: 40, borderRadius: '50%', bgcolor: 'black' }}><CloseIcon /></Button>
                    </Box>
                    <Box sx={{flex: 2}}>
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
                                        category_result.data.product_categories.map(c => (
                                            <MenuItem key={c.id} value={c.id} >{c.product_category_name}</MenuItem>
                                        ))
                                    }
                                </Select>
                                {
                                    errors.category && <FormHelperText error >{errors.category}</FormHelperText>
                                }
                            </FormControl>
                            <FormControl sx={{ m: 2 }} variant="outlined">
                                <InputLabel id="brand">Brand</InputLabel>
                                <Select
                                    labelId="brand"
                                    value={values.brand}
                                    label="Brand"
                                    onChange={handleChange('brand')}
                                    error={errors.brand? true:false}
                                >
                                    {
                                        brand_result.data.brand_name.map(b => (
                                            <MenuItem key={b.id} value={b.id} >{b.name}</MenuItem>
                                        ))
                                    }
                                </Select>
                                {
                                    errors.brand && <FormHelperText error >{errors.brand}</FormHelperText>
                                }
                            </FormControl>
                            <FormControl sx={{ m: 2 }} variant="outlined">
                                <InputLabel id="discount">Discount Eligible</InputLabel>
                                <Select
                                    labelId="discount"
                                    value={values.discount}
                                    label="Discount Eligible"
                                    onChange={handleChange('discount')}
                                    error={errors.discount? true:false}
                                >
                                    <MenuItem value={false} >False</MenuItem>
                                    <MenuItem selected value={true} >True</MenuItem>
                                </Select>
                                {
                                    errors.discount && <FormHelperText error >{errors.discount}</FormHelperText>
                                }
                            </FormControl>
                            <FormControl sx={{ m: 2 }} variant="outlined">
                                <InputLabel id="review">Show Review</InputLabel>
                                <Select
                                    labelId="review"
                                    value={values.review}
                                    label="Show Review"
                                    onChange={handleChange('review')}
                                    error={errors.review? true:false}
                                >
                                    <MenuItem value={false} >False</MenuItem>
                                    <MenuItem selected value={true} >True</MenuItem>
                                </Select>
                                {
                                    errors.review && <FormHelperText error >{errors.review}</FormHelperText>
                                }
                            </FormControl>
                            <FormControl sx={{ m: 2 }} variant="outlined">
                                <TextField id="barcode" label="Barcode"
                                    value={values.barcode}
                                    onChange={handleChange('barcode')}
                                    error={errors.barcode? true: false}
                                    helperText={errors.barcode}
                                />
                            </FormControl>
                            <FormControl sx={{ m: 2 }} variant="outlined">
                                <LoadingButton
                                    variant="contained"
                                    loading={loading}
                                    onClick={handleUpdate}
                                    sx={{ backgroundColor: '#4b26d1', alignSelf: 'end' }}
                                >
                                    Update
                                </LoadingButton>
                            </FormControl>
                        </Box>
                    </Box>
                </Box>
            </Box>
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

export default UpdateProduct