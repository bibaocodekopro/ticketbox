import api from "./axios"

export const login = (data) => {
    return api.post("/login", data)
}

export const register = (data) => {
    return api.post("/register", data)
}

export const getProfile = () => {
    return api.get("/me")
}

export const logout = () => {
    return api.post("/logout")
}