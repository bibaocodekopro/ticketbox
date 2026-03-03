<template>
  <div class="login-wrapper">
    <div class="overlay"></div>

    <a-card class="login-card" :bordered="false">
      <div class="logo">
        <h1 class="brand">TicketBox</h1>
        <p>Sign in to continue</p>
      </div>

      <a-form layout="vertical" :model="form" @finish="handleLogin">
        <a-form-item label="Email" name="email" :rules="[{ required: true, message: 'Please input your email' }]">
          <a-input v-model:value="form.email" size="large" placeholder="Enter your email">
            <template #prefix>
              <MailOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="Password" name="password"
          :rules="[{ required: true, message: 'Please input your password' }]">
          <a-input-password v-model:value="form.password" size="large" placeholder="Enter your password">
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <div class="extra-options">
          <a-checkbox v-model:checked="remember">
            Remember me
          </a-checkbox>
          <a href="#">Forgot password?</a>
        </div>

        <a-button type="primary" size="large" block :loading="loading" html-type="submit" class="login-btn">
          Sign In
        </a-button>
        <div class="register">
          <span>Don't have an account?</span>
          <a-button type="link" @click="handleRegister">Register</a-button>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue"
import { message } from "ant-design-vue"
import { MailOutlined, LockOutlined } from "@ant-design/icons-vue"
import { login } from "@/api/authService"
import { useRouter, useRoute } from "vue-router";
import Cookies from 'js-cookie';
import { useAuth } from "@/composables/useAuth"

const { setAuthFromToken } = useAuth()

const router = useRouter();
const route = useRoute();

const form = reactive({
  email: "",
  password: "",
})

const remember = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true

  try {
    const res = await login(form)

    const token = res.data.token

    Cookies.set('token', token, { expires: 1 })



    message.success("Login successful!")

    window.location.href = route.query.redirect || "/"

  } catch (err) {
    message.error(err.response?.data?.message || "Login failed")
  } finally {
    loading.value = false
  }
}

const handleRegister = () => {
  router.push("/register")
}
</script>

<style scoped>
.login-wrapper {
  position: relative;
  /* height: 100vh; */
  display: flex;
  justify-content: center;
  align-items: center;
  /* background: linear-gradient(135deg, #1677ff, #722ed1); */
}

.overlay {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(8px);
}

.login-card {
  position: relative;
  width: 400px;
  border-radius: 16px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
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

.extra-options {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.register {
  margin-top: 15px;
  text-align: center;
  color: white;
}

.register span {
  color: black;
  font-size: 13px;
  margin-right: 5px;
}

/* Fix Chrome autofill background */
/* ===== INPUT NỀN TRONG SUỐT - CHỮ ĐEN ===== */
:deep(.ant-input),
:deep(.ant-input-password input) {
  background: transparent !important;
  color: black !important;
}

/* Placeholder màu xám nhẹ */
:deep(.ant-input::placeholder),
:deep(.ant-input-password input::placeholder) {
  color: rgba(0, 0, 0, 0.4) !important;
}

/* ===== FIX CHROME AUTOFILL ===== */
:deep(input:-webkit-autofill),
:deep(input:-webkit-autofill:hover),
:deep(input:-webkit-autofill:focus),
:deep(input:-webkit-autofill:active) {
  -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
  box-shadow: 0 0 0 1000px transparent inset !important;

  -webkit-text-fill-color: black !important;
  caret-color: black !important;

  transition: background-color 9999s ease-in-out 0s;
}
</style>