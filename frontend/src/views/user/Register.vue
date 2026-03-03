<template>
    <div class="register-wrapper">
        <div class="overlay"></div>

        <a-card class="register-card" :bordered="false">
            <div class="logo">
                <h1 class="brand">TicketBox</h1>
                <p>Create your account</p>
            </div>

            <a-form layout="vertical" :model="form" @finish="handleRegister">

                <!-- Email -->
                <a-form-item label="Email" name="email" :rules="[
                    { required: true, message: 'Please input your email' },
                    { type: 'email', message: 'Invalid email format' }
                ]">
                    <a-input v-model:value="form.email" size="large" placeholder="Enter your email">
                        <template #prefix>
                            <MailOutlined />
                        </template>
                    </a-input>
                </a-form-item>

                <!-- Password -->
                <a-form-item label="Password" name="password" :rules="[
                    { required: true, message: 'Please input your password' },
                    { min: 6, message: 'Password must be at least 6 characters' }
                ]">
                    <a-input-password v-model:value="form.password" size="large" placeholder="Enter your password">
                        <template #prefix>
                            <LockOutlined />
                        </template>
                    </a-input-password>
                </a-form-item>

                <!-- Confirm Password -->
                <a-form-item label="Confirm Password" name="confirmPassword" :rules="[
                    { required: true, message: 'Please confirm your password' },
                    { validator: validateConfirmPassword }
                ]">
                    <a-input-password v-model:value="form.confirmPassword" size="large"
                        placeholder="Re-enter your password">
                        <template #prefix>
                            <LockOutlined />
                        </template>
                    </a-input-password>
                </a-form-item>

                <a-button type="primary" size="large" block :loading="loading" html-type="submit" class="register-btn">
                    Register
                </a-button>

                <div class="login-link">
                    <span>Already have an account?</span>
                    <a @click="goLogin">Login</a>
                </div>

            </a-form>
        </a-card>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { message } from "ant-design-vue"
import { MailOutlined, LockOutlined } from "@ant-design/icons-vue"
import { register } from "@/api/authService"

const router = useRouter()

const loading = ref(false)

const form = reactive({
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER",
})

const validateConfirmPassword = async (_, value) => {
    if (!value) {
        return
    }
    if (value !== form.password) {
        return Promise.reject("Passwords do not match")
    }
    return Promise.resolve()
}

const handleRegister = async () => {
    loading.value = true

    try {
        await register(form)

        message.success("Account created successfully!")
        router.push("/login")
    } catch (err) {
        console.log(err)
        message.error(err.response?.data?.message || "Register failed")
    } finally {
        loading.value = false
    }
}

const goLogin = () => {
    router.push("/login")
}
</script>

<style scoped>
.register-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.overlay {
    position: absolute;
    inset: 0;
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.05);
}

.register-card {
    position: relative;
    width: 400px;
    border-radius: 16px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.logo {
    text-align: center;
    margin-bottom: 25px;
}

.brand {
    font-size: 26px;
    font-weight: 700;
}

.logo {
    text-align: center;
    margin-bottom: 20px;
}

.logo h1 {
    font-weight: bold;
    margin-bottom: 5px;
}

.logo p {
    color: #888;
}

.ant-form-item-label>label {
    color: white !important;
}

.ant-input,
.ant-input-password {
    border-radius: 10px !important;
}

.register-btn {
    margin-top: 10px;
    border-radius: 10px !important;
    height: 45px;
    font-weight: 600;
}

.login-link {
    margin-top: 15px;
    text-align: center;
    color: white;
}

.login-link span {
    color: black;
    font-size: 13px;
    margin-right: 5px;
}
</style>