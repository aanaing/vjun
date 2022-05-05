import React, { useEffect, useState } from "react"
import imageService from "../../services/image";
import { useMutation } from '@apollo/client'
import { GET_IMAGE_UPLOAD_URL } from '../../gql/misc'
import { UPDATE_CATEGORY } from '../../gql/categories'

import { Box, Card, CardContent, FormControl, TextField, CardMedia, Alert, Typography, Button,
InputLabel, MenuItem, Select, FormHelperText
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

const EditCategory = ({ handleClose, category }) => {

    const [ loading, setLoading ] = useState(false)
    const [ showAlert, setShowAlert ] = useState({ message: '', isError: false });
    const [ values, setValues ] = useState({
        name: '', device_type: '',  image_url: ''
    })
    const [ errors, setErrors ] = useState({
        name: '', device_type: '', image_url: ''
    })
    const [ imagePreview, setImagePreview ] = useState(null)
    const [ imageFile, setImageFile ] = useState(null)
    const [ imageFileUrl, setImageFileUrl ] = useState(null)
    const [ oldImageName, setOldImageName ] = useState('')

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    useEffect(() => {
        if(category) {
            setValues({ name: category.product_category_name, device_type: category.device_type, image_url: category.product_category_image_url })
            setImagePreview(category.product_category_image_url)
            let image_url = category.product_category_image_url
            setOldImageName(image_url.substring(image_url.lastIndexOf('/') + 1,image_url.lenght ))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category])

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
    })

    const [ updateCategory ] = useMutation(UPDATE_CATEGORY, {
        onError: (error) => {
            console.log('error : ', error)
            setShowAlert({ message: 'Error on server', isError: true })
            setTimeout(() => {
                setShowAlert({ message: '', isError: false })
            }, 1000)
            setLoading(false)
        },
        onCompleted: () => {
            // setValues({ name: '', device_type: '',  image_url: ''})
            setErrors({ name: '', device_type: '',  image_url: '' })
            setImageFile('')
            // setImagePreview('')
            setLoading(false)
            setShowAlert({ message: 'Category have been updated.', isError: false })
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

    const handleUpdate = async () => {
        setLoading(true)
        setErrors({name: '', device_type: '',  image_url: ''})
        let isErrorExit = false
        let errorObject = {}
        if(!values.name) {
            errorObject.name = 'Name field is required.'
            isErrorExit = true
        }
        if(!values.device_type) {
            errorObject.price = 'Device Type field is required.'
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
            await imageService.uploadImage(imageFileUrl, imageFile)
            updateCategory({variables: { ...values, image_name: oldImageName, id: category.id }})
        } catch (error) {
            console.log('error : ', error)
        }
    }

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                <Typography variant='h4' component='h2' sx= {{ m: 3 }} >Edit Category</Typography>
                <Button onClick={handleClose} variant="outlined" sx={{ height: 50 }}>Close</Button>
            </Box>
            <Card sx={{ display: 'flex', justifyContent: 'space-between', }}>
                <CardMedia
                    component="img"
                    image={imagePreview}
                    alt="Category Photo"
                    sx={{flex: 1, m: 5, bgcolor: '#cecece', maxHeight: 300}}
                />
                <CardContent sx={{flex: 3}}>
                    <Box sx={{ display: 'flex', flexDirection: 'column'}} >
                        <FormControl sx={{ m: 2 }}>
                            <TextField id="image" placeholder="Upload image" InputLabelProps={{ shrink: true }} label="Upload Image"
                                onChange={imageChange}
                                error={errors.image_url? true: false}
                                helperText={errors.image_url}
                                type="file" accept="image/png, image/jpeg, image/jpg, image/gif, image/svg+xml"
                            />
                        </FormControl>
                        <FormControl sx={{ m: 2 }} variant="outlined">
                            <TextField id="name" label="Name"
                                value={values.name}
                                onChange={handleChange('name')}
                                error={errors.name? true: false}
                                helperText={errors.name}
                            />
                        </FormControl>
                        <FormControl sx={{ m: 2 }} variant="outlined">
                          <InputLabel id="device_type">Device Type</InputLabel>
                          <Select
                            labelId="device_type"
                            value={values.device_type}
                            label="Device Type"
                            onChange={handleChange('device_type')}
                            error={errors.device_type? true:false}
                          >
                            <MenuItem value='All' >All</MenuItem>
                            <MenuItem value='IOS' >IOS</MenuItem>
                            <MenuItem value='Android' >Android</MenuItem>
                          </Select>
                          {
                            errors.device_type && <FormHelperText error >{errors.device_type}</FormHelperText>
                          }
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

export default EditCategory