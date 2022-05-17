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

export const CATEGORIES = gql`
query Categories {
    product_categories {
        id
        product_category_name
    }
}
`

export const BRANDS = gql`
query brands {
    brand_name {
      id
      name
    }
  }
  
`