import { loginTypes } from "../types/types.js"

export const getTokenStart = (email) => ({
    type: loginTypes.GET_TOKEN_REQUEST,
    email
})

export const getMeStart = () => ({
    type: loginTypes.GET_ME
})

export const loginStart = ({ email, password, rememberMe }) => ({
    type: loginTypes.REQUEST,
    email,
    password,
    rememberMe,
    loggedInSuccess: false
})

export const loginSuccess = (user) => ({
    type: loginTypes.SUCCESS,
    user: user
})

export const loginError = (error) => ({
    type: loginTypes.FAILURE,
    error: error,
    loginSuccess: false
})

export const logoutStart = () => ({
    type: loginTypes.LOGOUT
})

export const clearLogin = () => ({
    type: loginTypes.CLEAR_LOGIN_DATA
})