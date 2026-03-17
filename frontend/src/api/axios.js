
import axios from "axios"
import Cookies from 'js-cookie'

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    timeout: 10000,
    withCredentials: true, // QUAN TRỌNG: cho phép gửi/nhận cookie
})

// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
    // Lấy token từ cookie thay vì localStorage
    const token = Cookies.get('token')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Xóa cookie khi hết hạn
            Cookies.remove('token')
            window.location.href = "/login"
        }
        return Promise.reject(error)
    }
)

export default api