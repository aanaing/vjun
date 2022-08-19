import { gql } from "@apollo/client";

export const GET_IMAGE_UPLOAD_URL = gql`
  mutation Get_Image_Upload_Url {
    getImageUploadUrl {
      error
      imageName
      imageUploadUrl
      message
    }
  }
`;

export const DELETE_IMAGE = gql`
  mutation DeletImage($image_name: String!) {
    deleteImage(imageName: $image_name) {
      error
      message
    }
  }
`;

export const CATEGORIES = gql`
  query Categories {
    product_categories {
      id
      product_category_name
    }
  }
`;

export const BRANDS = gql`
  query brands {
    brand_name {
      id
      name
    }
  }
`;

export const CUSTOMIZATION_MODELS = gql`
  query Customization_Model {
    customization_brand {
      brand_name
      id
    }
  }
`;

export const MODEL_IDS = gql`
  query Customization_Model {
    customization_model {
      id
      model_name
    }
  }
`;
