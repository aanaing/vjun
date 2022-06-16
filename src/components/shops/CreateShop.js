import React, { useState } from "react"
import imageService from "../../services/image";
import { useMutation } from '@apollo/client'
import { GET_IMAGE_UPLOAD_URL } from '../../gql/misc'
import { CREATE_SHOP } from '../../gql/shops'

import { Box, FormControl, TextField, Typography, CardMedia, Alert,
    Button
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
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

const CreateShop = (props) => {

    const [ loading, setLoading ] = useState(false)
    const [ showAlert, setShowAlert ] = useState({ message: '', isError: false });
    const [ values, setValues ] = useState({
        name: '', link: '', address: '', photo: ''
    })
    const [ errors, setErrors ] = useState({
        name: '', link: '', address: '', photo: ''
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
            setValues({ ...values, photo: `https://axra.sgp1.digitaloceanspaces.com/VJun/${result.getImageUploadUrl.imageName}` })
        },
    })

    const [ createShop ] = useMutation(CREATE_SHOP, {
        onError: (error) => {
            console.log('error : ', error)
            setShowAlert({ message: 'Error on server', isError: true })
            setTimeout(() => {
                setShowAlert({ message: '', isError: false })
            }, 1000)
            setLoading(false)
        },
        onCompleted: () => {
            setValues({name: '', link: '', address: '', photo: ''})
            setErrors({name: '', link: '', address: '', photo: ''})
            setImageFile('')
            setImagePreview('')
            setLoading(false)
            setShowAlert({ message: 'Shop have been created.', isError: false })
            setTimeout(() => {
                setShowAlert({ message: '', isError: false })
            }, 1000)
        },
    })

    const imageChange = async (e) => {
        if(e.target.files && e.target.files[0]) {
            let img = e.target.files[0]
            if(!fileTypes.includes(img.type)) {
                setErrors({ ...errors, photo: 'Please select image. (PNG, JPG, JPEG, GIF, ...)' })
                return
            }
            if(img.size > 10485760 ) {
                setErrors({ ...errors, photo: 'Image file size must be smaller than 10MB.' })
                return
            }
            setImageFile(img)
            setImagePreview(URL.createObjectURL(img))
            getImageUrl()
        }
    }

    const handleCreate = async () => {
        setLoading(true)
        setErrors({name: '', link: '', address: '', photo: ''})
        let isErrorExit = false
        let errorObject = {}
        if(!values.name) {
            errorObject.name = 'Shop Name field is required.'
            isErrorExit = true
        }
        if(!values.link) {
            errorObject.name = 'Map Link field is required.'
            isErrorExit = true
        }
        if(!values.address) {
            errorObject.name = 'Address field is required.'
            isErrorExit = true
        }
        if(!values.photo || !imageFile) {
            errorObject.photo = 'Photo is required.'
            isErrorExit = true
        }
        if(isErrorExit) {
            setErrors({ ...errorObject })
            setLoading(false)
            return
        }
        try {
            await imageService.uploadImage(imageFileUrl, imageFile)
            createShop({variables: { ...values }})
        } catch (error) {
            console.log('error : ', error)
        }
    }

    return (
        <div style={{ position: 'relative' }}>
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
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
                <Box sx={{ flex: 2 }}>
                    <Box sx={{ display: 'inline-flex', flexDirection: 'column', flex: 3, width: '100%', minHeight: '300px', my: 2 }}>
                        <CardMedia
                            component="img"
                            image={imagePreview}
                            alt="Shop"
                            sx={{ bgcolor: '#cecece', height: '300px', objectFit: 'contain', borderRadius: '10px', padding: 1 }}
                        />
                        <Typography variant="span" component="div" >1024 * 1024 recommended</Typography>
                    </Box>
                </Box>
                <Box sx={{ flex: 5, ml: 5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                        <Typography variant='h4' component='h2' sx= {{ m: 3 }} >Create Shop</Typography>
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
                                <TextField id="link" label="Map Link"
                                    value={values.link}
                                    onChange={handleChange('link')}
                                    error={errors.link? true: false}
                                    helperText={errors.link}
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
                                <TextField id="address" label="Address"
                                    multiline
                                    value={values.address}
                                    onChange={handleChange('address')}
                                    error={errors.address? true: false}
                                    helperText={errors.address}
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

export default CreateShop