import axios from "axios";

const apiRequest = axios.create({
    baseURL:"https://spacekc-backend.onrender.com/api",
    withCredentials:true,
})
export default apiRequest;