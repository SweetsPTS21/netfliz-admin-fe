import { loginTypes } from '@/store/types/types.js'

const initialState = {
    loading: false,
    user: null,
    email: '',
    password: '',
    rememberMe: false,
    error: null
}

const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case loginTypes.REQUEST:
            return {
                ...state,
                email: action.email,
                password: btoa(action.password),
                rememberMe: action.rememberMe
            }
        case loginTypes.SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.user,
            }
        case loginTypes.LOGOUT:
            return {
                ...state,
                user: null
            }
        case loginTypes.GET_TOKEN_REQUEST:
            return {
                ...state,
                loading: true
            }
        case loginTypes.LOADING_LOGIN:
            return {
                ...state,
                loading: action.payload
            }
        case loginTypes.CLEAR_LOGIN_DATA:
            return {
                ...state,
                email: null,
                password: null,
                rememberMe: false,
                loginSuccess: false,
                error: null
            }
        default:
            return state
    }
}

export default loginReducer
