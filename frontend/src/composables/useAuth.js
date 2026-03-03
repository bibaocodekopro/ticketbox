import { ref, computed, onMounted } from 'vue'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode' // npm install jwt-decode

const user = ref(null)
const isAuthenticated = computed(() => !!user.value)

export function useAuth() {
    // Kiểm tra token khi khởi tạo
    const checkAuth = () => {
        const token = Cookies.get('token')
        if (token) {
            try {
                // Decode token để lấy thông tin user
                const decoded = jwtDecode(token)
                user.value = {
                    id: decoded.id,
                    email: decoded.email,
                    role: decoded.role,
                    // ... các thông tin khác
                }
            } catch (err) {
                console.error('Invalid token:', err)
                logout()
            }
        } else {
            user.value = null
        }
    }

    // Login
    const login = (userData) => {
        user.value = userData
    }

    // Logout
    const logout = () => {
        Cookies.remove('token')
        user.value = null
        // Redirect về trang chủ
        window.location.href = '/'
    }

    // Gọi checkAuth khi khởi tạo
    onMounted(() => {
        checkAuth()
    })

    return {
        user,
        isAuthenticated,
        login,
        logout,
        checkAuth
    }
}