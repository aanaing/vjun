import { gql } from '@apollo/client'

export const GET_IMAGE_UPLOAD_URL = gql`
    mutation Get_Image_Upload_Url {
        getImageUploadUrl {
        error
        imageName
        imageUploadUrl
        message
        }
    }  
`