import axios from "axios";

const apiRequest = axios.create({
    baseURL:"https://spacekc.onrender.com/api",
    withCredentials:true,
})
export default apiRequest;