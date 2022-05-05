import axios from "axios";

const uploadImage = async (uri, data) => {
    const config = {
        headers: {
            "Content-Type": "image/*",
            "x-amz-acl": "public-read"
        }
    }
    const response = await axios.put(uri, data, config)
    return response
}

const deleteImage = async (uri, data) => {
    const config = {
        headers: {
            "Content-Type": "image/*",
            "x-amz-acl": "public-read"
        }
    }
    const response = await axios.post(uri, data, config)
    return response
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    uploadImage, deleteImage
}